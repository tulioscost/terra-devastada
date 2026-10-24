# Terra Devastada — v0.2.0

**Foundry VTT 14 · Acepção · Expansão de Compêndios e Gerador**

## Conteúdo novo

- **45 equipamentos originais** em sete categorias (12 armas, 6 proteções, 7 medicamentos, 4 munições, 6 alimentos, 7 ferramentas e 3 recursos diversos), todos com imagem SVG individual, quantidade, descrição e estado de conservação.
- **15 sobreviventes originais prontos**, com ícones individuais, 12 Características, 3 Condições, Trunfo, Drama, Citação, Conceito, histórico, Horror, Convicção e 3–4 objetos iniciais cada.
- **Macro “Gerar Ator — Ficha Completa”**: escolha um arquétipo ou sorteie; personalize o nome, crie protagonista ou NPC; opcionalmente varie Características e Horror. Abre ficha automaticamente.
- **Instalador do Mestre** na primeira entrada no mundo, criando três compêndios de mundo (itens, personagens e macro). Operação idempotente: reexecutar não duplica documentos e não sobrescreve registros alterados.
- Na aba Inventário há um botão **COMPÊNDIO** que abre a coleção dos 45 itens.
- Todos os arquivos são incluídos no ZIP do Foundry, prontos para hospedagem GitHub.

## Instalação inicial do conteúdo

Ao abrir o mundo como Mestre, confirme a janela “Instalar Compêndios”. Alternativamente, execute no console do Mestre:

```js
await game.terraDevastada.instalarCompendios();
```

Depois, abra **Compêndios → Terra Devastada | Macros → Gerar Ator — Ficha Completa**, importe a macro e execute-a na barra de macros ou no diretório.

## Compatibilidade e limitações

- Requer Foundry VTT 14 e o sistema Terra Devastada v0.2.0.
- Os três compêndios são **criados no mundo pelo instalador do Mestre**, não distribuídos como bancos LevelDB precompilados. Essa opção atende hospedagens que não permitem alterar bancos de dados do sistema.
- O conteúdo é original e não reproduz os personagens, imagens ou textos protegidos do livro. Ícones usam silhuetas do Font Awesome Free (CC BY 4.0; créditos no LICENSE-NOTICE.txt).
- Testes automatizados confirmam estrutura, contagens, modelos, referências de ícones, geração de dados e integridade do pacote. A execução integral em uma instalação real do Foundry ainda precisa de validação.
