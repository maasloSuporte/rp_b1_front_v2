import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { u as useNotificationStore, d as devicesService } from "./server-build-CRVtuzGx.js";
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
function Machine() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      machineName: "",
      environment: "",
      hostName: "",
      ip: ""
    }
  });
  useEffect(() => {
    if (isEditMode && id) {
      loadDeviceById(Number(id));
    }
  }, [id, isEditMode]);
  const loadDeviceById = async (deviceId) => {
    try {
      const device = await devicesService.getByIdDevices(deviceId);
      setValue("machineName", device.machineName);
      setValue("environment", device.environment || "");
      setValue("hostName", device.hostName || "");
      setValue("ip", device.ip || "");
    } catch (error) {
      console.error("Erro ao carregar máquina:", error);
    }
  };
  const onSubmit = async (data) => {
    try {
      if (isEditMode && id) {
        const updateInput = {
          machineName: data.machineName,
          environment: data.environment,
          hostName: data.hostName,
          ip: data.ip
        };
        await devicesService.updateDevice(Number(id), updateInput);
        showToast("Sucess", "Machine edited successfully", "success");
        navigate("/machines");
      } else {
        const inputMachine = {
          machineName: data.machineName
        };
        await devicesService.createDevice(inputMachine);
        showToast("Success", "Machine created successfully", "success");
        navigate("/machines");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao salvar máquina";
      showToast("Error", message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/machines"),
          className: "text-primary hover:text-primary/80 mb-4",
          children: [
            "← ",
            t("pages.machines.back")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: isEditMode ? t("pages.machines.titleEdit") : t("pages.machines.titleCreate") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.machines.machineName"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("machineName", {
                required: t("pages.machines.machineNameRequired"),
                minLength: { value: 5, message: t("pages.machines.machineNameMinLength") }
              }),
              placeholder: t("pages.machines.machineName"),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.machineName && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.machineName.message })
        ] }),
        isEditMode && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
              t("pages.machines.environment"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                ...register("environment", {
                  required: isEditMode ? t("pages.machines.environmentRequired") : false,
                  minLength: { value: 5, message: t("pages.machines.environmentMinLength") }
                }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              }
            ),
            errors.environment && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.environment.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
              t("pages.machines.hostname"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                ...register("hostName", {
                  required: isEditMode ? t("pages.machines.hostNameRequired") : false,
                  minLength: { value: 3, message: t("pages.machines.hostNameMinLength") }
                }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              }
            ),
            errors.hostName && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.hostName.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
              t("pages.machines.ip"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                ...register("ip", {
                  required: isEditMode ? t("pages.machines.ipRequired") : false,
                  pattern: {
                    value: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
                    message: t("pages.machines.invalidIp")
                  }
                }),
                placeholder: "192.168.1.1",
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              }
            ),
            errors.ip && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.ip.message })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/machines"),
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
  Machine as default
};
