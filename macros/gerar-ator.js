// Terra Devastada v0.2.0 — Macro: Gerar Ator (Ficha Completa)
// Execute como Mestre em um mundo que use este sistema.
if (!game.terraDevastada?.gerarAtor) {
  ui.notifications.error("Sistema Terra Devastada v0.2.0 não está ativo.");
} else {
  await game.terraDevastada.gerarAtor();
}
