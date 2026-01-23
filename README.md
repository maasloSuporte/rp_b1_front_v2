# RP B1 Front - React

Projeto React migrado do Angular, utilizando as tecnologias mais recentes.

## Tecnologias

- **React 19.2.0** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── config/          # Configurações (environment)
├── pages/           # Páginas/rotas
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
├── App.tsx          # Componente principal
└── main.tsx         # Entry point
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Funcionalidades Implementadas

- ✅ Roteamento com React Router
- ✅ Serviços de API (Users, Roles, CompanyUser, UserRole)
- ✅ Página de Login
- ✅ Listagem de Usuários
- ✅ Criação/Edição de Usuários
- ✅ Seleção de Roles
- ✅ Interceptors HTTP para autenticação
- ✅ Configuração de ambiente
- ✅ Tailwind CSS configurado

## Próximos Passos

- Implementar autenticação completa
- Adicionar notificações/toasts
- Implementar modais de confirmação
- Adicionar paginação na tabela de usuários
- Implementar filtros e busca
- Adicionar mais páginas conforme necessário
