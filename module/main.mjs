import {ActorData,ItemData} from "./models.mjs";
import {TerraActorSheet,TerraItemSheet} from "./sheets.mjs";
import {openRollDialog} from "./rolls.mjs";
import * as rules from "./rules.mjs";
import {gerarAtor} from "./actor-generator.mjs";
import {instalarCompendios,registerContentSettings,offerInitialContentInstall,getContentPacks} from "./content-installer.mjs";

Hooks.once("init",()=>{
  console.info("TERRA DEVASTADA | Sistema Acepção v0.2.0 iniciado.");
  Handlebars.registerHelper("eq", (a,b)=>a===b);
  for(const type of ["protagonista","sobrevivente","zumbi"]) CONFIG.Actor.dataModels[type]=ActorData;
  CONFIG.Item.dataModels.equipamento=ItemData;
  registerContentSettings();
  const registry=foundry.applications.apps.DocumentSheetConfig;
  registry.registerSheet(foundry.documents.Actor,"terra-devastada",TerraActorSheet,{types:["protagonista","sobrevivente","zumbi"],makeDefault:true,label:"Ficha Terra Devastada"});
  registry.registerSheet(foundry.documents.Item,"terra-devastada",TerraItemSheet,{types:["equipamento"],makeDefault:true,label:"Equipamento Terra Devastada"});
  // O rastreador nativo não conhece o pool narrativo escolhido por ação.
  CONFIG.Combat.initiative={formula:"0",decimals:0};
  game.terraDevastada=Object.freeze({
    versao:"0.2.0", regras:rules,
    gerarAtor, instalarCompendios, listarCompendios:getContentPacks,
    rolar:(actor,mode="acao")=>openRollDialog(actor,mode),
    abrirFicha:actor=>actor.sheet.render({force:true})
  });
});

Hooks.once("ready",async()=>{
  console.info("TERRA DEVASTADA | Sistema pronto: fichas, rolagens e compêndios.");
  try {await offerInitialContentInstall();}
  catch(err){console.error("TERRA DEVASTADA | Falha ao oferecer compêndios",err);}
});
