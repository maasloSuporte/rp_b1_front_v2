# Fluxo: Zip → Pacote → Projeto → Execução na máquina (Agent)

Este documento explica como a aplicação espera receber o **zip** e como dar **play** na execução em uma máquina usando o **agent**.

---

## Como rodar (front + back são processos separados)

Não existe um único build que sobe tudo. São **dois (ou três) processos**:

1. **Backend (API)** – em um terminal:
   ```bash
   cd rp_b1_back
   dotnet run --project Api
   ```
   → API em **http://localhost:5143** (Swagger: http://localhost:5143/swagger)

2. **Frontend (este projeto)** – em outro terminal:
   ```bash
   cd rp_b1_front_react
   npm run dev
   ```
   → Interface em **http://localhost:8080** (ou a porta definida em `VITE_PORT` no `.env`)

3. **Agent** (opcional) – em outro terminal, para executar jobs nas máquinas:
   ```bash
   cd rp_b1_agent
   dotnet run --project Front/Front.csproj
   ```

O front envia as requisições para a API (por proxy ou direto, conforme `VITE_API_URL` no `.env`). O backend precisa estar rodando antes de usar o front.

---

## Visão geral

1. **Zip** é enviado como **Package Version** (pacote + versão).
2. Um **Projeto** de automação usa uma **versão** desse pacote (`packageVersionId`).
3. A execução acontece em **máquinas** que têm o **Agent** instalado e registrado no backend.
4. **Dar play** = criar um **Job** (projeto + máquina + prioridade) e chamar **Execute**; o backend envia o job para o agent da máquina, que baixa o pacote (zip) e executa.

---

## Passo a passo para subir o zip e executar

### 1. Fazer upload do zip (Pacote)

- Menu **Pacotes** → botão **Upload** → **Novo** (ou **Upgrade** se já existir o pacote).
- **Novo pacote**: informe Nome, Descrição, Tecnologia, Versão (ex: `1.0.0`) e anexe o arquivo **.zip** (ou .rar, .7z).
- O front envia para a API: `POST /api/packageVersions` com `FormData`: `File`, `PackageId`, `Version`, `Description`.
- O backend armazena o zip; depois você pode baixá-lo em Pacotes → Download (por versão).

### 2. Criar um Projeto vinculado ao pacote

- Menu **Automação** → **Criar Projeto**.
- Preencha Nome, Descrição, Status, Ativo, etc.
- Em **Pacote**: escolha o pacote que contém o zip que você subiu.
- Em **Versão do pacote**: escolha a versão (ex: `1.0.0`) correspondente ao upload.
- Salve. O projeto fica ligado a essa **packageVersionId** (o zip que o agent vai usar).

### 3. Máquinas e Agent

- As **máquinas** onde o processo vai rodar precisam ter o **Agent** instalado.
- O Agent é um software que:
  - se registra no backend (API),
  - aparece na lista **Dispositivos/Máquinas** no front (com `agentVersion`, etc.),
  - recebe jobs do backend, baixa o pacote (zip) da versão indicada e executa na máquina.
- Este repositório é só o **front-end**; o **Agent** é outro componente (outro repositório ou instalador). Sem o agent instalado e registrado, a máquina não aparece e não executa.

### 4. Dar play na aplicação

**Opção A – Pela tela Execução (Automação → Executar)**

- **Automação** → botão **Executar**.
- Selecione **Projeto**, **Máquina** (onde o agent está rodando), **Prioridade** e nome do job.
- Clique em **Executar**: o front cria um Job (`POST /api/jobs`) e em seguida chama `POST /api/jobs/{id}/execute`.
- O backend envia o job para o agent da máquina; o agent baixa o zip do projeto (package version) e executa.

**Opção B – Pela fila de Jobs**

- **Gerenciar** → **Fila de espera (Jobs)** → **Criar Job**.
- Preencha Nome, Projeto, Prioridade, Máquina e crie.
- Na lista, use a ação **Executar** no job: `POST /api/jobs/{id}/execute`.
- Mesmo efeito: o backend manda o job para o agent da máquina escolhida.

---

## O que a API espera (payload e formato)

### 1. Criar pacote (antes de subir o zip)

