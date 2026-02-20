# Agent na máquina do cliente

Este documento descreve o que **você** (administrador) e o **cliente** precisam fazer para o Agent rodar na máquina do cliente e executar jobs.

---

## Visão geral

- O **backend (API)** fica no seu servidor (ou em um ambiente acessível pela internet/VPN).
- O **Agent** é instalado na **máquina do cliente** (Windows).
- O cliente **não** precisa acessar o front (portal web); só precisa instalar e configurar o Agent uma vez. Depois, o Worker pode rodar em background (ou como serviço Windows).

Fluxo resumido:

1. **Você:** Cria a máquina no portal (Dispositivos → Criar máquina) e obtém o **token de registro**.
2. **Você:** Envia ao cliente: instalador do Agent (ou instruções), **URL do backend** e **token de registro** (válido por poucos minutos).
3. **Cliente:** Instala o Agent, abre o **Front** (WPF), informa URL + token e clica em Conectar → a máquina fica registrada.
4. **Cliente:** Roda o **Worker** (ou instala como serviço) → o Agent passa a puxar e executar jobs na máquina.

---

## O que você precisa fazer (administrador)

### 1. Backend acessível pelo cliente

A API e o SignalR precisam ser acessíveis **a partir da máquina do cliente**. Por exemplo:

- Backend em produção: `https://api.seudominio.com.br`
- Ou em homologação: `https://beanstalk-homolog.ibasolutions.com.br`
- Em rede interna: `http://192.168.1.10:5143` (se o cliente estiver na mesma rede)

**Não** use `localhost` para o cliente; isso só vale na sua própria máquina.

### 2. Criar a máquina no portal

1. Acesse o portal (front) → **Dispositivos** (ou **Máquinas**).
2. Clique em **Criar modelo de máquina** (ou equivalente).
3. Informe o **nome da máquina** (ex.: "PC-Cliente-Matriz") e salve.
4. Anote o **ID** da máquina (ou abra a edição dessa máquina).

### 3. Obter o token de registro

O token é um JWT de curta duração (ex.: 5 minutos) usado **apenas** para o Agent se registrar na primeira vez.

- **Opção A:** Na tela de **edição da máquina** (Dispositivos → Editar → [máquina]), se houver o campo **Token de registro**, copie e envie ao cliente. Use dentro de poucos minutos.
- **Opção B:** Via API (Swagger ou outro cliente):
  - `GET /api/machines/{id}` (com seu token de usuário).
  - Na resposta, copie o campo `token` e envie ao cliente.

Envie ao cliente em canal seguro (o token expira rápido).

### 4. Enviar ao cliente

- **URL do backend** que o cliente deve usar no Agent (ex.: `https://api.seudominio.com.br` ou `https://api.seudominio.com.br/api`, conforme o que o instalador pedir).
- **Token de registro** (obtido no passo anterior).
- **Instalador do Agent** (MSI ou pacote do repositório `rp_b1_agent`), ou instruções para baixar/instalar.

---

## O que o cliente precisa fazer

### 1. Instalar o Agent

- Se você entregar um **MSI**: executar o instalador e concluir a instalação.
- Se for **pacote manual**: descompactar e usar os executáveis do Agent (Front e Worker) conforme as instruções que você passar.

Requisito: **Windows** e **.NET 9.0 Runtime** (ou o Agent self-contained, se você tiver distribuído assim).

### 2. Registrar a máquina (uma vez)

1. Abrir o **Agent Front** (aplicação com janela, não o Worker).
2. No campo **URL do backend**, informar exatamente o que você passou (ex.: `https://api.seudominio.com.br/api`).
3. No campo **Token**, colar o **token de registro** que você enviou.
4. Clicar em **Conectar** (ou equivalente).

Se der certo, o Agent grava no Windows:

- **MachineId** e **URL do backend** no Registry.
- Credenciais no Windows Credential Manager.

Depois disso, a máquina passa a aparecer na lista de **Dispositivos** no portal (com nome, IP, etc., quando o Worker estiver rodando e enviando informações).

### 3. Rodar o Worker (executar jobs)

Para os jobs realmente rodarem na máquina do cliente:

- **Opção A – Manual:** Abrir o **Worker** do Agent (executável ou `dotnet run --project Worker/Worker.csproj`) e deixar rodando. O Worker conecta ao backend via SignalR e solicita jobs periodicamente.
- **Opção B – Serviço Windows:** Se o instalador ou você tiver configurado o Worker como serviço do Windows, garantir que o serviço está **iniciado** (e que o registro foi feito antes com o Front).

Enquanto o Worker estiver rodando e a máquina estiver registrada, os jobs que **você** criar no portal para essa máquina serão entregues ao Agent e executados nela.

---

## Resumo rápido

| Quem        | Ação |
|------------|------|
| **Você**   | Backend acessível (URL pública ou interna); criar máquina no portal; obter token de registro; enviar ao cliente: URL do backend + token + instalador (ou instruções). |
| **Cliente**| Instalar o Agent; abrir o Front, colar URL + token e conectar (registro); rodar o Worker (ou garantir que o serviço está ativo). |

Depois disso, no portal você escolhe essa máquina ao **Executar** um job (ou ao criar um job na fila) e o processo roda na máquina do cliente.

---

## Documentos relacionados

- [FLUXO-ZIP-AGENTE-EXECUCAO.md](./FLUXO-ZIP-AGENTE-EXECUCAO.md) – Fluxo zip → pacote → projeto → execução e por que o job não roda.
- No repositório do backend: `docs/COMO_INICIAR_AGENT.md` e `docs/INTEGRACAO_AGENT_BACKEND.md` – Detalhes do Agent (Front vs Worker, registro, SignalR, serviço Windows).
