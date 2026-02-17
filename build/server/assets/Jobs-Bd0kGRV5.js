import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, Fragment, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { p as projectsService, b as priorityService, d as devicesService, u as useNotificationStore, j as useModalStore, k as jobService, D as DynamicTable } from "./server-build-CRVtuzGx.js";
import { Transition, Dialog } from "@headlessui/react";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "i18next";
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
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("PageNumber=1&PageSize=5&SortField=id&SortOrder=asc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const columns = useMemo(
    () => [
      { key: "_select", label: "", type: "checkbox" },
      { key: "Name", label: t("pages.jobs.columnName"), filterable: true, sortable: false, filterType: "text" },
      { key: "HostName", label: t("pages.jobs.hostName"), filterable: true, sortable: false, filterType: "text" },
      { key: "ProjectName", label: t("pages.jobs.projectName"), filterable: true, sortable: false, filterType: "text" },
      { key: "MachineUser", label: t("pages.jobs.machineUser"), filterable: true, sortable: false, filterType: "text" },
      { key: "State", label: t("pages.jobs.state"), filterable: false, sortable: false, filterType: "text" },
      { key: "Priority", label: t("pages.jobs.priority"), filterable: true, sortable: false, filterType: "text" },
      { key: "PackageVersion", label: t("pages.jobs.robotVersion"), filterable: true, sortable: false, filterType: "text" },
      { key: "StartedAt", label: t("pages.jobs.startedAt"), filterable: false, sortable: true, filterType: "text" },
      { key: "EndedAt", label: t("pages.jobs.endedAt"), filterable: false, sortable: false, filterType: "text" },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("pages.jobs.preview"), action: "preview", icon: "preview" },
      { label: t("pages.jobs.execute"), action: "execute", icon: "play" },
      { label: t("common.buttons.delete"), action: "delete", icon: "trash" }
    ],
    [t]
  );
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
      case "delete":
        await handleDeleteJob(event.item);
        break;
    }
  };
  const handleDeleteJob = async (item) => {
    const confirmed = await confirmDelete({ itemName: item.Name ?? `Job #${item.id}` });
    if (!confirmed) return;
    try {
      await jobService.deleteJob(item.id);
      showToast(t("common.states.success"), t("pages.jobs.deleteSuccess"), "success");
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      loadJobs();
    } catch (error) {
      const message = error.response?.data?.message ?? t("pages.jobs.deleteError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await confirmDelete({
      itemName: `${selectedIds.length} job(s)`,
      description: t("pages.jobs.deleteSelectedConfirmDescription")
    });
    if (!confirmed) return;
    let ok = 0;
    let fail = 0;
    for (const id of selectedIds) {
      try {
        await jobService.deleteJob(id);
        ok++;
      } catch {
        fail++;
      }
    }
    setSelectedIds([]);
    loadJobs();
    if (fail === 0) {
      showToast(t("common.states.success"), t("pages.jobs.deleteMultipleSuccess", { count: ok }), "success");
    } else {
      showToast(t("common.warning"), t("pages.jobs.deleteMultiplePartial", { ok, fail }), "error");
    }
  };
  const handleSelectionChange = (id, selected) => {
    setSelectedIds(
      (prev) => selected ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };
  const handleDeleteAllJobs = async () => {
    const confirmed = await confirmDelete({
      itemName: t("pages.jobs.deleteAllConfirmItemName"),
      description: t("pages.jobs.deleteAllConfirmDescription"),
      buttonName: t("pages.jobs.deleteAllConfirmButton")
    });
    if (!confirmed) return;
    try {
      const result = await jobService.deleteAllJobs();
      setSelectedIds([]);
      loadJobs();
      showToast(t("common.states.success"), t("pages.jobs.clearAllSuccess", { count: result.deletedCount }), "success");
    } catch (error) {
      const message = error.response?.data?.message ?? t("pages.jobs.deleteError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  const handleExecuteJob = async (jobId) => {
    try {
      await jobService.executeJob(jobId);
      showToast(t("common.states.success"), t("pages.jobs.executeSuccess"), "success");
      loadJobs();
    } catch (error) {
      const message = error.response?.data?.message || t("pages.jobs.deleteError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  const handleCreateJob = async (jobData) => {
    if (!jobData) {
      setIsCreateModalOpen(false);
      return;
    }
    try {
      await jobService.createJob(jobData);
      showToast(t("common.states.success"), t("pages.jobs.createSuccess"), "success");
      setIsCreateModalOpen(false);
      loadJobs();
    } catch (error) {
      const message = error.response?.data?.message || t("pages.jobs.createError");
      showToast(t("common.states.error"), message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.jobs.title") }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleDeleteAllJobs,
            disabled: totalItems === 0,
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-red-700 hover:bg-red-800 shadow-sm hover:shadow transition-all duration-200 border border-red-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-700",
            title: totalItems === 0 ? t("pages.jobs.noJobsToDelete") : t("pages.jobs.deleteAllConfirmTitle"),
            children: t("pages.jobs.deleteAll")
          }
        ),
        selectedIds.length > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleDeleteSelected,
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm hover:shadow transition-all duration-200",
            children: t("pages.jobs.deleteSelected", { count: selectedIds.length })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsCreateModalOpen(true),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
            children: t("common.buttons.create")
          }
        )
      ] })
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
        onQueryParamsChange: setQueryString,
        selectedRowIds: selectedIds,
        onSelectionChange: handleSelectionChange
      }
    ) }),
    /* @__PURE__ */ jsx(CreateJobModal, { isOpen: isCreateModalOpen, onClose: handleCreateJob })
  ] });
}
export {
  Jobs as default
};
