import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { a as api, u as useNotificationStore, c as packagesService, e as packagesVersionsService } from "./server-build-CRVtuzGx.js";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "i18next";
import "zustand";
import "@headlessui/react";
import "lucide-react";
import "axios";
function normalizeTechnologyList(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data;
    const arr = obj.data ?? obj.value ?? obj.items;
    if (Array.isArray(arr)) return arr;
  }
  return [];
}
const technologyService = {
  getTechnology: async () => {
    const response = await api.get("/technologies/all");
    return normalizeTechnologyList(response.data);
  }
};
function PackagesUpload() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useNotificationStore((state2) => state2.showToast);
  const [packageList, setPackageList] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [technologiesLoadError, setTechnologiesLoadError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [idSelectedPackage, setIdSelectedPackage] = useState(null);
  const state = location.state;
  const isNewUpload = state?.isNew !== false;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      technologyId: 0,
      packageId: 0,
      version: "",
      file: null
    }
  });
  const selectedPackageId = watch("packageId");
  const fileRegister = register("file", { required: t("pages.packagesUpload.fileRequired") });
  useEffect(() => {
    let cancelled = false;
    setTechnologiesLoadError(null);
    const load = async () => {
      try {
        const result = await technologyService.getTechnology();
        if (!cancelled) setTechnologies(Array.isArray(result) ? result : []);
      } catch (error) {
        if (!cancelled) {
          setTechnologies([]);
          const err = error;
          const msg = err?.response?.status === 401 ? "Faça login para carregar as tecnologias." : err?.response?.data?.message ?? "Erro ao carregar tecnologias. Verifique a conexão com a API.";
          setTechnologiesLoadError(msg);
        }
        console.error("Erro ao carregar tecnologias:", error);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isNewUpload]);
  useEffect(() => {
    if (!isNewUpload) {
      loadPackages().then(() => {
        if (state?.packageId) {
          setValue("packageId", state.packageId);
          setIdSelectedPackage(state.packageId);
        }
      });
    }
  }, [isNewUpload, state?.packageId]);
  useEffect(() => {
    if (selectedPackageId > 0 && !isNewUpload) {
      loadPackageById(selectedPackageId);
    }
  }, [selectedPackageId, isNewUpload]);
  const loadTechnology = async () => {
    setTechnologiesLoadError(null);
    try {
      const result = await technologyService.getTechnology();
      setTechnologies(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Erro ao carregar tecnologias:", error);
      setTechnologies([]);
      setTechnologiesLoadError("Erro ao carregar tecnologias.");
    }
  };
  const loadPackages = async () => {
    try {
      const result = await packagesService.getPackageCompany();
      setPackageList(result);
    } catch (error) {
      console.error("Erro ao carregar packages:", error);
    }
  };
  const loadPackageById = async (packageId) => {
    try {
      const pkg = await packagesService.getByIdPackage(packageId);
      setValue("name", pkg.name);
      setValue("description", pkg.description);
      setValue("technologyId", pkg.technology);
      setIdSelectedPackage(packageId);
    } catch (error) {
      console.error("Erro ao carregar package:", error);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
      clearErrors("file");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("file", dataTransfer.files, { shouldValidate: true });
      clearErrors("file");
    }
  };
  const onSubmit = async (data) => {
    const log = "[PackagesUpload.onSubmit]";
    try {
      if (isNewUpload) {
        console.log(log, "Criando novo pacote", { name: data.name, technologyId: data.technologyId });
        const inputPackage = {
          name: data.name,
          description: data.description,
          technologyId: data.technologyId
        };
        const createdPackage = await packagesService.createPackege(inputPackage);
        console.log(log, "Pacote criado", { id: createdPackage.id });
        if (data.file && data.file.length > 0) {
          console.log(log, "Enviando versão (zip)", { packageId: createdPackage.id, version: data.version, file: data.file[0]?.name });
          const inputPackageVersion = {
            version: data.version,
            file: data.file[0],
            packageId: createdPackage.id,
            description: data.description
          };
          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          console.log(log, "Versão criada com sucesso");
          showToast("Sucess", "Package create successfully", "success");
          navigate("/packages");
        }
      } else {
        if (data.file && data.file.length > 0 && idSelectedPackage) {
          console.log(log, "Upgrade versão", { packageId: idSelectedPackage, version: data.version, file: data.file[0]?.name });
          const inputPackageVersion = {
            version: data.version,
            file: data.file[0],
            packageId: idSelectedPackage,
            description: data.description
          };
          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          console.log(log, "Versão atualizada com sucesso");
          showToast("Sucess", "Package version update successfully", "success");
          navigate("/packages");
        }
      }
    } catch (error) {
      const err = error;
      const data2 = err?.response?.data;
      const message = data2?.extensions?.errorDescription ?? data2?.detail ?? data2?.title ?? data2?.message ?? t("pages.packagesUpload.uploadError");
      console.error(log, "Erro no submit", { message, status: err?.response?.status, code: err?.code, data: data2 });
      showToast("Error", message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/packages"),
          className: "text-primary hover:text-primary/80 mb-4",
          children: [
            "← ",
            t("pages.packagesUpload.back")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: t("pages.packagesUpload.title") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.packageName"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("name", {
                required: isNewUpload ? t("pages.packagesUpload.nameRequired") : false,
                minLength: { value: 5, message: t("pages.packagesUpload.nameMinLength") }
              }),
              placeholder: "DOWLOANDS_NFE",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
        ] }),
        !isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.packageLabel"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("packageId", {
                required: !isNewUpload ? t("pages.packagesUpload.packageRequired") : false,
                min: { value: 1, message: t("pages.packagesUpload.packageRequired") }
              }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.packagesUpload.filterPackage") }),
                packageList.map((pkg) => /* @__PURE__ */ jsx("option", { value: pkg.id, children: pkg.name }, pkg.id))
              ]
            }
          ),
          errors.packageId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.packageId.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.description"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ...register("description", {
                required: t("pages.packagesUpload.descriptionRequired"),
                minLength: { value: 5, message: t("pages.packagesUpload.descriptionMinLength") }
              }),
              rows: 4,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.description.message })
        ] }),
        isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.technology"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("technologyId", {
                required: isNewUpload ? t("pages.packagesUpload.technologyRequired") : false,
                min: { value: 1, message: t("pages.packagesUpload.technologyRequired") }
              }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              disabled: technologies.length === 0 && !!technologiesLoadError,
              children: [
                /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.packagesUpload.filterTechnology") }),
                technologies.map((tech) => /* @__PURE__ */ jsx("option", { value: tech.id, children: tech.name }, tech.id))
              ]
            }
          ),
          technologiesLoadError && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-amber-600 flex items-center gap-2", children: [
            technologiesLoadError,
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: loadTechnology,
                className: "text-primary hover:underline font-medium",
                children: "Tentar novamente"
              }
            )
          ] }),
          technologies.length === 0 && !technologiesLoadError && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Carregando tecnologias..." }),
          errors.technologyId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.technologyId.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.version"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("version", {
                required: t("pages.packagesUpload.versionRequired"),
                pattern: {
                  value: /^\d+\.\d+\.\d+$/,
                  message: t("pages.packagesUpload.versionFormat")
                }
              }),
              placeholder: "1.0.0",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.version && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.version.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            t("pages.packagesUpload.file"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onDragOver: handleDragOver,
              onDrop: handleDrop,
              className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors",
              children: [
                /* @__PURE__ */ jsx(CloudArrowUpIcon, { className: "mx-auto h-12 w-12 text-gray-400 mb-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    ...fileRegister,
                    onChange: (e) => {
                      if (fileRegister.onChange) {
                        fileRegister.onChange(e);
                      }
                      handleFileChange(e);
                    },
                    className: "hidden",
                    id: "file-upload",
                    accept: ".zip,.rar,.7z"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "file-upload",
                    className: "cursor-pointer text-primary hover:text-primary/80 font-medium",
                    children: t("pages.packagesUpload.clickToUpload")
                  }
                ),
                selectedFileName && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-600", children: [
                  t("pages.packagesUpload.selectedFile"),
                  ": ",
                  selectedFileName
                ] }),
                errors.file && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.file.message })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/packages"),
            className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",
            children: t("pages.packagesUpload.cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90",
            children: isNewUpload ? t("pages.packagesUpload.create") : t("pages.packagesUpload.upgrade")
          }
        )
      ] })
    ] })
  ] });
}
export {
  PackagesUpload as default
};
