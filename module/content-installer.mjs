/** Instala conteúdo original como três compêndios de mundo na primeira sessão do Mestre.
 * Escolha intencional: evita dependência de nívelDB pré-compilado e funciona também em hospedagens remotas.
 */
const ROOT="systems/terra-devastada";
const SYS="terra-devastada";
const PACKS=[
  {name:"td-itens-45",label:"Terra Devastada | 45 Itens",type:"Item",path:"data/items.json"},
  {name:"td-personagens-15",label:"Terra Devastada | 15 Personagens",type:"Actor",path:"data/actors.json"},
  {name:"td-macros",label:"Terra Devastada | Macros",type:"Macro",path:"data/macros.json"}
];

async function readJSON(path) {
  const response=await fetch(`${ROOT}/${path}`);
  if(!response.ok) throw new Error(`Falha ao carregar ${path}: HTTP ${response.status}`);
  return response.json();
}

async function ensureWorldPack(spec) {
  const id=`world.${spec.name}`;
  let pack=game.packs.get(id);
  if(!pack) {
    const API=foundry.documents.collections.CompendiumCollection;
    pack=await API.createCompendium({name:spec.name,label:spec.label,type:spec.type,system:SYS});
  }
  if(!pack || pack.documentName!==spec.type) throw new Error(`Compêndio ${spec.name} incompatível.`);
  return pack;
}

async function fillPack(spec) {
  const pack=await ensureWorldPack(spec);
  const data=await readJSON(spec.path);
  const klass={Actor,Item,Macro}[spec.type];
  if(!klass || !Array.isArray(data)) throw new Error(`Conteúdo inválido para ${spec.name}`);
  const locked=pack.locked;
  if(locked) await pack.configure({locked:false});
  try {
    const existing=await pack.getIndex();
    const ids=new Set(Array.from(existing, r=>r._id));
    const additions=data.filter(d=>!ids.has(d._id));
    if(additions.length) await klass.createDocuments(additions,{pack:pack.collection,keepId:true});
    return {name:spec.name,total:data.length,added:additions.length};
  } finally {
    if(locked) await pack.configure({locked:true});
  }
}

export async function instalarCompendios() {
  if(!game.user?.isGM) {ui.notifications.warn("Somente o Mestre pode instalar os compêndios.");return null;}
  const done=[];
  for(const spec of PACKS) {
    try {done.push(await fillPack(spec));}
    catch(error){console.error(`TERRA DEVASTADA | ${spec.name}`,error);ui.notifications.error(`Falha ao criar ${spec.label}: ${error.message}`);throw error;}
  }
  await game.settings.set(SYS,"contentInstalled",true);
  ui.notifications.info(`Terra Devastada: 45 itens, 15 personagens e 1 macro disponíveis nos compêndios.`);
  console.info("TERRA DEVASTADA | Conteúdo instalado",done);
  return done;
}

export function registerContentSettings() {
  game.settings.register(SYS,"contentInstalled",{name:"Compêndios instalados",scope:"world",config:false,type:Boolean,default:false});
  game.settings.register(SYS,"contentPrompted",{name:"Aviso dos compêndios exibido",scope:"client",config:false,type:Boolean,default:false});
}

export async function offerInitialContentInstall() {
  if(!game.user?.isGM || game.settings.get(SYS,"contentInstalled") || game.settings.get(SYS,"contentPrompted")) return;
  await game.settings.set(SYS,"contentPrompted",true);
  const ok=await foundry.applications.api.DialogV2.confirm({
    window:{title:"TERRA DEVASTADA · CONTEÚDO DE SOBREVIVÊNCIA"},
    content:`<p>Instalar no <b>mundo atual</b> três compêndios: <b>45 itens</b>, <b>15 sobreviventes prontos</b> e <b>1 macro geradora</b>?</p><p>Se cancelar, use <code>game.terraDevastada.instalarCompendios()</code> no console do Mestre para instalar depois. Registros existentes não são sobrescritos.</p>`,
    yes:{label:"INSTALAR COMPÊNDIOS"},no:{label:"Agora não"},rejectClose:false
  });
  if(ok) await instalarCompendios();
}

export function getContentPacks(){return PACKS.map(x=>({name:x.name,label:x.label,type:x.type}));}
