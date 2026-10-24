import test from 'node:test';
import assert from 'node:assert/strict';
import {successes,poolSize,resolution,directResolution,horrorMagnitude,initialConviction,convictionBonus,horrorEffect,escapeHTML} from '../module/rules.mjs';

test('dados pares são sucessos',()=>assert.equal(successes([1,2,3,4,5,6]),3));
test('reserva não fica negativa',()=>assert.equal(poolSize([1,-4]),0));
test('resultado parcial e oposição',()=>{assert.equal(resolution(1,2),'parcial');assert.equal(resolution(3,2),'sucesso');assert.equal(directResolution(2,2),'parcial');});
test('magnitude e criação',()=>{assert.equal(horrorMagnitude(3,2,1),6);assert.equal(initialConviction(12,1),30);});
test('limite de convicção da cena',()=>{assert.equal(convictionBonus(4,2),1);assert.equal(convictionBonus(4,3),0);});
test('efeitos de horror',()=>{assert.equal(horrorEffect(0).horror,0);assert.equal(horrorEffect(9).horror,3);});
test('escape impede marcação HTML externa',()=>assert.equal(escapeHTML('<b>'), '&lt;b&gt;'));
