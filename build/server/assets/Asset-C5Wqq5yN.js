import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { u as useNotificationStore, g as assetsService } from "./server-build-CRVtuzGx.js";
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
function Asset() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      type: "Text",
      description: "",
      value: "",
      userName: ""
    }
  });
  const typeValue = watch("type");
  useEffect(() => {
    if (isEditMode && id) {
      loadAssetById(Number(id));
    }
  }, [id, isEditMode]);
  const loadAssetById = async (assetId) => {
    try {
      const asset = await assetsService.getByIdAsset(assetId);
      console.log(asset);
      setValue("name", asset.name);
      setValue("type", asset.type);
      setValue("description", asset.description);
      setValue("value", asset.value);
      setValue("userName", asset.userName || "");
    } catch (error) {
      console.error("Erro ao carregar asset:", error);
    }
  };
  const onSubmit = async (data) => {
    try {
      if (isEditMode && id) {
        const updateAsset = {
          name: data.name,
          type: data.type,
          description: data.description,
          value: data.value,
          userName: data.userName,
          globalValue: data.globalValue,
          projectId: data.projectId
        };
        await assetsService.updateAsset(Number(id), updateAsset);
        showToast("Sucess", "Asset edited successfully", "success");
        navigate("/assets");
      } else {
        const inputAsset = {
          name: data.name,
          type: data.type,
          description: data.description,
          value: data.value,
          userName: data.userName
        };
        await assetsService.createAsset(inputAsset);
        showToast("Success", "Asset created successfully", "success");
        navigate("/assets");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao salvar asset";
      showToast("Error", message, "error");
    }
  };
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setValue("type", selectedType);
    if (selectedType === "Bool") {
      setValue("value", "false");
    } else {
      setValue("value", "");
      setValue("userName", "");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/assets"),
          className: "text-primary hover:text-primary/80 mb-4",
          children: [
            "← ",
            t("pages.asset.back")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: isEditMode ? t("pages.asset.titleEdit") : t("pages.asset.titleCreate") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.name"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("name", {
                required: t("pages.asset.nameRequired"),
                minLength: { value: 5, message: t("pages.asset.nameMinLength") }
              }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.type"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("type", { required: t("pages.asset.typeRequired") }),
              onChange: handleTypeChange,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: "Text", children: t("pages.asset.typeText") }),
                /* @__PURE__ */ jsx("option", { value: "Integer", children: t("pages.asset.typeInteger") }),
                /* @__PURE__ */ jsx("option", { value: "Bool", children: t("pages.asset.typeBool") }),
                /* @__PURE__ */ jsx("option", { value: "Credential", children: t("pages.asset.typeCredential") })
              ]
            }
          ),
          errors.type && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.type.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.description"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ...register("description", {
                required: t("pages.asset.descriptionRequired"),
                minLength: { value: 5, message: t("pages.asset.descriptionMinLength") }
              }),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.description.message })
        ] }),
        typeValue === "Text" && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.value"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("value", { required: t("pages.asset.valueRequired") }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.value && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.value.message })
        ] }),
        typeValue === "Integer" && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.value"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              ...register("value", { required: t("pages.asset.valueRequired") }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.value && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.value.message })
        ] }),
        typeValue === "Bool" && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.asset.value"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("value", { required: t("pages.asset.valueRequired") }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: "true", children: t("common.true") }),
                /* @__PURE__ */ jsx("option", { value: "false", children: t("common.false") })
              ]
            }
          ),
          errors.value && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.value.message })
        ] }),
        typeValue === "Credential" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
              t("pages.asset.value"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                ...register("value", { required: t("pages.asset.valueRequired") }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              }
            ),
            errors.value && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.value.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
              t("pages.asset.userName"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                ...register("userName", {
                  required: typeValue === "Credential" ? t("pages.asset.userNameRequired") : false
                }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              }
            ),
            errors.userName && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.userName.message })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/assets"),
            className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",
            children: t("common.buttons.cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90",
            children: isEditMode ? t("common.buttons.save") : t("common.buttons.create")
          }
        )
      ] })
    ] })
  ] });
}
export {
  Asset as default
};
