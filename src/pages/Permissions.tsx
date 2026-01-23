import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { permissionsService } from '../services/permissions.service';
import { rolesService } from '../services/roles.service';
import { rolesPermissionsService } from '../services/roles-permissions.service';
import { useNotificationStore } from '../services/notification.service';
import type {
  IPermissionsGetOutputDto,
  IRolesCreateInputDto,
  IRolesPermissionsCreateInputDto,
} from '../types/models';

interface PermissionsFormData {
  roleName: string;
}

interface GroupedPermission {
  resource: string;
  actions: {
    view?: number;
    edit?: number;
    create?: number;
    delete?: number;
  };
}

export default function Permissions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);

  const [permissions, setPermissions] = useState<IPermissionsGetOutputDto[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [roleId, setRoleId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PermissionsFormData>({
    defaultValues: {
      roleName: '',
    },
  });

  const roleName = watch('roleName');
  const isValid = selectedPermissions.length > 0;

  useEffect(() => {
    loadPermissions();
    if (isEditMode && id) {
      const roleIdNum = Number(id);
      setRoleId(roleIdNum);
      loadRolesPermissionById(roleIdNum);
      loadRole(roleIdNum);
    }
  }, [id, isEditMode]);

  const loadPermissions = async () => {
    try {
      const data = await permissionsService.getAllPermissions();
      setPermissions(data || []);
      groupPermissionsByResource(data || []);
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
    }
  };

  const groupPermissionsByResource = (perms: IPermissionsGetOutputDto[]) => {
    const actionMap: { [key: string]: string } = {
      create: 'create',
      read: 'view',
      patch: 'edit',
      delete: 'delete',
    };

    const grouped: { [key: string]: GroupedPermission } = {};

    for (const perm of perms) {
      const [resource, action] = perm.permission.split('/');
      const mappedAction = actionMap[action];

      if (!mappedAction) continue; // ignora ações desconhecidas

      if (!grouped[resource]) {
        grouped[resource] = {
          resource,
          actions: {},
        };
      }

      grouped[resource].actions[mappedAction as keyof GroupedPermission['actions']] = perm.id;
    }

    setGroupedPermissions(Object.values(grouped));
  };

  const loadRolesPermissionById = async (roleId: number) => {
    try {
      const rolesPermission = await rolesPermissionsService.getRolePermissions(roleId);
      setSelectedPermissions(rolesPermission.permissionsId || []);
    } catch (error) {
      console.error('Erro ao carregar permissões do role:', error);
    }
  };

  const loadRole = async (roleId: number) => {
    try {
      const role = await rolesService.getRole(roleId);
      setValue('roleName', role.name);
    } catch (error) {
      console.error('Erro ao carregar role:', error);
    }
  };

  const togglePermission = (permissionId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPermissions((prev) => [...prev, permissionId]);
    } else {
      setSelectedPermissions((prev) => prev.filter((id) => id !== permissionId));
    }
  };

  const onSubmit = async (data: PermissionsFormData) => {
    if (!data.roleName || data.roleName.length < 5 || selectedPermissions.length === 0) {
      showToast('Alerta', 'Os campos com * são obrigatórios', 'warning');
      return;
    }

    const inputRole: IRolesCreateInputDto = {
      name: data.roleName,
    };

    try {
      if (isEditMode && roleId) {
        await rolesService.updateRole(roleId, inputRole);

        const rolePermission: IRolesPermissionsCreateInputDto = {
          role: inputRole.name,
          permissionId: selectedPermissions,
        };

        await rolesPermissionsService.createRolesPermissions(rolePermission);
        showToast('Sucess', 'Permission group edit successfully', 'success');
        navigate('/roles');
      } else {
        await rolesService.createRole(inputRole);

        const rolePermission: IRolesPermissionsCreateInputDto = {
          role: inputRole.name,
          permissionId: selectedPermissions,
        };

        await rolesPermissionsService.createRolesPermissions(rolePermission);
        showToast('Sucess', 'Permission group created successfully', 'success');
        navigate('/roles');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao salvar permissões';
      showToast('Error', message, 'error');
    }
  };

  const cancelPermission = () => {
    navigate('/roles');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="permissions-container">
        {/* Cabeçalho */}
        <header className="header">
          <h1>Permissions</h1>
        </header>

        {/* Seção de Permissões dos Usuários */}
        <section className="permissions-section">
          {/* Campo de pesquisa de usuários */}
          <div className="input-group">
            <label htmlFor="user-search">Name *</label>
            <input
              type="text"
              id="user-search"
              className="input-field"
              placeholder="Enter user name"
              {...register('roleName', {
                required: 'Role name is required.',
                minLength: {
                  value: 5,
                  message: 'Role must be at least 5 characters long.',
                },
              })}
            />
            {errors.roleName && (
              <span className="error-message">
                {errors.roleName.type === 'required'
                  ? 'Role name is required.'
                  : errors.roleName.type === 'minLength'
                  ? 'Role must be at least 5 characters long.'
                  : errors.roleName.message}
              </span>
            )}
          </div>
        </section>

        {/* Tabela de Permissões */}
        <section className="table-section">
          <div className="permissions-card">
            <table className="permissions-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Permissions</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Create</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {groupedPermissions.map((group, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'left' }}>{group.resource}</td>

                    <td>
                      {group.actions.view && (
                        <input
                          type="checkbox"
                          className="permission-radio"
                          checked={selectedPermissions.includes(group.actions.view!)}
                          onChange={(e) => togglePermission(group.actions.view!, e)}
                        />
                      )}
                    </td>

                    <td>
                      {group.actions.create && (
                        <input
                          type="checkbox"
                          className="permission-radio"
                          checked={selectedPermissions.includes(group.actions.create!)}
                          onChange={(e) => togglePermission(group.actions.create!, e)}
                        />
                      )}
                    </td>

                    <td>
                      {group.actions.edit && (
                        <input
                          type="checkbox"
                          className="permission-radio"
                          checked={selectedPermissions.includes(group.actions.edit!)}
                          onChange={(e) => togglePermission(group.actions.edit!, e)}
                        />
                      )}
                    </td>

                    <td>
                      {group.actions.delete && (
                        <input
                          type="checkbox"
                          className="permission-radio"
                          checked={selectedPermissions.includes(group.actions.delete!)}
                          onChange={(e) => togglePermission(group.actions.delete!, e)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Botões Cancel e Create */}
        <div className="action-buttons">
          <button type="button" className="cancel-btn" onClick={cancelPermission}>
            Cancel
          </button>
          <button type="submit" className="create-btn" disabled={!isValid}>
            {isEditMode ? 'Edit' : 'Create'}
          </button>
        </div>
      </div>

      <style>{`
        .permissions-container {
          position: relative;
          padding: 20px;
          min-height: 100vh;
          background-color: #f8f9fc;
        }

        h1 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 42px;
          color: #2A3547;
          margin-bottom: 40px;
        }

        label {
          font-size: 16px;
          font-weight: bold;
          color: #FB7F0D;
          margin-bottom: 5px;
          display: block;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 2px solid #FB7F0D;
          color: #2A3547;
          background-color: white;
          outline: none;
        }

        .error-message {
          margin-top: 10px;
          font-size: 13px;
          color: red;
        }

        th {
          font-weight: bold;
          color: #2A3547;
          text-transform: uppercase;
          background-color: transparent;
        }

        .permissions-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 20px;
        }

        .permissions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .permissions-table th,
        .permissions-table td {
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #E0E0E0;
        }

        .permissions-table th {
          font-weight: bold;
          color: #2A3547;
        }

        .permissions-table tr:last-child td {
          border-bottom: none;
        }

        .permission-radio {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #FB7F0D;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          cursor: pointer;
        }

        .permission-radio:checked {
          background-color: #FB7F0D;
          box-shadow: inset 0 0 0 3px white;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-btn {
          background: none;
          border: 2px solid #FB7F0D;
          color: #FB7F0D;
          border-radius: 5px;
          padding: 10px 40px 10px 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .create-btn {
          background: none;
          border: 2px solid #282F5D;
          color: #282F5D;
          border-radius: 5px;
          padding: 10px 40px 10px 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .create-btn:disabled {
          background-color: #ccc;
          color: #666;
          cursor: not-allowed;
          box-shadow: none;
          opacity: 0.7;
        }
      `}</style>
    </form>
  );
}
