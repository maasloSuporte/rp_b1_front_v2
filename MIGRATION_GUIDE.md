# Guia de Migração Completo - Angular para React

## ✅ O que já foi migrado

### Estrutura Base
- ✅ Projeto React com Vite + TypeScript
- ✅ Tailwind CSS configurado com cores exatas do Angular
- ✅ React Router configurado
- ✅ Axios com interceptors
- ✅ React Hook Form
- ✅ Zustand para gerenciamento de estado

### Modelos/DTOs
- ✅ **103 arquivos** migrados automaticamente
- ✅ Todos os tipos TypeScript disponíveis em `src/types/models/`

### Serviços (12/23)
- ✅ `api.ts` - Cliente HTTP base
- ✅ `users.service.ts`
- ✅ `roles.service.ts`
- ✅ `companyUser.service.ts`
- ✅ `userRole.service.ts`
- ✅ `login.service.ts`
- ✅ `auth.service.ts`
- ✅ `assets.service.ts`
- ✅ `packages.service.ts`
- ✅ `devices.service.ts`
- ✅ `projects.service.ts`
- ✅ `schedule.service.ts`
- ✅ `notification.service.ts`
- ✅ `modal.service.ts`

### Componentes Compartilhados
- ✅ `DynamicTable.tsx` - Tabela dinâmica completa
- ✅ `Notification.tsx` - Sistema de notificações
- ✅ `DeleteModal.tsx` - Modal de confirmação de exclusão
- ✅ `EnabledModal.tsx` - Modal de confirmação de ativação
- ✅ `ModalProvider.tsx` - Provider de modais

### Páginas (3/30+)
- ✅ `Login.tsx`
- ✅ `Users.tsx`
- ✅ `User.tsx` (Create/Edit)

## 🔄 Padrão de Migração

### 1. Migrar uma Página

**Exemplo: Roles**

```typescript
// src/pages/Roles.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rolesService } from '../services/roles.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import DynamicTable from '../components/DynamicTable';
import type { TableColumn, ActionMenuItem } from '../types/table';
import type { IRolesGetOutputDto, IPaginationOutputDto } from '../types/models';

export default function Roles() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState('');

  const columns: TableColumn[] = [
    {
      key: 'name',
      sortKey: 'name',
      label: 'Name',
      filterable: true,
      sortable: false,
      filterType: 'text',
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'action'
    }
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      label: 'Edit',
      action: 'edit',
      icon: 'edit'
    },
    {
      label: 'Deleted',
      action: 'deleted',
      icon: 'block',
    }
  ];

  useEffect(() => {
    loadRoles();
  }, [queryString]);

  const loadRoles = async () => {
    try {
      const result: IPaginationOutputDto<IRolesGetOutputDto> = 
        await rolesService.getAllRolesFilter(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map(x => ({
        id: x.id,
        name: x.name
      })));
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };

  const handleActionClick = async (event: { action: string, item: any }) => {
    switch (event.action) {
      case 'edit':
        navigate(`/permissions/${event.item.id}`);
        break;
      case 'deleted':
        const confirmed = await confirmDelete({
          itemName: event.item.name,
        });
        if (confirmed) {
          try {
            await rolesService.deleteRole({ id: event.item.id });
            showToast('Sucess', 'Permission group successfully deleted', 'success');
            loadRoles();
          } catch (error) {
            showToast('Error', 'Failed to delete role', 'error');
          }
        }
        break;
    }
  };

  return (
    <div className="container-global">
      <h1 className="title-global">Roles</h1>
      <div className="roles-header mb-6">
        <button 
          onClick={() => navigate('/permissions')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Add role <span>+</span>
        </button>
      </div>
      <section className="table-section">
        <DynamicTable
          columns={columns}
          data={data}
          totalItems={totalItems}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 100]}
          showFirstLastButtons={true}
          actionMenuItems={actionMenuItems}
          onActionClick={handleActionClick}
          onQueryParamsChange={setQueryString}
        />
      </section>
    </div>
  );
}
```

### 2. Migrar um Serviço

**Padrão:**
```typescript
// src/services/[nome].service.ts
import api from './api';
import type { ... } from '../types/models';

export const [nome]Service = {
  methodName: async (params): Promise<ReturnType> => {
    const response = await api.get|post|patch|delete<ReturnType>(`/endpoint`, data);
    return response.data;
  },
};
```

### 3. Estilos

**Converter SCSS para Tailwind:**

```scss
// Angular SCSS
.container-global {
  padding: 20px;
  background-color: #f8f9fc;
}
```

```tsx
// React com Tailwind
<div className="p-5 bg-background">
```

**Cores customizadas já configuradas no Tailwind:**
- `primary` - #5d87ff
- `accent` - #49beff
- `warning` - #ffae1f
- `error` - #fa896b
- `success` - #13deb9
- `orange` - #FB7F0D
- `purple` - #36263F
- `purple-dark` - #2B1239

## 📋 Checklist de Migração por Página

Para cada página, seguir este checklist:

- [ ] Criar arquivo em `src/pages/[Nome].tsx`
- [ ] Migrar lógica do componente Angular
- [ ] Converter formulários para React Hook Form
- [ ] Converter estilos SCSS para Tailwind
- [ ] Usar `DynamicTable` se tiver tabela
- [ ] Usar `useModalStore` para modais
- [ ] Usar `useNotificationStore` para notificações
- [ ] Adicionar rota em `App.tsx`
- [ ] Testar funcionalidade

## 🚀 Próximos Passos

### Serviços Restantes (11)
1. `fileDownload.service.ts`
2. `frequency.service.ts`
3. `job.service.ts`
4. `packagesVersions.service.ts`
5. `permissions.service.ts`
6. `priority.service.ts`
7. `queues.service.ts`
8. `queuesTrigger.service.ts`
9. `roles-permissions.service.ts`
10. `technology.service.ts`
11. Outros serviços específicos

### Páginas Restantes (27+)
1. Dashboard
2. Roles
3. AssetsManagement
4. Asset
5. ScheduledActivities
6. Schedule
7. Project
8. EventTriggers
9. Packages
10. UploadPackages
11. DescriptionPackages
12. AuditLog
13. Queues
14. InProgress
15. DeviceTemplate
16. DevicePools
17. Device
18. Logs
19. Permissions
20. Licences
21. JobDetails
22. Jobs
23. Automation
24. Execution
25. Home (e componentes relacionados)

### Layout Completo
- [ ] Sidebar com navegação
- [ ] Header com notificações
- [ ] Breadcrumb
- [ ] Sistema de temas

## 📝 Notas Importantes

1. **Cores**: Todas as cores do Angular estão configuradas no Tailwind
2. **Fontes**: Plus Jakarta Sans configurada
3. **Modais**: Usar `useModalStore` ao invés de Material Dialog
4. **Tabelas**: Usar `DynamicTable` para todas as tabelas
5. **Formulários**: Usar React Hook Form
6. **Estado**: Usar Zustand para estado global
7. **Rotas**: Adicionar em `App.tsx` seguindo o padrão existente

## 🔧 Comandos Úteis

```bash
# Executar projeto
npm run dev

# Build
npm run build

# Verificar tipos
npm run build
```

## 📚 Recursos

- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Headless UI](https://headlessui.com/)
