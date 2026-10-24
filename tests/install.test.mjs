import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {instalarCompendios} from '../module/content-installer.mjs';
const root=resolve(import.meta.dirname,'..');

test('instala três compêndios e uma segunda execução não duplica registros',async()=>{
  const packs=new Map();const writes=new Map();
  globalThis.game={user:{isGM:true},packs:{get:key=>packs.get(key)},settings:{set:async(k,v,data)=>writes.set(`${k}.${v}`,data)}};
  globalThis.ui={notifications:{info:()=>{},warn:()=>{},error:x=>{throw new Error(x);}}};
  globalThis.foundry={documents:{collections:{CompendiumCollection:{
    async createCompendium(spec){
      const pack={collection:`world.${spec.name}`,documentName:spec.type,locked:false,
        records:[],getIndex:async function(){return this.records.map(d=>({_id:d._id}));},
        configure:async function({locked}){this.locked=locked;}
      };packs.set(pack.collection,pack);return pack;
    }
  }}}};
  const klass={createDocuments:async(data,{pack})=>{packs.get(pack).records.push(...data);return data;}};
  globalThis.Actor=klass;globalThis.Item=klass;globalThis.Macro=klass;
  globalThis.fetch=async(url)=>({ok:true,json:async()=>JSON.parse(readFileSync(resolve(root,url.replace('systems/terra-devastada/','')),'utf8'))});
  const first=await instalarCompendios();
  assert.deepEqual(first.map(x=>x.total),[45,15,1]);
  assert.deepEqual(first.map(x=>x.added),[45,15,1]);
  assert.equal(packs.get('world.td-itens-45').records.length,45);
  assert.equal(packs.get('world.td-personagens-15').records.length,15);
  assert.equal(packs.get('world.td-macros').records.length,1);
  const second=await instalarCompendios();
  assert.deepEqual(second.map(x=>x.added),[0,0,0]);
  assert.equal(writes.get('terra-devastada.contentInstalled'),true);
});
