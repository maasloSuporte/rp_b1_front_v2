# Vínculos entre entidades e ordem de exclusão

Este documento descreve **quem referencia quem** no sistema e **em que ordem excluir** para conseguir remover tudo sem erro de FK (foreign key). Também explica por que **jobs entram na fila automaticamente** e como deixar **1x por semana** corretamente.

---

## 1. Diagrama de vínculos (quem aponta para quem)

```
Pacote (Package)
  └── Versão do pacote (PackageVersion)  [PackageId]
          ↑
Projeto (Project)  ─────────────────────  [packageVersionId]
  │
  ├── Job  ─────────────────────────────  [projectId]
  │       └── também: machineId, priorityId
  │
  └── Agendamento (Schedule)  ───────────  [projectId, machineId, priorityId, frequencyId]
          └── Argumentos do agendamento (ScheduleArguments)  [ScheduleId]

Máquina (Machine)
  ├── Job  ─────────────────────────────  [machineId]
  └── Agendamento (Schedule)  ───────────  [machineId]

Prioridade (Priority)
  ├── Job  ─────────────────────────────  [priorityId]
  └── Agendamento (Schedule)  ───────────  [priorityId]

Frequência (Frequency)
  └── Agendamento (Schedule)  ───────────  [frequencyId]
```

Resumo:

| Entidade        | É referenciada por                          | Não pode excluir se existir… |
|-----------------|---------------------------------------------|------------------------------|
| **Máquina**     | Job, Agendamento (Schedule)                 | Job ou Schedule com essa machineId |
| **Projeto**     | Job, Agendamento (Schedule)                | Job ou Schedule com esse projectId |
| **Agendamento** | ScheduleArguments (filhos com FK ScheduleId) | No backend: tabela de argumentos que referencia o Schedule; o usuário **não** precisa excluir nada antes — o backend deve tratar (ver seção 6). |
| **Versão do pacote** | Projeto (packageVersionId)            | Projeto usando essa versão |
| **Pacote**      | Versões do pacote                           | Alguma PackageVersion desse pacote |

---

## 2. Ordem correta para excluir tudo

Para **não** dar erro de banco (FK / DbUpdateException), exclua ou desvincule nesta ordem:

### Passo 1 – Jobs

- **Gerenciar → Fila de espera (Jobs)** → exclua os jobs da fila (um a um ou em lote).
- Ou use **Excluir todos** se a tela tiver essa ação.
- **Jobs** são criados manualmente (Executar / Criar job) ou **automaticamente pelo agendamento** (veja seção 4). Enquanto houver jobs apontando para um projeto ou uma máquina, você não consegue excluir esse projeto nem essa máquina.

### Passo 2 – Agendamentos (Schedules)

- **Agendamentos** → para cada agendamento que usa o **projeto** ou a **máquina** que você quer remover:
  - **Opção A:** editar o agendamento e escolher **"— Nenhum (opcional)"** em Projeto e/ou Máquina, salvar (assim o vínculo some).
  - **Opção B:** excluir o agendamento.
- Só depois disso o backend consegue excluir **Projeto** ou **Máquina** sem erro de FK.

### Passo 3 – Projetos (Automação)

- **Automação** → exclua os **projetos** que você não quer mais.
- Só faça isso depois de não haver **jobs** nem **agendamentos** referenciando esse projeto.

### Passo 4 – Máquinas

- **Dispositivos/Máquinas** → exclua as **máquinas** que não quer mais.
- Só faça isso depois de não haver **jobs** nem **agendamentos** referenciando essa máquina.

### Resumo da ordem

1. **Jobs** (remover ou executar e limpar a fila).  
2. **Agendamentos** (excluir ou desvincular Projeto/Máquina com "Nenhum (opcional)" e salvar).  
3. **Projetos**.  
4. **Máquinas**.

---

## 3. Por que os jobs entram na fila automaticamente?

Os jobs são criados **pelo backend** quando um **Agendamento (Schedule)** dispara.

- O backend tem um processo (scheduler / hosted service) que:
  - Lê os agendamentos ativos.
  - Calcula a **próxima execução** (nextExecution) com base na **frequência** e no **cron**.
  - Quando chega a hora, **cria um Job** com o `projectId`, `machineId` e `priorityId` daquele agendamento e coloca na fila (e pode chamar execute ou deixar na fila).

Por isso: **se existir um agendamento ativo com Projeto e Máquina preenchidos, o backend continuará criando jobs na frequência configurada.**

---

## 4. Como deixar “1 vez por semana” e parar de criar job toda hora

Se você já configurou para 1x por semana mas os jobs continuam entrando com mais frequência, confira o seguinte.

### 4.1 Frequência do agendamento

No formulário do agendamento (**Agendamentos → Criar** ou **Editar**):

- **Frequência** deve ser **"Weekly" (Semanal)**.
- No front, isso corresponde a **frequencyId = 4** (veja no código: `FREQUENCY_ID_TO_KEY`: 1 = Every Minute, 2 = Hourly, 3 = Daily, **4 = Weekly**, 5 = Monthly by Day, 6 = Monthly by Week, 7 = Custom Cron).

