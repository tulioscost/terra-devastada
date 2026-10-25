# Publicação da versão v0.5.0

Repositório: https://github.com/tulioscost/terra-devastada

## Opção A — publicação manual pelo navegador

1. Extraia **terra-devastada-REPOSITORIO-GITHUB-v0.5.0.zip**.
2. Envie seu conteúdo **para a raiz** da branch `main`, inclusive a pasta oculta `.github/workflows/` (não envie o próprio ZIP para dentro do repositório).
3. Confira `system.json` da branch `main`: `version: 0.5.0` e `download` terminado em `/v0.5.0/terra-devastada-v0.5.0.zip`.
4. Em https://github.com/tulioscost/terra-devastada/releases/new, selecione a tag `v0.5.0`, crie a publicação com as notas do arquivo `RELEASE_NOTES.md` e **anexe o ZIP instalável** `terra-devastada-v0.5.0.zip`.
5. Confirme, sem usar links presumidos, que o asset está listado no Release publicado.

## Opção B — workflow automatizado

O repositório inclui `.github/workflows/release.yml`. Ao publicar a tag `v0.5.0` depois de enviar todo o código, o workflow executa os testes, monta o ZIP e publica os assets do Release automaticamente (desde que GitHub Actions tenha permissões de gravação adequadas).

**Não utilize os dois métodos ao mesmo tempo sem conferir se o Release já existe**, para evitar sobreposição de arquivos.

## Manifesto

`https://raw.githubusercontent.com/tulioscost/terra-devastada/main/system.json`

O Foundry só conseguirá instalar automaticamente quando tanto o manifesto quanto o ZIP da Release existirem na URL esperada.

## Para atualizar manualmente

Feche o Foundry, faça backup do mundo, extraia o ZIP de instalação ou `terra-devastada-PATCH-v0.4.0-para-v0.5.0.zip` sobre `Data/systems/` e reinicie. Não é necessário apagar os atores existentes.
