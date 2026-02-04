import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router";
import { p as projectsService, d as devicesService, u as useNotificationStore, j as jobService, D as DynamicTable } from "./server-build-BQl7k4Fv.js";
import { Transition, Dialog } from "@headlessui/react";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { p as priorityService } from "./priority.service-U_PEGVZC.js";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "zustand";
import "lucide-react";
import "axios";
function CreateJobModal({ isOpen, onClose }) {
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: "",
      projectId: 0,
      priorityId: 0,
      machineId: 0
    }
  });
  useEffect(() => {
    if (isOpen) {
      loadData();
      reset();
    }
  }, [isOpen, reset]);
  const loadData = async () => {
    try {
      const [projectsData, prioritiesData, machinesData] = await Promise.all([
        projectsService.getProjects(),
        priorityService.getPriority(),
        devicesService.getDevices()
      ]);
      setProjects(projectsData);
      setPriorities(prioritiesData);
      setMachines(machinesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };
  const onSubmit = async (data) => {
    if (data.projectId === 0 || data.priorityId === 0 || data.machineId === 0) {
      return;
    }
    setLoading(true);
    try {
      onClose({
        name: data.name,
        projectId: data.projectId,
        priorityId: data.priorityId,
        machineId: data.machineId
      });
    } catch (error) {
      console.error("Erro ao criar job:", error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Transition, { show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => onClose(null), children: [
    /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-25" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-4", children: [
            /* @__PURE__ */ jsx(PlayIcon, { className: "h-12 w-12 text-primary mb-3" }),
            /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-lg font-semibold leading-6 text-gray-900 mb-4", children: "Create Job" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                "Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  ...register("name", { required: "Name is required" }),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                  placeholder: "Enter job name"
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                "Project ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  ...register("projectId", {
                    required: "Project is required",
                    min: { value: 1, message: "Project is required" }
                  }),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: "Select a project..." }),
                    projects.map((project) => /* @__PURE__ */ jsx("option", { value: project.id, children: project.name }, project.id))
                  ]
                }
              ),
              errors.projectId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.projectId.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                "Priority ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  ...register("priorityId", {
                    required: "Priority is required",
                    min: { value: 1, message: "Priority is required" }
                  }),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: "Select a priority..." }),
                    priorities.map((priority) => /* @__PURE__ */ jsx("option", { value: priority.id, children: priority.name }, priority.id))
                  ]
                }
              ),
              errors.priorityId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.priorityId.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
                "Machine ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  ...register("machineId", {
                    required: "Machine is required",
                    min: { value: 1, message: "Machine is required" }
                  }),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: "Select a machine..." }),
                    machines.map((machine) => /* @__PURE__ */ jsx("option", { value: machine.id, children: machine.machineName }, machine.id))
                  ]
                }
              ),
              errors.machineId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.machineId.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                onClick: () => onClose(null),
                disabled: loading,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                disabled: loading,
                children: loading ? "Creating..." : "Create"
              }
            )
          ] })
        ] }) })
      }
    ) }) })
  ] }) });
}
function Jobs() {
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const columns = [
    {
      key: "Name",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "HostName",
      label: "HostName",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "ProjectName",
      label: "ProjectName",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "MachineUser",
      label: "Machine User",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "State",
      label: "State",
      filterable: false,
      sortable: false,
      filterType: "text"
    },
    {
      key: "Priority",
      label: "Priority",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "PackageVersion",
      label: "Robot Version",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "StartedAt",
      label: "StartedAt",
      filterable: false,
      sortable: true,
      filterType: "text"
    },
    {
      key: "EndedAt",
      label: "EndedAt",
      filterable: false,
      sortable: false,
      filterType: "text"
    },
    {
      key: "actions",
      label: "Actions",
      type: "action"
    }
  ];
  const actionMenuItems = [
    {
      label: "Preview",
      action: "preview",
      icon: "preview"
    },
    {
      label: "Execute",
      action: "execute",
      icon: "play"
    }
  ];
  useEffect(() => {
    loadJobs();
  }, [queryString]);
  const loadJobs = async () => {
    try {
      const result = await jobService.getAllJobs(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.id,
        Name: x.name,
        HostName: x.hostname,
        MachineUser: x.machineUser,
        State: x.state,
        Priority: x.priority,
        StartedAt: x.started,
        EndedAt: x.ended,
        Robot: x.robot,
        PackageVersion: x.packageVersion,
        ProjectName: x.projectName
      })));
    } catch (error) {
      console.error("Erro ao carregar jobs:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "preview":
        navigate(`/job-details/${event.item.id}`);
        break;
      case "execute":
        await handleExecuteJob(event.item.id);
        break;
    }
  };
  const handleExecuteJob = async (jobId) => {
    try {
      await jobService.executeJob(jobId);
      showToast("Success", "Job executed successfully", "success");
      loadJobs();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to execute job";
      showToast("Error", message, "error");
    }
  };
  const handleCreateJob = async (jobData) => {
    if (!jobData) {
      setIsCreateModalOpen(false);
      return;
    }
    try {
      await jobService.createJob(jobData);
      showToast("Success", "Job created successfully", "success");
      setIsCreateModalOpen(false);
      loadJobs();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create job";
      showToast("Error", message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Jobs" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsCreateModalOpen(true),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: "Create"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mt-6", children: /* @__PURE__ */ jsx(
      DynamicTable,
      {
        columns,
        data,
        totalItems,
        pageSize: 5,
        pageSizeOptions: [5, 10, 25, 100],
        showFirstLastButtons: true,
        actionMenuItems,
        onActionClick: handleActionClick,
        onQueryParamsChange: setQueryString
      }
    ) }),
    /* @__PURE__ */ jsx(CreateJobModal, { isOpen: isCreateModalOpen, onClose: handleCreateJob })
  ] });
}
export {
  Jobs as default
};
