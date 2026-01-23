# Guia: Criar Repositório e Subir Projeto via Linha de Comando

## Passo 1: Inicializar o repositório Git local

```powershell
cd c:\BEANS\rp_b1_front_react
git init
```

## Passo 2: Adicionar todos os arquivos ao staging

```powershell
git add .
```

## Passo 3: Fazer o primeiro commit

```powershell
git commit -m "Initial commit"
```

## Passo 4: Criar o repositório no GitHub/GitLab

### Opção A: Via GitHub CLI (se você tiver instalado)

```powershell
# Criar repositório no GitHub
gh repo create rp_b1_front_react --public --source=. --remote=origin --push
```

### Opção B: Via linha de comando (criar manualmente no site e depois conectar)

1. Acesse https://github.com/new (ou seu GitLab/GitHub)
2. Crie um novo repositório chamado `rp_b1_front_react`
3. **NÃO** inicialize com README, .gitignore ou licença (já temos isso)
4. Depois execute:

```powershell
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/rp_b1_front_react.git

# Ou se usar SSH:
# git remote add origin git@github.com:SEU_USUARIO/rp_b1_front_react.git
```

## Passo 5: Fazer o push para o repositório remoto

```powershell
# Primeiro push (definir upstream)
git branch -M main
git push -u origin main
```

## Comandos úteis para verificar

```powershell
# Ver status do repositório
git status

# Ver remotos configurados
git remote -v

# Ver histórico de commits
git log --oneline
```

## Nota sobre autenticação

Se for a primeira vez usando Git no seu computador, você pode precisar configurar:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

Para autenticação no GitHub, você pode usar:
- **Personal Access Token** (recomendado)
- **SSH Keys**
- **GitHub CLI** (`gh auth login`)
