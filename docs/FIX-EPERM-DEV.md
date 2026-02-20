# Como fazer o EPERM parar (definitivo)

Erro: `EPERM: operation not permitted, unlink '.react-router\types\+routes.ts'` (ou `+future.ts`)

No Windows, a pasta **`.react-router`** fica bloqueada por algum processo (Cursor, Node antigo, antivírus). O jeito mais confiável de liberar é **reiniciar a máquina** e seguir o passo a passo abaixo **sem abrir o Cursor antes** de rodar o dev.

---

## Procedimento que faz parar (use na ordem)

### Passo 1 – Reiniciar o PC

- Salve o que estiver fazendo e **reinicie o Windows**.
- Isso fecha todos os processos e libera os arquivos da pasta `.react-router`.

### Passo 2 – Depois do reinício: não abrir o Cursor ainda

- **Não abra o Cursor/VS Code** nesse momento.
- Abra o **PowerShell** (ou Terminal do Windows) e vá na pasta do projeto:

```powershell
cd C:\BEANS\rp_b1_front_react
```

### Passo 3 – Apagar a pasta gerada e subir o dev

Rode **um** dos dois:

**Opção A – Script (recomendado)**

```powershell
npm run dev:clean
```

**Opção B – Manual**

```powershell
Remove-Item -Recurse -Force .react-router -ErrorAction SilentlyContinue
npm run dev
```

O React Router vai recriar a pasta `.react-router` ao iniciar. Deixe o servidor subir (até aparecer a URL no terminal).

### Passo 4 – Só depois abrir o Cursor

- Depois que o `npm run dev` estiver rodando, **aí sim** abra o Cursor no projeto.
- Evite abrir arquivos dentro de `.react-router` (são gerados automaticamente).

---

## Para o Cursor não travar de novo a pasta

Para o editor parar de “segurar” os arquivos gerados:

1. Abra **Configurações** do Cursor (Ctrl+,).
2. Procure por **files.exclude**.
3. Clique em **“Edit in settings.json”**.
4. Inclua a linha (ou adicione `".react-router": true` no objeto existente):

```json
"files.exclude": {
  "**/.react-router": true
}
```

5. Salve. Assim o Cursor deixa de listar e vigiar a pasta `.react-router` e tende a não bloquear mais os arquivos.

---

## Script `dev:clean` no projeto

Foi adicionado no **package.json** o script **`dev:clean`**, que:

1. Apaga a pasta `.react-router`
2. Sobe o dev com `react-router dev`

Use depois do reinício: `npm run dev:clean` (com o Cursor fechado).

---

## Resumo rápido

| Ordem | O que fazer |
|-------|-------------|
| 1 | Reiniciar o PC |
| 2 | **Não** abrir o Cursor |
| 3 | Abrir PowerShell → `cd C:\BEANS\rp_b1_front_react` |
| 4 | Rodar `npm run dev:clean` (ou apagar `.react-router` e `npm run dev`) |
| 5 | Quando o dev estiver rodando, abrir o Cursor |
| 6 | (Opcional) Colocar `"**/.react-router": true` em `files.exclude` no Cursor |

Depois disso, o EPERM deve parar. Se um dia voltar, repita a partir do Passo 1 (reiniciar e rodar o dev sem ter o Cursor aberto antes).
