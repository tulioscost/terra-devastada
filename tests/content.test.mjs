import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {buildActorData} from '../module/actor-generator.mjs';
const root=resolve(import.meta.dirname,'..');
const read=(file)=>JSON.parse(readFileSync(resolve(root,file),'utf8'));
const items=read('data/items.json');
const actors=read('data/actors.json');
const macros=read('data/macros.json');
const categories=new Set(['arma','protecao','medicamento','municao','alimento','ferramenta','outro']);
const statKeys=['jogador','citacao','conceito','caracteristicas','condicoes','trunfos','dramas','horror','conviccao','bonusConviccaoCena','historico','notas','observacoes','reacoes','febreZ'];

test('45 itens originais com dados de equipamento completos, IDs e ícones existentes',()=>{
 assert.equal(items.length,45);
 assert.equal(new Set(items.map(x=>x._id)).size,45);
 assert.equal(new Set(items.map(x=>x.name)).size,45);
 assert.equal(new Set(items.map(x=>x.img)).size,45);
 for(const item of items){
  assert.equal(item._id.length,16);
  assert.equal(item.type,'equipamento');
  assert.ok(categories.has(item.system.categoria));
  assert.ok(item.system.descricao.length>=25);
  assert.ok(item.system.quantidade>0);
  assert.ok(existsSync(resolve(root,item.img.replace('systems/terra-devastada/',''))),item.img);
 }
});

test('15 personagens completos com perfil, 12 Características, 3 Condições e inventário',()=>{
 assert.equal(actors.length,15);
 assert.equal(new Set(actors.map(x=>x.name)).size,15);
 assert.equal(new Set(actors.map(x=>x.img)).size,15);
 const itemNames=new Set(items.map(x=>x.name));
 for(const actor of actors){
  assert.equal(actor.type,'protagonista');
  assert.equal(actor._id.length,16);
  assert.equal(actor.system.caracteristicas.length,12);
  assert.equal(new Set(actor.system.caracteristicas).size,12);
  assert.equal(actor.system.condicoes.length,3);
  assert.ok(actor.system.trunfos.length>=1);
  assert.ok(actor.system.dramas.length>=1);
  assert.ok(actor.system.historico.length>=100);
  assert.ok(actor.system.citacao.length>=10);
  assert.equal(actor.system.conviccao,30);
  for(const key of statKeys) assert.ok(Object.hasOwn(actor.system,key),`${actor.name}.${key}`);
  assert.ok(actor.items.length>=3);
  assert.equal(new Set(actor.items.map(x=>x._id)).size,actor.items.length);
  for(const embedded of actor.items)assert.ok(itemNames.has(embedded.name));
  assert.ok(existsSync(resolve(root,actor.img.replace('systems/terra-devastada/',''))),actor.img);
 }
});

test('um macro de script chama gerador registrado e tem ícone',()=>{
 assert.equal(macros.length,1);
 assert.equal(macros[0].type,'script');
 assert.match(macros[0].command,/game\.terraDevastada\.gerarAtor\(\)/);
 assert.ok(existsSync(resolve(root,macros[0].img.replace('systems/terra-devastada/',''))));
});

test('gerador produz documentos independentes e ficha completa com inventário',()=>{
 const source=actors[0];
 const before=JSON.stringify(source);
 const generated=buildActorData(source,'Teste Dinâmico',{tipo:'sobrevivente',extraTraits:['Especialista em escadas','Conhece a mata','Pés velozes'],horror:7});
 assert.equal(generated.name,'Teste Dinâmico');
 assert.equal(generated.type,'sobrevivente');
 assert.equal(generated._id,undefined);
 assert.equal(generated.system.caracteristicas.length,12);
 assert.equal(generated.system.conviccao,30);
 assert.equal(generated.system.horror,7);
 assert.equal(generated.system.reacoes,0);
 assert.equal(generated.items.length,source.items.length);
 assert.ok(generated.items.every(x=>!Object.hasOwn(x,'_id')));
 assert.equal(JSON.stringify(source),before,'não pode alterar arquétipo original');
});
