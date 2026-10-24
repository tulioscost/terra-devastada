# Publicar Terra Devastada v0.1.1 no GitHub

Repositório: https://github.com/tulioscost/terra-devastada

## Opção A: pelo site do GitHub

1. Extraia `terra-devastada-repositorio-github-v0.1.1.zip`.
2. No repositório acima, selecione `Add file` → `Upload files` e faça upload do conteúdo extraído. **Não envie o ZIP como único arquivo.**
3. Os arquivos `system.json`, `module`, `styles`, `templates`, `assets`, `lang`, `.github/workflows`, `tests` e `scripts` devem aparecer na raiz.
4. Confirme o commit na branch `main`.
5. Aguarde a ação `Validar Terra Devastada` concluir.
6. Vá em **Releases → Draft a new release → Choose a tag → v0.1.1 → Create new tag on publish** e publique o Release. A ação de tag cria automaticamente a compilação instalável, mas se a ação iniciar após o Release manual, você poderá ter de substituir os anexos; para evitar essa duplicidade, prefira criar a tag via Git.

## Opção B: Git — recomendada

Na pasta extraída do repositório, execute:

```bash
git init
git branch -M main
git remote add origin https://github.com/tulioscost/terra-devastada.git
git add .
git commit -m "feat: Terra Devastada v0.1.1 para Foundry 14"
git push -u origin main
git tag v0.1.1
git push origin v0.1.1
```

**Atenção:** os comandos `git init` e `git push` acima são indicados para repositório remoto **vazio**. Se já houver commits ou arquivos, faça clone do repositório e integre as mudanças em vez de forçar a substituição.

## Workflow de Release

Quando receber a tag `v0.1.1`, `.github/workflows/release.yml` testa o pacote e publica os anexos:

- `terra-devastada-v0.1.1.zip`: ZIP para Foundry
- `system.json`: manifesto

Conceda a GitHub Actions permissão de gravar em `Settings → Actions → General → Workflow permissions → Read and write permissions`. O token criado automaticamente pelo workflow precisa ter `contents: write`.

**Manifesto para instalar no Foundry, SOMENTE após a publicação da v0.1.1:**

```text
https://raw.githubusercontent.com/tulioscost/terra-devastada/main/system.json
```

Link futuro do Release: `https://github.com/tulioscost/terra-devastada/releases/tag/v0.1.1`.

Se a permissão de gravar no GitHub não estiver disponível, utilize diretamente o ZIP de instalação manual.
