import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { u as useNotificationStore, c as packagesVersionsService, b as packagesService, p as projectsService } from "./server-build-BQl7k4Fv.js";
import { F as FormInput, a as FormSelect, b as FormTextarea, c as FormButton } from "./FormButton-4wYLBjaq.js";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "zustand";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "lucide-react";
import "axios";
import "@heroicons/react/20/solid";
function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [packageList, setPackageList] = useState([]);
  const [packageVersions, setPackageVersions] = useState([]);
  const [isPackageSelected, setIsPackageSelected] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: "",
      packageVersionId: 0,
      active: false,
      autoUpdate: false,
      package: 0
    }
  });
  const selectedPackage = watch("package");
  useEffect(() => {
    const initialize = async () => {
      await loadPackages();
      if (isEditMode && id) {
        await loadProjectById(Number(id));
      }
    };
    initialize();
  }, [id, isEditMode]);
  useEffect(() => {
    if (selectedPackage > 0) {
      loadPackageVersions(selectedPackage);
      setIsPackageSelected(true);
      setValue("packageVersionId", 0);
    } else {
      setPackageVersions([]);
      setIsPackageSelected(false);
      setValue("packageVersionId", 0);
    }
  }, [selectedPackage]);
  const loadPackages = async () => {
    try {
      const result = await packagesService.getPackageCompany();
      setPackageList(result);
      return result;
    } catch (error) {
      console.error("Erro ao carregar packages:", error);
    }
  };
  const loadPackageVersions = async (packageId) => {
    try {
      const result = await packagesVersionsService.getByIdPackageVersion(packageId);
      setPackageVersions(result);
      return result;
    } catch (error) {
      console.error("Erro ao carregar versões:", error);
    }
  };
  const loadProjectById = async (projectId) => {
    try {
      const project = await projectsService.getByIdProject(projectId);
      const list = await loadPackages() || [];
      const selectedPackage2 = list.find((p) => p.name === project.packageName);
      const selectedPackageId = selectedPackage2?.id ?? 0;
      setValue("name", project.name);
      setValue("description", project.description);
      setValue("status", project.status);
      setValue("active", project.active);
      setValue("autoUpdate", project.autoUpdate);
      setValue("packageVersionId", project.packageVersionId);
      setValue("package", selectedPackageId);
      if (selectedPackageId > 0) {
        await loadPackageVersions(selectedPackageId);
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
    }
  };
  const onSubmit = async (data) => {
    try {
      if (isEditMode && id) {
        const updateInput = {
          projectName: data.name,
          description: data.description,
          status: data.status,
          packageVersionId: data.packageVersionId,
          active: data.active,
          autoUpdate: data.autoUpdate
        };
        await projectsService.updateProject(Number(id), updateInput);
        showToast("Sucess", "Project edited successfully", "success");
        navigate("/automation");
      } else {
        const inputProject = {
          projectName: data.name,
          description: data.description,
          status: data.status,
          packageVersionId: data.packageVersionId,
          active: data.active,
          autoUpdate: data.autoUpdate
        };
        await projectsService.createProject(inputProject);
        showToast("Success", "Project created successfully", "success");
        navigate("/automation");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao salvar projeto";
      showToast("Error", message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/automation"),
          className: "text-primary hover:text-primary/80 mb-4",
          children: "← Voltar"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: isEditMode ? "Edit Project" : "Create Project" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-2xl shadow-card p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          FormInput,
          {
            label: "Name",
            required: true,
            placeholder: "DOWLOANDS_NFE",
            error: errors.name?.message,
            ...register("name", {
              required: "Name is required",
              minLength: { value: 5, message: "Name must be at least 5 characters" }
            })
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(FormSelect, { label: "Active", ...register("active"), children: [
            /* @__PURE__ */ jsx("option", { value: "true", children: "True" }),
            /* @__PURE__ */ jsx("option", { value: "false", children: "False" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(FormSelect, { label: "Auto Update Version", ...register("autoUpdate"), children: [
            /* @__PURE__ */ jsx("option", { value: "true", children: "True" }),
            /* @__PURE__ */ jsx("option", { value: "false", children: "False" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          FormInput,
          {
            label: "Status",
            required: true,
            placeholder: "DOWLOANDS_NFE",
            error: errors.status?.message,
            ...register("status", {
              required: "Status is required",
              minLength: { value: 5, message: "Status must be at least 5 characters" }
            })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          FormTextarea,
          {
            label: "Description",
            required: true,
            rows: 4,
            placeholder: "Projeto destinado a acessar o site da fazenda, e fazer downloads das nfes",
            error: errors.description?.message,
            ...register("description", {
              required: "Description is required",
              minLength: { value: 5, message: "Description must be at least 5 characters" }
            })
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Package Name",
            required: true,
            error: errors.package?.message,
            ...register("package", {
              required: "Package is required",
              min: { value: 1, message: "Package is required" }
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the package..." }),
              packageList.map((pkg) => /* @__PURE__ */ jsx("option", { value: pkg.id, children: pkg.name }, pkg.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Version Package",
            required: true,
            error: errors.packageVersionId?.message,
            disabled: !isPackageSelected || isEditMode,
            className: "disabled:bg-background disabled:cursor-not-allowed",
            ...register("packageVersionId", {
              required: "Version package is required",
              min: { value: 1, message: "Version package is required" }
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the version…" }),
              packageVersions.map((pkgVersion) => /* @__PURE__ */ jsx("option", { value: pkgVersion.id, children: pkgVersion.version }, pkgVersion.id))
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(FormButton, { variant: "secondary", type: "button", onClick: () => navigate("/automation"), children: "Cancel" }),
        /* @__PURE__ */ jsx(FormButton, { type: "submit", children: isEditMode ? "Edit" : "Create" })
      ] })
    ] })
  ] });
}
export {
  Project as default
};
