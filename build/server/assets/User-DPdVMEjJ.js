import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { a as api, u as useNotificationStore, h as usersService, r as rolesService, i as companyUserService } from "./server-build-CRVtuzGx.js";
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
const userRoleService = {
  createUserRole: async (userRole) => {
    await api.post("/userRoles", userRole);
  }
};
function User() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: ""
    }
  });
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  useEffect(() => {
    loadRoles();
    if (isEditMode && id) {
      loadUserById(id);
    }
  }, [id, isEditMode]);
  const loadUserById = async (userId) => {
    try {
      const user = await usersService.getByIdUser(userId);
      console.log(user);
      setValue("name", user.name);
      setValue("cpf", user.cpf);
      setValue("email", user.email);
      setValue("phoneNumber", user.phoneNumber);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };
  const loadRoles = async () => {
    try {
      const data = await rolesService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };
  const toggleTempSelection = (roleId) => {
    setTempSelected(
      (prev) => prev.includes(roleId) ? prev.filter((id2) => id2 !== roleId) : [...prev, roleId]
    );
  };
  const addRole = (roleId) => {
    if (!selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds((prev) => [...prev, roleId]);
    }
    setTempSelected((prev) => prev.filter((id2) => id2 !== roleId));
  };
  const removeRole = (roleId) => {
    setSelectedRoleIds((prev) => prev.filter((id2) => id2 !== roleId));
    setTempSelected((prev) => prev.filter((id2) => id2 !== roleId));
  };
  const moveSelectedToRight = () => {
    tempSelected.forEach((id2) => {
      if (!selectedRoleIds.includes(id2)) {
        setSelectedRoleIds((prev) => [...prev, id2]);
      }
    });
    setTempSelected([]);
  };
  const moveSelectedToLeft = () => {
    setSelectedRoleIds((prev) => prev.filter((role) => !tempSelected.includes(role)));
    setTempSelected([]);
  };
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : `Role ${roleId}`;
  };
  const availableRoles = roles.filter((r) => !selectedRoleIds.includes(r.id));
  const onSubmit = async (data) => {
    if (password !== confirmPassword) {
      showToast(t("common.states.error"), t("pages.user.passwordMismatch"), "error");
      return;
    }
    if (selectedRoleIds.length === 0) {
      showToast(t("common.warning"), t("pages.user.selectOneRole"), "warning");
      return;
    }
    try {
      if (isEditMode && id) {
        const updateUser = {
          name: data.name,
          phoneNumber: data.phoneNumber
        };
        await usersService.updateUser(id, updateUser);
        showToast(t("common.states.success"), t("pages.user.updateSuccess"), "success");
        navigate("/users");
      } else {
        const inputUser = {
          name: data.name,
          cpf: data.cpf,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber
        };
        const user = await usersService.createUser(inputUser);
        await companyUserService.createCompanyUser({ userId: user.id, active: true });
        await userRoleService.createUserRole({
          userId: user.id,
          roleId: selectedRoleIds
        });
        showToast(t("common.states.success"), t("pages.user.createSuccess"), "success");
        navigate("/users");
      }
    } catch (error) {
      const message = error.response?.data?.message || t("pages.user.saveError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/users"),
          className: "text-indigo-600 hover:text-indigo-900 mb-4",
          children: [
            "← ",
            t("pages.user.back")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEditMode ? t("pages.user.titleEdit") : t("pages.user.titleCreate") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white shadow rounded-lg p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.name") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("name", { required: t("pages.user.nameRequired") }),
              className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.cpf") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("cpf", { required: t("pages.user.cpfRequired") }),
              disabled: isEditMode,
              className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            }
          ),
          errors.cpf && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.cpf.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.email") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              ...register("email", { required: t("pages.user.emailRequired") }),
              disabled: isEditMode,
              className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.phone") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("phoneNumber", { required: t("pages.user.phoneRequired") }),
              className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
            }
          ),
          errors.phoneNumber && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phoneNumber.message })
        ] }),
        !isEditMode && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.password") }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                ...register("password", { required: t("pages.user.passwordRequired") }),
                className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
              }
            ),
            errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: t("pages.user.confirmPassword") }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                ...register("confirmPassword", { required: t("pages.user.confirmPasswordRequired") }),
                className: "mt-1 block w-full px-3 py-3 text-base border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 focus:ring-0 transition-colors"
              }
            ),
            errors.confirmPassword && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message }),
            password && confirmPassword && password !== confirmPassword && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: t("pages.user.passwordMismatch") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-4", children: t("pages.user.roles") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: t("pages.user.availableRoles") }),
            /* @__PURE__ */ jsx("div", { className: "border rounded-md p-2 h-64 overflow-y-auto", children: availableRoles.map((role) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `p-2 mb-1 rounded cursor-pointer ${tempSelected.includes(role.id) ? "bg-indigo-100" : "hover:bg-gray-100"}`,
                onClick: () => toggleTempSelection(role.id),
                onDoubleClick: () => addRole(role.id),
                children: role.name
              },
              role.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: moveSelectedToRight,
                className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700",
                children: "→"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: moveSelectedToLeft,
                className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700",
                children: "←"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: t("pages.user.selectedRoles") }),
            /* @__PURE__ */ jsx("div", { className: "border rounded-md p-2 h-64 overflow-y-auto", children: selectedRoleIds.map((roleId) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `p-2 mb-1 rounded cursor-pointer ${tempSelected.includes(roleId) ? "bg-indigo-100" : "hover:bg-gray-100"}`,
                onClick: () => toggleTempSelection(roleId),
                onDoubleClick: () => removeRole(roleId),
                children: getRoleName(roleId)
              },
              roleId
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500",
          children: isEditMode ? t("common.buttons.save") : t("common.buttons.create")
        }
      ) })
    ] })
  ] });
}
export {
  User as default
};
