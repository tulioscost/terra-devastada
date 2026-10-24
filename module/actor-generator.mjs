/** Gerador de atores completos: conserva a estrutura narrativa do sistema Acepção. */
import {initialConviction} from "./rules.mjs";
const ROOT = "systems/terra-devastada";
const firstNames = ["André", "Bianca", "Camila", "Daniel", "Elisa", "Felipe", "Gabriel", "Helena", "Isabela", "Júlio", "Larissa", "Lucas", "Marina", "Mateus", "Natália", "Otávio", "Paula", "Renato", "Sofia", "Tiago", "Valéria", "Vinícius", "Wesley", "Zélia"];
const lastNames = ["Andrade", "Barbosa", "Campos", "Carvalho", "Costa", "Dias", "Fernandes", "Gomes", "Lima", "Machado", "Martins", "Oliveira", "Ribeiro", "Silva", "Torres", "Vieira"];
const random = arr => arr[Math.floor(Math.random()*arr.length)];
let templatesCache;

async function getTemplates() {
  if (!templatesCache) {
    const response = await fetch(`${ROOT}/data/actors.json`);
    if (!response.ok) throw new Error(`Não foi possível abrir a base de personagens: ${response.status}`);
    templatesCache = await response.json();
    if (!Array.isArray(templatesCache) || templatesCache.length !== 15) throw new Error("Base de personagens incompleta.");
  }
  return templatesCache;
}

/** Construção independente de documentos Foundry, testável sem instância do aplicativo. */
export function buildActorData(base, name, {tipo = "protagonista", extraTraits = [], horror = null} = {}) {
  if (!base || !base.system || !Array.isArray(base.system.caracteristicas)) throw new Error("Arquétipo inválido");
  const source = structuredClone(base);
  delete source._id;
  delete source._stats;
  source.type = tipo;
  source.name = String(name || base.name).trim();
  source.system.jogador = "";
  source.system.caracteristicas = [...new Set([...source.system.caracteristicas.slice(0,9), ...extraTraits, ...source.system.caracteristicas.slice(9)])].slice(0,12);
  source.system.condicoes = source.system.condicoes.map(c=>({...c}));
  source.system.trunfos = [...source.system.trunfos];
  source.system.dramas = [...source.system.dramas];
  source.system.horror = horror === null ? source.system.horror : Math.max(0,Math.trunc(Number(horror)));
  source.system.conviccao = initialConviction(source.system.caracteristicas.length,source.system.trunfos.length);
  source.system.bonusConviccaoCena = 0;
  source.system.reacoes = 0;
  source.system.febreZ = false;
  source.system.historico += `\n\nNovo sobrevivente: ${source.name}. Perfil adaptado para uma nova campanha.`;
  source.system.notas += "\nGerado pela macro de sobreviventes; personalize os vínculos e recursos com o Mestre.";
  source.items = (source.items || []).map(i=>{const copy = structuredClone(i);delete copy._id;return copy;});
  source.prototypeToken = { ...(source.prototypeToken || {}), name:source.name, actorLink:true };
  source.flags = {"terra-devastada":{origin:"macro-v0.2.0", archetype:base.name}};
  return source;
}

/** Ao executar a Macro, oferece escolha de arquétipo, nome e variação. */
export async function gerarAtor() {
  if (!game.user?.isGM) {ui.notifications.warn("Somente o Mestre pode gerar novos atores.");return null;}
  const templates = await getTemplates();
  const escape = foundry.utils.escapeHTML ?? (value=>String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
  const opts = [`<option value="random">Aleatório</option>`,...templates.map((p,n)=>`<option value="${n}">${escape(p.system.conceito)} — ${escape(p.name)}</option>`)].join("");
  const data = await foundry.applications.api.DialogV2.input({
    window:{title:"TERRA DEVASTADA · GERADOR DE SOBREVIVENTE"},
    content:`<div class="td-generator"><p>A ficha será criada com 12 Características, três Condições, Trunfo, Drama, Citação, histórico, Convicção, Horror, ícone e inventário compatível.</p><label>Arquétipo<select name="modelo">${opts}</select></label><label>Nome (opcional)<input name="nome" placeholder="Gerar nome automaticamente"></label><label>Tipo<select name="tipo"><option value="protagonista">Protagonista</option><option value="sobrevivente">Sobrevivente / NPC</option></select></label><label><input type="checkbox" name="variar" value="1" checked> Variar Características e Horror</label></div>`,
    ok:{label:"GERAR FICHA COMPLETA"},rejectClose:false
  });
  if (!data) return null;
  const selected = data.modelo === "random" ? random(templates) : templates[Number(data.modelo)];
  if (!selected) throw new Error("Arquétipo não encontrado");
  const generatedName = String(data.nome || "").trim() || `${random(firstNames)} ${random(lastNames)}`;
  const variar = data.variar === true || data.variar === "1" || data.variar === "on";
  const another = random(templates.filter(a=>a._id!==selected._id));
  const changeTraits = variar ? another.system.caracteristicas.slice(0,3) : [];
  const horror = variar ? Math.max(0, selected.system.horror + Math.floor(Math.random()*5)-2) : null;
  const createdData = buildActorData(selected,generatedName,{tipo:data.tipo==="sobrevivente"?"sobrevivente":"protagonista",extraTraits:changeTraits,horror});
  const created = await Actor.create(createdData,{renderSheet:false});
  if (created) {ui.notifications.info(`Ficha completa criada: ${created.name}.`);await created.sheet.render({force:true});}
  return created;
}