- **Método:** `POST /api/packages/create`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "name": "Nome do pacote",
    "description": "Descrição",
    "technologyId": 1
  }
  ```
- **Resposta:** objeto com `id` do pacote criado (use esse `id` como `PackageId` no passo seguinte).

**Teste de rota (backend):** `GET /api/packages/ping` retorna `200` se o controller estiver registrado. Útil para debugar 404.

### 2. Upload do zip (versão do pacote)

- **Método:** `POST /api/packageVersions`
- **Headers:** `Authorization: Bearer <token>`. Não enviar `Content-Type` (o cliente define `multipart/form-data` com boundary).
- **Body:** `multipart/form-data` com os campos:
  - `File` – arquivo .zip (obrigatório)
  - `Description` – string (obrigatório)
  - `PackageId` – número, id do pacote criado no passo 1 (obrigatório)
  - `Version` – string, ex.: `1.0.0` (opcional; se vazio, o backend gera a versão)
- **Resposta:** objeto com `id` da versão criada (packageVersionId usado no projeto).

**Upload de zip grande:** o que importa é o **backend** (não o proxy). No `rp_b1_back`: Kestrel `MaxRequestBodySize = null`, `FormOptions.MultipartBodyLengthLimit = long.MaxValue` e `[RequestFormLimits]` no controller de packageVersions. Se 404 ou ERR_CONNECTION_ABORTED com arquivo grande, a causa é limite de tamanho no backend — reinicie o backend após alterar esses valores.

---

## Onde o zip fica armazenado e como é usado na execução

### Armazenamento (backend)

- O backend usa **LocalBlobStorageService** em desenvolvimento (configurável em produção para Azure Blob).
- **Caminho local (dev):** `{ContentRoot do projeto Api}/LocalStorage/{ContainerName}/{CompanyId}/{NomeDoPacote}/{Versao}.zip`
  - Exemplo: `.../Api/LocalStorage/pacotes/a1b2c3d4-.../MeuPacote/1.0.0.zip`
- **ContainerName** vem de `appsettings` → `AzureStorageSettings:ContainerName` (ex.: `"pacotes"`).
- O arquivo é **criptografado** antes de salvar; chave/IV vêm do Key Vault (por empresa). O agent descriptografa ao baixar.

### Uso na execução (agent)

1. **Job** é criado com um **projeto** que tem `packageVersionId` (a versão do pacote = o zip).
2. Ao **executar** o job (`POST /api/jobs/{id}/execute`), o backend envia o job para o **agent** da máquina vinculada.
3. O **agent** chama o backend para **baixar** o zip daquela versão (ex.: endpoint usado pelo agent para download).
4. O backend localiza o arquivo pelo nome `{CompanyId}/{PackageName}/{Version}.zip` no blob/local storage, **descriptografa** e envia o stream para o agent.
5. O **agent** grava o zip na máquina e **executa** (descompacta e roda o processo definido no pacote).

Resumo: zip fica em **LocalStorage** (ou Azure) no servidor da API; na execução o **agent** baixa esse zip pela API, descriptografa e roda na máquina.

---

## Resumo da API usada pelo front

| Ação | Método | Endpoint |
|------|--------|----------|
| Criar pacote | POST | `/api/packages/create` (body JSON: `name`, `description`, `technologyId`) |
| Upload zip (nova versão) | POST | `/api/packageVersions` (body FormData: `File`, `Description`, `PackageId`, `Version`) |
| Download zip | GET | `/api/packageVersions/download/{id}` |
| Criar projeto | POST | `/api/projects` (body: `projectName`, `description`, `status`, `packageVersionId`, `active`, `autoUpdate`) |
| Listar máquinas | GET | `/api/machines/all` ou `/api/machines?PageNumber=...&PageSize=...` |
| Criar job | POST | `/api/jobs` (body: `name`, `projectId`, `priorityId`, `machineId`) |
| Executar job | POST | `/api/jobs/{id}/execute` |

---

## Configuração do backend (API) e do Agent

- **API (backend)**: a URL usada pelo front é a `apiUrl` em `app/infrastructure/environment.ts` (desenvolvimento: `/api`, normalmente em proxy para o backend).
- **Agent**: deve estar configurado para apontar para a **mesma base URL do backend** (onde estão `/machines`, `/jobs`, `/packageVersions`, etc.). Assim as máquinas se registram e recebem os jobs corretamente.

Se você tiver o zip pronto: faça o **upload** em Pacotes, crie um **Projeto** com essa versão do pacote, garanta que há pelo menos uma **máquina** com agent registrada e use **Executar** (ou crie e execute um Job) para dar play.

---

## API URL e CORS (desenvolvimento)

- O front usa **`/api`** como base; o Vite faz proxy para o backend (`VITE_API_URL` ou `http://localhost:5143`). Problemas de **upload que falha** costumam ser **limite de tamanho no backend** (Kestrel/FormOptions), não proxy.
- No `.env`: **`VITE_API_URL=http://localhost:5143`** (opcional; é o padrão no Vite).
