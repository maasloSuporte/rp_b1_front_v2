import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { a as api, u as useNotificationStore, r as rolesService } from "./server-build-CRVtuzGx.js";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "i18next";
import "zustand";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "lucide-react";
import "axios";
const permissionsService = {
  getAllPermissions: async () => {
    const response = await api.get("/permissions/all");
    return response.data;
  }
};
const rolesPermissionsService = {
  createRolesPermissions: async (rolesPermissions) => {
    const response = await api.post(
      "/rolePermissions",
      rolesPermissions,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  },
  getRolePermissions: async (roleId) => {
    const response = await api.get(
      `/rolePermissions/RoleId${roleId}`
    );
    return response.data;
  }
};
function Permissions() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [, setPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      roleName: ""
    }
  });
  watch("roleName");
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
      console.error("Erro ao buscar permissões:", error);
    }
  };
  const groupPermissionsByResource = (perms) => {
    const actionMap = {
      create: "create",
      read: "view",
      patch: "edit",
      delete: "delete"
    };
    const grouped = {};
    for (const perm of perms) {
      const parts = perm.permission.split("/");
      const resource = parts[0] ?? "";
      const action = parts[1] ?? "";
      const mappedAction = actionMap[action];
      if (!mappedAction) continue;
      const resourceKey = resource.toLowerCase();
      if (!grouped[resourceKey]) {
        grouped[resourceKey] = {
          resource: resourceKey === "roles" ? "Roles" : resource,
          actions: {}
        };
      }
      grouped[resourceKey].actions[mappedAction] = perm.id;
    }
    setGroupedPermissions(Object.values(grouped));
  };
  const loadRolesPermissionById = async (roleId2) => {
    try {
      const rolesPermission = await rolesPermissionsService.getRolePermissions(roleId2);
      setSelectedPermissions(rolesPermission.permissionsId || []);
    } catch (error) {
      console.error("Erro ao carregar permissões do role:", error);
    }
  };
  const loadRole = async (roleId2) => {
    try {
      const role = await rolesService.getRole(roleId2);
      setValue("roleName", role.name);
    } catch (error) {
      console.error("Erro ao carregar role:", error);
    }
  };
  const togglePermission = (permissionId, event) => {
    if (event.target.checked) {
      setSelectedPermissions((prev) => [...prev, permissionId]);
    } else {
      setSelectedPermissions((prev) => prev.filter((id2) => id2 !== permissionId));
    }
  };
  const onSubmit = async (data) => {
    if (!data.roleName || data.roleName.length < 5 || selectedPermissions.length === 0) {
      showToast(t("common.warning"), t("pages.permissions.requiredFieldsWarning"), "warning");
      return;
    }
    const inputRole = {
      name: data.roleName
    };
    try {
      if (isEditMode && roleId) {
        await rolesService.updateRole(roleId, inputRole);
        const rolePermission = {
          role: inputRole.name,
          permissionId: selectedPermissions
        };
        await rolesPermissionsService.createRolesPermissions(rolePermission);
        showToast(t("common.states.success"), t("pages.permissions.editSuccess"), "success");
        navigate("/roles");
      } else {
        await rolesService.createRole(inputRole);
        const rolePermission = {
          role: inputRole.name,
          permissionId: selectedPermissions
        };
        await rolesPermissionsService.createRolesPermissions(rolePermission);
        showToast(t("common.states.success"), t("pages.permissions.createSuccess"), "success");
        navigate("/roles");
      }
    } catch (error) {
      const message = error.response?.data?.message || t("pages.permissions.saveError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  const cancelPermission = () => {
    navigate("/roles");
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
    /* @__PURE__ */ jsxs("div", { className: "permissions-container", children: [
      /* @__PURE__ */ jsx("header", { className: "header", children: /* @__PURE__ */ jsx("h1", { children: t("pages.permissions.title") }) }),
      /* @__PURE__ */ jsx("section", { className: "permissions-section", children: /* @__PURE__ */ jsxs("div", { className: "input-group", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "user-search", children: t("pages.permissions.nameRequired") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "user-search",
            className: "input-field",
            placeholder: t("pages.permissions.placeholder"),
            ...register("roleName", {
              required: t("pages.permissions.roleNameRequired"),
              minLength: {
                value: 5,
                message: t("pages.permissions.roleNameMinLength")
              }
            })
          }
        ),
        errors.roleName && /* @__PURE__ */ jsx("span", { className: "error-message", children: errors.roleName.type === "required" ? t("pages.permissions.roleNameRequired") : errors.roleName.type === "minLength" ? t("pages.permissions.roleNameMinLength") : errors.roleName.message })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "table-section", children: /* @__PURE__ */ jsx("div", { className: "permissions-card", children: /* @__PURE__ */ jsxs("table", { className: "permissions-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { style: { textAlign: "left" }, children: t("pages.permissions.permissions") }),
          /* @__PURE__ */ jsx("th", { children: t("pages.permissions.view") }),
          /* @__PURE__ */ jsx("th", { children: t("pages.permissions.edit") }),
          /* @__PURE__ */ jsx("th", { children: t("pages.permissions.create") }),
          /* @__PURE__ */ jsx("th", { children: t("pages.permissions.delete") })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: groupedPermissions.map((group, index) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { textAlign: "left" }, children: group.resource }),
          /* @__PURE__ */ jsx("td", { children: group.actions.view != null ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "permission-radio",
              checked: selectedPermissions.includes(group.actions.view),
              onChange: (e) => togglePermission(group.actions.view, e)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "permission-empty", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { children: group.actions.edit != null ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "permission-radio",
              checked: selectedPermissions.includes(group.actions.edit),
              onChange: (e) => togglePermission(group.actions.edit, e)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "permission-empty", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { children: group.actions.create != null ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "permission-radio",
              checked: selectedPermissions.includes(group.actions.create),
              onChange: (e) => togglePermission(group.actions.create, e)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "permission-empty", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { children: group.actions.delete != null ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "permission-radio",
              checked: selectedPermissions.includes(group.actions.delete),
              onChange: (e) => togglePermission(group.actions.delete, e)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "permission-empty", children: "—" }) })
        ] }, index)) })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "action-buttons", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cancel-btn", onClick: cancelPermission, children: t("common.buttons.cancel") }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "create-btn", disabled: !isValid, children: isEditMode ? t("common.buttons.edit") : t("common.buttons.create") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
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

        .permission-empty {
          color: #999;
          font-size: 14px;
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
      ` })
  ] });
}
export {
  Permissions as default
};
