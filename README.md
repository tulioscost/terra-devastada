# Terra Devastada — Acepção | Foundry VTT 14

**Versão 0.1.1 — pacote instalável e publicável no GitHub (não oficial, não comercial).**

Sistema independente para criar mundos Foundry com as mecânicas narrativas Acepção descritas na obra *Terra Devastada* (2011), de John Bogéa. **Não inclui o texto integral do livro, imagens originais, aventuras, nem todos os elementos de cenário.** É necessário ter acesso ao livro e arbitrar situações com o Mestre.

## Instalação manual

1. Descompacte `terra-devastada-v0.1.1.zip` na pasta **Data/systems/** do Foundry, preservando o diretório **terra-devastada/**.
2. Confirme que o arquivo final é `Data/systems/terra-devastada/system.json`.
3. Reinicie o Foundry VTT **v14**, crie um novo mundo e escolha **Terra Devastada — Acepção**.
4. Na aba Personagens, crie um **Protagonista**, **Sobrevivente/NPC** ou **Zumbi/Ameaça**.

> **Instalação por URL (após publicação):** cole no Foundry o endereço estável `https://raw.githubusercontent.com/tulioscost/terra-devastada/main/system.json`. O manifesto aponta para o asset `terra-devastada-v0.1.1.zip` da tag `v0.1.1`. **Até a publicação efetiva dessa tag e de seu Release no GitHub, essa modalidade não funcionará.** Para testar imediatamente, use a instalação manual.

## Ficha

- Layout temático autoral, responsivo, com retrato alterável, Nome, Jogador, Conceito, Citação, Características, Condições com duração, Trunfos, Dramas, Horror e Convicção.
- Abas Perfil, Inventário, Histórico, Painel.
- Inventário com Item de Equipamento (armas, proteção, suprimentos, munição, etc.); número e descrição editáveis. Não há dano numérico ou pontos de vida: ferimentos seguem Condições, com arbitragem do Mestre.
- Tipos de Ator usam a mesma base narrativa (não foram importados textos nem estatísticas dos NPCs do livro).

## Rolagens

- Escolher por ação o uso favorável **+1d**, desfavorável **−1d** ou neutro para **cada traço**. Modificador situacional manual.
- Em cada d6, resultados **2, 4 ou 6** concedem 1 sucesso. Cada 6 explode e gera outro d6; novos 6 continuam explodindo.
- Sem reserva positiva, **Golpe de Sorte**: 1d6 e acertar exatamente a face par (2/4/6) previamente escolhida; sem explosão.
- Ação indireta simples exige 1 sucesso, comum 2 e difícil 3; uma falta de 1 sucesso em tarefas comuns/difíceis permite resultado parcial. Ações diretas exigem comparação com os sucessos do defensor, a critério do Mestre.
- Iniciativa narrativa, com bônus +1d se a primeira ação for não física; em conflitos, desempate exige nova rolagem. Utilize o botão **INICIATIVA** da ficha.
- Reações após a primeira na cena acumulam desvantagens (−1d por reação anterior). O controle é resetado no botão **NOVA CENA**.
- Teste de Horror por três magnitudes (Envolvimento, Gravidade e Ligação Afetiva). Se superar o Horror atual, requer um sucesso sem Golpe de Sorte. Falhar gera Condição, Drama, modificação em Horror e Convicção conforme a diferença. Distúrbios psicológicos exigem definição narrativa do Mestre.
- Convicção: o botão AÇÃO permite gastar Horror atual em pontos de Convicção, com sucessos automáticos proporcionais aos Trunfos e máximo de 3 por cena. Reset em NOVA CENA.
- Novo Trunfo: +6 Convicção e −1 Horror. Novo Drama: −3 Convicção. Botão opcional para recomputar a Convicção inicial (2 pontos por Característica inicial e 6 pelo primeiro Trunfo).
- Febre Z: lembrete automático aos 14 pontos de Horror; as escolhas e testes narrativos continuam sob supervisão do Mestre.

## Limitações conhecidas / tarefas futuras

- **Não testado em uma instância executada do Foundry** neste ambiente. O pacote usa as APIs v14 publicadas e foi verificado por testes estáticos. É necessária validação real após a instalação.
- Integração nativa da iniciativa no rastreador e combate automatizado por alvos ainda estão em desenvolvimento. O **botão de Iniciativa da ficha** é a via recomendada; o rastreador não determina sozinho o pool narrativo.
- A adjudicação do **Impedimento Moral** (diferença ≥3) é alertada ao Mestre, não força comportamento automático.
- A escolha do traço relevante, o progresso de ações prolongadas, o efeito de equipamentos, a gravidade de lesões, Febre Z e distúrbios psicológicos dependem do Mestre.
- Sem compêndios oficiais de cenário ou transcrição/reprodução do livro.
- Não inclui imagens ou material editorial dos autores do livro; o logo e o visual deste pacote foram criados para este projeto.

## Referência e direitos

**Terra Devastada** (1ª ed., 2011), idealização e sistema por John Bogéa; cenário de John Bogéa e Fabrício Caxias. O livro atribui ao sistema narrativo Acepção a licença **CC BY-NC-SA 3.0 Unported**; o restante da obra possui restrições editoriais próprias. Esta adaptação de código e suas regras em implementação destinam-se a uso não comercial e devem preservar os créditos e licenciamento aplicáveis. Não implica autorização ou endosso dos titulares.

Leia as páginas 42–50 para a ficha e 61–73 para a mecânica; a ficha original está nas páginas finais do PDF (páginas impressas 127–128).

## Estrutura do pacote

- `system.json`: manifesto do sistema;
- `module/models.mjs`: modelos de dados;
- `module/sheets.mjs`: fichas personalizadas e controles;
- `module/rolls.mjs`: diálogos e resolução;
- `module/rules.mjs`: regras puras e auditáveis;
- `templates/actor.hbs` e `templates/item.hbs`: interface;
- `styles/terra-devastada.css`: visual;
- `assets/terra-logo.svg`: identidade gráfica original.

## Preparação do GitHub e releases

A raiz do repositório **deve conter diretamente** `system.json`, `module/`, `templates/`, `styles/`, `assets/` e `lang/`, além de `.github/workflows/`. Não coloque esses arquivos em uma subpasta adicional ao subir pelo navegador.

1. Faça upload dos arquivos do **ZIP do repositório** para `tulioscost/terra-devastada` na branch `main`, ou use Git para enviá-los.
2. Aguarde o status verde da ação **Validar Terra Devastada** (Node.js, verificação do manifesto e de sintaxe).
3. No GitHub, crie a tag **`v0.1.1`** apontando ao commit enviado (ou execute `git tag v0.1.1` e `git push origin v0.1.1`).
4. A ação **Publicar Release do Foundry** gera automaticamente `terra-devastada-v0.1.1.zip` e anexa o `system.json` ao Release. Ela exige que GitHub Actions esteja habilitado e tenha permissão de escrita em **Settings → Actions → General → Workflow permissions**.
5. Depois do Release publicado, cole o URL de `manifest` na tela de instalação do Foundry. Para novas versões, atualize **versão e endereço de download** do manifesto, publique na `main` e crie uma nova tag correspondente.

**Atenção:** um ZIP de repositório GitHub não é instalável diretamente no Foundry; utilize o ZIP de instalação. Um ZIP de PATCH preserva caminhos internos e deve ser aplicado sobre uma instalação existente, não em um diretório vazio.

**Licenciamento:** adaptação não oficial, não comercial; não é redistribuição autorizada de texto editorial do livro.
