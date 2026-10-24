/** Funções puras para auditoria e testes sem dependência do Foundry. */
export function successes(faces) {
  return faces.filter(n => Number.isInteger(n) && n >= 1 && n <= 6 && n % 2 === 0).length;
}
export function poolSize(modifiers = []) {
  return Math.max(0, modifiers.reduce((total, n) => total + Number(n || 0), 0));
}
export function resolution(count, difficulty = 1) {
  const n = Number(count);
  const goal = Number(difficulty);
  if (n >= goal) return "sucesso";
  if (n > 0 && goal > 1 && n === goal - 1) return "parcial";
  return "falha";
}
export function directResolution(actorSuccesses, defenderSuccesses) {
  const delta = actorSuccesses - defenderSuccesses;
  return delta > 0 ? "sucesso" : delta === 0 ? "parcial" : "falha";
}
export function horrorMagnitude(envolvimento, gravidade, ligacao) {
  return Math.max(0, Number(envolvimento) + Number(gravidade) + Number(ligacao));
}
export function horrorEffect(diff) {
  if (diff <= 0) return {horror:0, condition:"", severity:"nenhuma"};
  if (diff <= 2) return {horror:1, condition:"Horrorizado", severity:"curta"};
  if (diff <= 4) return {horror:1, condition:"Catatônico", severity:"indeterminada"};
  if (diff <= 6) return {horror:1, condition:"Catatônico", severity:"indeterminada", disorder:"leve"};
  if (diff <= 8) return {horror:2, condition:"Catatônico", severity:"indeterminada", disorder:"grave"};
  return {horror:3, condition:"Desejo súbito de suicídio", severity:"indeterminada", disorder:"grave"};
}
export function initialConviction(characteristicCount, triumphCount) {
  return Math.max(0, Math.floor(characteristicCount)) * 2 + (triumphCount > 0 ? 6 : 0);
}
export function convictionBonus(triumphCount, usedThisScene=0) {
  return Math.max(0, Math.min(3-usedThisScene, triumphCount));
}
export function escapeHTML(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
