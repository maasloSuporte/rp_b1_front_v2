import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { a as api, u as useNotificationStore, b as packagesService, c as packagesVersionsService } from "./server-build-BQl7k4Fv.js";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "zustand";
import "@headlessui/react";
import "lucide-react";
import "axios";
const technologyService = {
  getTechnology: async () => {
    const response = await api.get("/technologies/all");
    return response.data;
  }
};
function PackagesUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useNotificationStore((state2) => state2.showToast);
  const [packageList, setPackageList] = useState([]);
  const [technologies, setTechnologies] = useState([]);
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
  const fileRegister = register("file", { required: "File is required" });
  useEffect(() => {
    loadTechnology();
    if (!isNewUpload) {
      loadPackages();
    }
  }, [isNewUpload]);
  useEffect(() => {
    if (selectedPackageId > 0 && !isNewUpload) {
      loadPackageById(selectedPackageId);
    }
  }, [selectedPackageId, isNewUpload]);
  const loadTechnology = async () => {
    try {
      const result = await technologyService.getTechnology();
      setTechnologies(result);
    } catch (error) {
      console.error("Erro ao carregar tecnologias:", error);
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
    try {
      if (isNewUpload) {
        const inputPackage = {
          name: data.name,
          description: data.description,
          technologyId: data.technologyId
        };
        const createdPackage = await packagesService.createPackege(inputPackage);
        if (data.file && data.file.length > 0) {
          const inputPackageVersion = {
            version: data.version,
            file: data.file[0],
            packageId: createdPackage.id,
            description: data.description
          };
          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          showToast("Sucess", "Package create successfully", "success");
          navigate("/packages");
        }
      } else {
        if (data.file && data.file.length > 0 && idSelectedPackage) {
          const inputPackageVersion = {
            version: data.version,
            file: data.file[0],
            packageId: idSelectedPackage,
            description: data.description
          };
          await packagesVersionsService.createPackageVersion(inputPackageVersion);
          showToast("Sucess", "Package version update successfully", "success");
          navigate("/packages");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao fazer upload do package";
      showToast("Error", message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/packages"),
          className: "text-primary hover:text-primary/80 mb-4",
          children: "← Voltar"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: "Upload Packages" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
        isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            "Package Name ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("name", {
                required: isNewUpload ? "Package name is required" : false,
                minLength: { value: 5, message: "Package name must be at least 5 characters" }
              }),
              placeholder: "DOWLOANDS_NFE",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
        ] }),
        !isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            "Package ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("packageId", {
                required: !isNewUpload ? "Package is required" : false,
                min: { value: 1, message: "Package is required" }
              }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the package..." }),
                packageList.map((pkg) => /* @__PURE__ */ jsx("option", { value: pkg.id, children: pkg.name }, pkg.id))
              ]
            }
          ),
          errors.packageId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.packageId.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            "Description ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ...register("description", {
                required: "Description is required",
                minLength: { value: 5, message: "Description must be at least 5 characters" }
              }),
              rows: 4,
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.description.message })
        ] }),
        isNewUpload && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            "Technology ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("technologyId", {
                required: isNewUpload ? "Technology is required" : false,
                min: { value: 1, message: "Technology is required" }
              }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the technology..." }),
                technologies.map((tech) => /* @__PURE__ */ jsx("option", { value: tech.id, children: tech.name }, tech.id))
              ]
            }
          ),
          errors.technologyId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.technologyId.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
            "Version ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              ...register("version", {
                required: "Version is required",
                pattern: {
                  value: /^\d+\.\d+\.\d+$/,
                  message: "Version must be in format X.Y.Z (e.g., 1.0.0)"
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
            "File ",
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
                    children: "Click to upload or drag and drop"
                  }
                ),
                selectedFileName && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-600", children: [
                  "Selected: ",
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
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90",
            children: isNewUpload ? "Create" : "Upgrade"
          }
        )
      ] })
    ] })
  ] });
}
export {
  PackagesUpload as default
};
