import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(readFileSync(resolve(root,'system.json'),'utf8'));
test('manifesto Foundry válido e endereços consistentes',()=>{
  assert.equal(manifest.id,'terra-devastada');
  assert.equal(manifest.version,'0.1.1');
  assert.equal(manifest.compatibility.minimum,'14');
  assert.ok(manifest.download.endsWith(`/v${manifest.version}/terra-devastada-v${manifest.version}.zip`));
  assert.ok(manifest.manifest.endsWith('/main/system.json'));
});
test('referências do manifesto existem localmente',()=>{
  for (const file of [...manifest.esmodules,...manifest.styles,...manifest.languages.map(x=>x.path),'LICENSE-NOTICE.txt']) assert.ok(existsSync(resolve(root,file)),file);
  for(const file of ['module/rules.mjs','module/rolls.mjs','templates/actor.hbs','templates/item.hbs']) assert.ok(existsSync(resolve(root,file)),file);
});
