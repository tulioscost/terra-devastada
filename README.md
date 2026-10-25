# Terra Devastada — Sistema Acepção para Foundry VTT 14

Adaptação técnica independente, não oficial e não comercial do RPG *Terra Devastada*. É necessário possuir o livro para consultar as regras completas. Não inclui o texto integral do livro.

## Requisitos

- Foundry VTT 14;
- [Dice So Nice](https://foundryvtt.com/packages/dice-so-nice/) (**obrigatório**);
- [Dice Calculator / Dice Tray](https://foundryvtt.com/packages/dice-calculator) (**obrigatório**).

## Fichas selecionáveis

1. **Ficha Terra Devastada**, a ficha clássica, continua como padrão.
2. **Declaração de Óbito (alternativa)**, a primeira versão de papel forense.
3. **Certidão de Óbito — Arquivo Forense (responsiva)**, nova na v0.5.0.

Para escolher, abra um Ator e use o controle nativo **Configurar ficha / Configure Sheet**. Escolha uma das três no campo **Esta ficha / This Sheet** e salve. O mesmo ator pode mudar de apresentação sem alterar seus traços, equipamentos ou recursos.

### Nova ficha responsiva

- Documento corrido inspirado em certidões antigas, carimbos, arquivo de óbitos, foto e registro.
- Navegação por âncoras (Identificação, Registro Clínico, Pertences e Anotações).
- Formulário editável com dados de prontuário, identificação e contexto narrativo.
- Características, Condições, Trunfos, Dramas, Horror e Convicção originais de Acepção.
- Infecção e estágio de zumbificação como campos de acompanhamento, sem transformação automática.
- Botões existentes de ação, reação, iniciativa, horror e nova cena; retrato e inventário editáveis.
- Layout por **container queries**, que responde à largura da janela Foundry em vez da resolução do monitor.

> **Atenção:** o modelo Acepção não utiliza atributos fixos Força/Agilidade nem pontos de vida. Esses valores do mockup conceitual não foram introduzidos na ficha funcional. Os novos campos forenses são **cosméticos/narrativos**, sem alteração das regras do jogo.

## Conteúdo mantido

- 45 itens com ícones;
- 15 personagens prontos com ficha completa;
- 30 ameaças (zumbis, antagonistas humanos e animais);
- macro geradora de personagem;
- dado temático d6 (2/4/6: sucesso; 1/3/5: falha) configurado pelo Dice So Nice.

## Instalação manual

1. Faça um backup do mundo.
2. Instale e habilite os dois módulos obrigatórios.
3. Extraia o `terra-devastada-v0.5.0.zip` em `FoundryVTT/Data/systems/`, preservando o diretório `terra-devastada/`.
4. Reinicie o Foundry e abra o mundo.
5. Escolha **Certidão de Óbito — Arquivo Forense (responsiva)** em **Configurar ficha**.

### Instalação por manifesto (somente após publicar o Release)

`https://raw.githubusercontent.com/tulioscost/terra-devastada/main/system.json`

O Release `v0.5.0` precisa conter **exatamente** o asset `terra-devastada-v0.5.0.zip` para o link de download do manifesto funcionar.

## Validação

Os testes automatizados cobrem os mecanismos de Acepção, conteúdos, dependências, estrutura de arquivos, manifesto e fichas. Os testes de layout também inspecionam três larguras em navegador Chromium. **Não substituem a validação manual em uma instância real do Foundry VTT 14**.
