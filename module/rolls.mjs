import {successes, poolSize, resolution, horrorMagnitude, horrorEffect, convictionBonus, escapeHTML} from "./rules.mjs";
const D = foundry.applications.api.DialogV2;

function traitLines(actor) {
  const data = actor.system;
  const groups = [
    ["caracteristicas", "Características", (data.caracteristicas ?? []).map(x => String(x))],
    ["condicoes", "Condições", (data.condicoes ?? []).map(x => x.nome)],
    ["trunfos", "Trunfos", (data.trunfos ?? []).map(x => String(x))],
    ["dramas", "Dramas", (data.dramas ?? []).map(x => String(x))]
  ];
  return groups.map(([key,title,items]) => {
    if (!items.length) return "";
    return `<fieldset class="td-roll-group"><legend>${title}</legend>${items.map((entry,index) => `<label class="td-roll-trait"><span>${escapeHTML(entry)}</span><select name="trait-${key}-${index}"><option value="0">Não usar</option><option value="1">+1d</option><option value="-1">−1d</option></select></label>`).join("")}</fieldset>`;
  }).join("");
}

async function evaluateD6(count, explode) {
  const formula = explode ? `${count}d6x6` : `${count}d6`;
  const roll = await new Roll(formula).evaluate();
  const faces = roll.dice.flatMap(d => d.results.filter(r => r.active !== false).map(r => r.result));
  return {roll, faces, successes: successes(faces)};
}

async function publish(actor, {heading, detail, outcome, pool, roll, faces, rolled, auto=0, tags=[], luckFace=null}) {
  const c = faces.map(d => `<b class="td-die ${(luckFace === null ? d % 2 === 0 : d === luckFace) ? "td-hit" : "td-miss"}">${d}</b>`).join("");
  const content = `<div class="td-chat"><div class="td-chat-title">${escapeHTML(heading)}</div><div class="td-chat-details">${escapeHTML(detail)}</div><div class="td-dice">${c || '<span>Sem dados</span>'}</div><div class="td-chat-result"><strong>${rolled + auto} sucesso(s)</strong><span>${escapeHTML(outcome)}</span></div><small>${escapeHTML(`Reserva: ${pool}d6 | Sucessos dos dados: ${rolled} | Sucessos automáticos: ${auto}${tags.length ? " | " + tags.join("; ") : ""}`)}</small></div>`;
  await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}), content, ...(roll ? {rolls: [roll]} : {})});
}

async function applyHorrorFailure(actor, difference, description) {
  const e = horrorEffect(difference);
  const system = actor.system;
  const dramas = [...system.dramas, description || "Experiência traumática"];
  const condicoes = [...system.condicoes, {nome:e.condition, duracao:e.severity}];
  const changes = {
    "system.horror": system.horror + e.horror,
    "system.conviccao": Math.max(0, system.conviccao - 3),
    "system.dramas": dramas,
    "system.condicoes": condicoes
  };
  await actor.update(changes);
  return e;
}