Se estiver **Every Minute (1)**, **Hourly (2)** ou **Daily (3)**, o backend vai criar job a cada minuto, de hora em hora ou todo dia — não 1x por semana.

### 4.2 Campos obrigatórios para Weekly (Semanal)

Para **Frequência = Weekly** o front exige:

- **Repeat every** (a cada quantas semanas): use **1** para “1 vez por semana”.
- **Day of Week** (dia da semana): escolha o dia (ex.: Segunda).

Sem isso, o cron pode ficar errado e o backend pode interpretar como execução mais frequente.

### 4.3 Verificar quantos agendamentos existem

- Vá em **Agendamentos** e veja a lista.
- Se houver **mais de um** agendamento para o mesmo projeto/máquina, **cada um** vai gerar jobs na sua própria frequência.
- Para ter só 1x por semana: deixe **apenas um** agendamento com **Frequência = Weekly**, Repeat every = 1 e o dia desejado; exclua ou desative os outros.

### 4.4 Onde isso é configurado no front

- **Menu:** Agendamentos → abrir o agendamento (criar ou editar).
- **Projeto / Máquina / Prioridade:** definem qual projeto roda em qual máquina quando o agendamento dispara.
- **Frequência:** escolha **Semanal (Weekly)**.
- **Agendamento Cron:** preencha **Repeat every** = 1 e **Day of Week** com o dia da semana.

O backend é quem interpreta o cron e calcula a **nextExecution**; se mesmo assim os jobs continuarem entrando em outro ritmo, o ajuste fino (cron expression, timezone, nextExecution) tem que ser feito no **backend** (rp_b1_back).

---

## 5. Resumo rápido

| Objetivo | O que fazer |
|----------|-------------|
| **Excluir projeto** | 1) Excluir ou esvaziar jobs desse projeto. 2) Excluir ou desvincular (Projeto = Nenhum) nos agendamentos. 3) Excluir o projeto. |
| **Excluir máquina** | 1) Excluir ou esvaziar jobs dessa máquina. 2) Excluir ou desvincular (Máquina = Nenhum) nos agendamentos. 3) Excluir a máquina. |
| **Excluir agendamento** | Excluir o agendamento (e, no backend, argumentos/relacionados se necessário). |
| **Parar jobs automáticos** | Excluir o agendamento ou desvincular Projeto/Máquina (salvar com "Nenhum (opcional)"). |
| **Só 1x por semana** | Um único agendamento com Frequência = **Semanal**, Repeat every = **1**, Day of Week definido; sem outros agendamentos disparando o mesmo fluxo. |

---

## 6. Por que não consigo excluir o agendamento? (e o que o backend precisa fazer)

O front envia **`DELETE /api/schedules/{id}`** e não exige que o usuário exclua nada antes. O erro **DbUpdateException** ao excluir o agendamento acontece porque:

- Ao **criar** um agendamento, o front envia um array **`arguments`** (ex.: `[{ name: 'default', key: 'default', value: 'default', order: 1 }]`).
- No backend isso vira registros na tabela de **argumentos do agendamento** (ex.: `ScheduleArguments` ou `QueueTriggerArguments`) com **FK para o Schedule** (`ScheduleId`).
- Ao chamar **DELETE** no Schedule, o banco **impede** a exclusão enquanto existir filho referenciando esse Schedule (restrição de FK).

Ou seja: **não é relação com Job nem com Projeto/Máquina** que prende — é a tabela de **argumentos** (filhos do próprio Schedule). O usuário não tem como “excluir argumentos” na tela; quem deve resolver é o **backend**.

### O que o backend (rp_b1_back) precisa fazer

**Opção A – Excluir os filhos antes de excluir o Schedule (recomendado)**

No handler do **DELETE** do Schedule (ex.: `SchedulesController.Delete` ou serviço equivalente):

1. Antes de chamar `_context.Schedules.Remove(schedule)` (ou equivalente), **remover todos os registros que referenciam esse Schedule** na tabela de argumentos, por exemplo:
   - `DELETE FROM ScheduleArguments WHERE ScheduleId = @id` (SQL), ou
   - Em EF: carregar os argumentos (`schedule.Arguments` ou `context.ScheduleArguments.Where(a => a.ScheduleId == id)`) e fazer `RemoveRange`, depois `SaveChanges`.
2. Só então excluir o Schedule e dar `SaveChanges` de novo (ou fazer tudo na mesma transação).

**Opção B – Cascade delete no banco**

Configurar a FK da tabela de argumentos para o Schedule com **ON DELETE CASCADE**. Aí, ao excluir o Schedule, o banco apaga os argumentos automaticamente. Em Entity Framework isso pode ser feito assim (exemplo):

```csharp
entity.HasOne(...)
  .WithMany(...)
  .OnDelete(DeleteBehavior.Cascade);
```

Depois de aplicar **A** ou **B**, o **DELETE /api/schedules/{id}** deve passar sem DbUpdateException e o agendamento será excluído mesmo tendo argumentos.
