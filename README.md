# Terra Devastada — Acepção | Foundry VTT 14

**v0.2.0 · Sistema não oficial para uso não comercial · Repositório: https://github.com/tulioscost/terra-devastada**

Sistema para mesas narrativas de sobrevivência e horror, preservando as estruturas de *Terra Devastada*: Características, Condições, Trunfos, Dramas, Horror, Convicção e rolagens d6 com faces pares como sucessos, Surto de Sorte e Golpe de Sorte.

## Instalação

1. Descompacte `terra-devastada-v0.2.0.zip` na pasta `Data/systems/`, deixando `Data/systems/terra-devastada/system.json`.
2. Reinicie o **Foundry VTT 14** e abra um mundo com o sistema Terra Devastada.
3. Entre como **Mestre**. Na primeira entrada aparece o convite **Instalar Compêndios**: confirme para criar as coleções.
4. No diretório Compêndios, estarão **Terra Devastada | 45 Itens**, **Terra Devastada | 15 Personagens** e **Terra Devastada | Macros**.
5. Importe a macro **Gerar Ator — Ficha Completa** para a barra de macros e execute-a; escolha o arquétipo (ou sorteio), nome, tipo e variação.

**Instalação manual dos compêndios:** caso feche o convite, como Mestre use o console (F12) e execute:

```js
await game.terraDevastada.instalarCompendios();
```

Para gerar um ator diretamente do console: `await game.terraDevastada.gerarAtor();`.

### Sobre a criação dos compêndios

Os conteúdos estão pré-embarcados como `data/items.json`, `data/actors.json` e `data/macros.json` e o **instalador os converte em três compêndios reais do mundo** no primeiro acesso, via API Foundry. Não são arquivos LevelDB já compilados; o Mestre precisa confirmar a instalação na primeira execução. Repetir o comando acrescenta somente documentos ausentes, sem duplicar ou substituir personagens ou itens existentes. O conteúdo criado permanece armazenado no mundo.

## Conteúdo

- **45 itens ilustrados**: 12 armas, 6 proteções, 7 medicamentos, 4 munições, 6 alimentos, 7 ferramentas, 3 outros. Cada registro tem imagem SVG exclusiva, descrição narrativa, quantidade, condição física e categoria.
- **15 personagens prontos**: cada um possui retrato SVG exclusivo, conceito, Citação, doze Características, três Condições, um Trunfo, um Drama, histórico original, objetivo, Horror, 30 de Convicção e inventário inicial.
- **Gerador completo**: sorteia ou escolhe entre 15 arquétipos originais; gera nome quando não informado, 12 Características, 3 Condições, Trunfo, Drama, histórico, retrato, inventário e valores de Horror/Convicção. A criação não modifica os modelos originais.

## Ficha e jogabilidade

Ficha responsiva com retrato personalizável, Perfil, Inventário, Histórico e Painel de recursos. No Inventário, o botão **COMPÊNDIO** abre os itens disponíveis. Ações, reações, iniciativa e teste de Horror possuem diálogos próprios. Ferimentos não são pontos de vida; são Condições que o Mestre interpreta conforme a narrativa. A atribuição de dados por Característica deve ser justificada durante a cena.

## Integração GitHub

Faça upload do conteúdo do ZIP de repositório **na raiz** de `tulioscost/terra-devastada` (não dentro de subpasta). Confirme que a CI `npm test` passou; então crie e publique a tag **`v0.2.0`**. O workflow `release.yml` gera e anexa automaticamente o ZIP instalável à Release. Para instalação por URL, após publicar a Release:

`https://raw.githubusercontent.com/tulioscost/terra-devastada/main/system.json`

## Créditos, origem e limitações

Adaptação técnica não oficial e não comercial. Acepção: John Bogéa. *Terra Devastada* (2011), cenário: John Bogéa e Fabrício Caxias. O livro menciona CC BY-NC-SA 3.0 Unported para o sistema narrativo; demais elementos editoriais têm direitos distintos. Os 15 personagens, nomes, históricos, descrições de itens e composições visuais incluídos aqui são material original, não cópias do livro. Silhuetas dos ícones: Font Awesome Free, CC BY 4.0 (Fonticons, Inc.); veja `LICENSE-NOTICE.txt`.

**Validação:** testes automáticos cobrem dados, mecanismos e pacote. Ainda não houve ensaio integral em ambiente Foundry executado; caso a versão instalada use implementação divergente de diálogos/compêndios, ajuste será necessário.

## Macro separada

O arquivo `macros/gerar-ator.js` pode ser copiado manualmente para uma Macro de Script no Foundry. Sua função também está pré-configurada no compêndio **Terra Devastada | Macros**.
