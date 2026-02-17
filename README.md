# RP B1 Front - React

Interface web em React (React Router + Vite) do sistema Beanstalk. Comunica com a **API .NET** (backend) em um processo separado.

## ⚠️ Dois projetos separados (não é um único build)

- **Este repositório** = só o **frontend** (React). Roda com `npm run dev` (ou `npm run build` + `npm run start` para produção).
- **Backend** = projeto **rp_b1_back** (.NET). Roda com `dotnet run --project Api` em outro terminal.
- **Agent** = projeto **rp_b1_agent** (opcional), para executar jobs nas máquinas.

Não existe um único comando que sobe front + back juntos. São sempre **dois (ou três) processos** distintos.

## Tecnologias

- **React 19** - UI
- **TypeScript** - Tipagem estática
- **Vite** - Build e dev server
- **Tailwind CSS** - Estilos
- **React Router 7** - Roteamento
- **Axios** - Cliente HTTP para a API
- **React Hook Form** - Formulários
- **i18next** - Traduções

## Estrutura do Projeto

```
app/
├── components/     # Componentes reutilizáveis
├── domain/         # Páginas por domínio
├── service/        # Chamadas à API
├── types/          # Tipos TypeScript
├── infrastructure/ # Environment, etc.
├── routes/         # Rotas (file-based)
└── ...
```

## Instalação

```bash
npm install
```

## Desenvolvimento

1. **Subir a API** (em outro terminal):
   ```bash
   cd rp_b1_back
   dotnet run --project Api
   ```
   A API fica em **http://localhost:5143** (perfil `http` no launchSettings).

2. **Subir o frontend**:
   ```bash
   npm run dev
   ```
   O front fica em **http://localhost:8080** (porta definida por `VITE_PORT` no `.env`; padrão 8080).

3. **URL da API no front**:
   - Se no `.env` existir `VITE_API_URL=http://localhost:5143`, as requisições vão **direto** para a API (CORS deve estar habilitado no backend).
   - Caso contrário, o Vite faz **proxy** de `/api` para `http://localhost:5143`.

## Build

```bash
npm run build
```

## Preview (build de produção)

```bash
npm run preview
```

## Variáveis de ambiente

- **VITE_PORT** – Porta do dev server (ex.: `8080`).
- **VITE_API_URL** – (Opcional) URL base da API (ex.: `http://localhost:5143`). Se definida, o front chama a API diretamente; senão usa o proxy do Vite.

## Documentação adicional

- [Fluxo Zip → Pacote → Execução (Agent)](docs/FLUXO-ZIP-AGENTE-EXECUCAO.md) – Upload de pacotes, projetos e execução nas máquinas.

## Funcionalidades principais

- Login e autenticação
- Automação (projetos, execução, jobs)
- Pacotes (upload/download de zip)
- Dispositivos/máquinas
- Agendamentos, Jobs, Assets
- Usuários, Roles e permissões
- Dashboard e notificações