/** Ação, reação, iniciativa e teste de Horror usam a mesma reserva contextual. */
export async function openRollDialog(actor, mode="acao") {
  if (!actor.isOwner) return ui.notifications.warn("Você não tem permissão para rolar por este personagem.");
  const isHorror = mode === "horror";
  const isReaction = mode === "reacao";
  const title = {acao:"Ação narrativa", reacao:"Reação", iniciativa:"Iniciativa", horror:"Assimilar Horror"}[mode] ?? "Rolagem";
  const horrorSelectors = `<div class="td-dialog-grid"><label>Envolvimento<select name="envolvimento"><option value="0">+0 — Espectador involuntário</option><option value="1">+1 — Espectador ato intencional</option><option value="2">+2 — Executor coagido / defesa</option><option value="3">+3 — Executor intencional ou vítima</option></select></label><label>Gravidade<select name="gravidade">${Array.from({length:7},(_,n)=>`<option value="${n}">+${n}</option>`).join("")}</select></label><label>Ligação afetiva<select name="ligacao"><option value="0">+0 — Animal qualquer</option><option value="1">+1 — Desafeto zumbificado</option><option value="2">+2 — Pessoa qualquer / desafeto</option><option value="3">+3 — Animal querido</option><option value="4">+4 — O próprio protagonista</option><option value="5">+5 — Ente querido zumbificado</option><option value="6">+6 — Ente querido</option></select></label></div><label>Drama, em caso de falha<input name="drama" placeholder="O que aconteceu na cena?" /></label>`;
  const common = `<div class="td-dialog-grid"><label>Modificador situacional (d6)<input name="situacao" type="number" value="0" step="1" min="-30" max="30" /></label>${mode === "acao" ? '<label>Dificuldade<select name="dificuldade"><option value="1">Simples — 1 sucesso</option><option value="2">Comum — 2 sucessos</option><option value="3">Difícil — 3 sucessos</option></select></label>' : ""}${mode === "iniciativa" ? '<label><input type="checkbox" name="naofisica" value="1" /> Primeira ação não física (+1d)</label>':''}</div>`;
  const form = `<div class="td-roll-dialog"><p>Escolha apenas os traços relevantes para esta ação, justificando seus efeitos na narrativa.</p>${isHorror?horrorSelectors:""}${traitLines(actor)}${common}<label>Objetivo ou descrição da ação<input name="descricao" placeholder="Como pretende agir?" /></label>${!isHorror && mode === "acao"?'<label><input type="checkbox" name="conviccao" value="1" /> Usar Convicção: custa Horror atual e concede sucessos por Trunfos (máximo de 3/cena)</label>':''}${!isHorror?'<label>Golpe de Sorte, se reserva zerada<select name="golpe"><option value="2">Escolher 2</option><option value="4">Escolher 4</option><option value="6">Escolher 6</option></select></label>':''}</div>`;
  const fd = await D.wait({window:{title:`${title} — ${actor.name}`}, content:form, rejectClose:false, buttons:[{action:"roll",label:"Rolar dados",icon:"fa-solid fa-dice",default:true,callback:(e,button)=>new FormData(button.form)},{action:"cancel",label:"Cancelar"}]});
  if (!(fd instanceof FormData)) return;
  const desc = String(fd.get("descricao") ?? "").trim();
  const picks=[];
  for(const [key,value] of fd.entries()) if(key.startsWith("trait-")) picks.push(Number(value));
  const mods = Number(fd.get("situacao")||0) + (mode === "iniciativa" && fd.has("naofisica") ? 1:0) - (isReaction ? actor.system.reacoes:0);
  const n = Math.min(100, poolSize([...picks,mods]));
  let goal = isHorror?1:Number(fd.get("dificuldade")||1);
  const isLuck = n === 0 && !isHorror;
  const preMagnitude = isHorror ? horrorMagnitude(fd.get("envolvimento"),fd.get("gravidade"),fd.get("ligacao")) : 0;
  const preDifference = isHorror ? preMagnitude - actor.system.horror : 0;
  // Sem teste quando a magnitude já foi assimilada; zero dados num teste de Horror resulta em falha.
  const mustRoll = !isHorror || (preDifference > 0 && n > 0);
  const rolledData = mustRoll ? await evaluateD6(isLuck ? 1 : n, !isLuck) : {roll:null,faces:[],successes:0};
  const {roll,faces,successes:rolled} = rolledData;
  const actual = isLuck ? (faces[0]===Number(fd.get("golpe")||2) ? 1:0) : rolled;
  let outcome = "";
  let auto=0;
  const tags=[];
  if(isLuck) tags.push(`Golpe de Sorte: ${fd.get("golpe")} (sem Surto de Sorte)`);
  if(isReaction) {
    outcome="Resultado de reação: compare com os sucessos do atacante.";
    await actor.update({"system.reacoes":actor.system.reacoes + 1});
  } else if(mode === "iniciativa") outcome="Iniciativa: ordenar pela quantidade de sucessos; empates exigem nova rolagem.";
  else if(isHorror) {
    const magnitude=preMagnitude;
    const difference=preDifference;
    tags.push(`Magnitude ${magnitude}; Horror anterior ${actor.system.horror}`);
    if(difference<=0) outcome="Cena já assimilada: nenhum teste era necessário; Horror preservado.";
    else if(actual>=1) outcome="Horror assimilado: nenhum novo Drama ou Condição.";
    else {
      const effect=await applyHorrorFailure(actor,difference,String(fd.get("drama")||desc).trim());
      outcome=`Falha de Horror! +${effect.horror} Horror; novo Drama e Condição: ${effect.condition}. Convicção −3.`;
      if(effect.disorder) outcome += ` Distúrbio ${effect.disorder}: definir narrativamente com o Mestre.`;
    }
    if(difference>=3 && Number(fd.get("envolvimento"))>=2) tags.push("Impedimento Moral: execução pode ser bloqueada; consultar Mestre");
  } else {
    if(fd.has("conviccao") && mode === "acao") {
      const cost=actor.system.horror;
      const bonus=convictionBonus(actor.system.trunfos.length,actor.system.bonusConviccaoCena);
      if(bonus>0 && actor.system.conviccao>=cost) {
        auto=bonus;
        await actor.update({"system.conviccao":actor.system.conviccao-cost, "system.bonusConviccaoCena":actor.system.bonusConviccaoCena+bonus});
        tags.push(`Convicção usada: custo ${cost}; bônus ${bonus}`);
      } else tags.push("Convicção não usada: pontos insuficientes ou limite da cena");
    }
    const status=resolution(actual+auto,goal);
    outcome=status==="sucesso"?"Objetivo alcançado":status==="parcial"?"Sucesso parcial: consequências limitadas a critério do Mestre":"Objetivo frustrado";
    if(mode==="acao") tags.push("Em ações diretas, compare os sucessos do alvo em vez da dificuldade");
  }
  await publish(actor,{heading:title,detail:desc||"Resolução narrativa",outcome,pool:n,roll,faces,rolled:actual,auto,tags,luckFace:isLuck ? Number(fd.get("golpe")||2) : null});
}

export async function previewHorror(actor) {
  await openRollDialog(actor,"horror");
}
