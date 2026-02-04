import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { a as api, u as useNotificationStore, p as projectsService, d as devicesService, s as scheduleService } from "./server-build-BQl7k4Fv.js";
import { p as priorityService } from "./priority.service-U_PEGVZC.js";
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
const frequencyService = {
  getFrequency: async () => {
    const response = await api.get("/frequencies");
    return response.data;
  }
};
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fieldInputClass = "w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200";
const fieldSelectClass = "w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200";
function Schedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const showToast = useNotificationStore((state) => state.showToast);
  const [frequencies, setFrequencies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [machines, setMachines] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm({
    mode: "onChange",
    defaultValues: {
      frequencyId: 0,
      name: "",
      projectId: 0,
      machineId: 0,
      priority: 0,
      details: "",
      cronSchedulling: {
        timeZone: "E. South America Standard Time",
        minute: { every: "" },
        hourly: { every: "", minute: "" },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: "", hour: "", minute: "" }
      }
    }
  });
  const frequencyId = watch("frequencyId");
  const hourlyEvery = watch("cronSchedulling.hourly.every");
  const hourlyMinute = watch("cronSchedulling.hourly.minute");
  useEffect(() => {
    if (frequencyId === 2) {
      console.log("Watch - hourlyEvery:", hourlyEvery, "hourlyMinute:", hourlyMinute);
    }
  }, [frequencyId, hourlyEvery, hourlyMinute]);
  useEffect(() => {
    loadFrequencies();
    loadProjects();
    loadDevices();
    loadPriorities();
    if (isEditMode && id) {
      loadScheduleById(Number(id));
    }
  }, [id, isEditMode]);
  const loadFrequencies = async () => {
    try {
      const result = await frequencyService.getFrequency();
      setFrequencies(result);
    } catch (error) {
      console.error("Erro ao carregar frequências:", error);
    }
  };
  const loadProjects = async () => {
    try {
      const result = await projectsService.getProjects();
      setProjects(result);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };
  const loadDevices = async () => {
    try {
      const result = await devicesService.getDevices();
      setMachines(result);
    } catch (error) {
      console.error("Erro ao carregar máquinas:", error);
    }
  };
  const loadPriorities = async () => {
    try {
      const result = await priorityService.getPriority();
      setPriorities(result);
    } catch (error) {
      console.error("Erro ao carregar prioridades:", error);
    }
  };
  const loadScheduleById = async (scheduleId) => {
    try {
      await scheduleService.getByIdSchedule(scheduleId);
    } catch (error) {
      console.error("Erro ao carregar schedule:", error);
    }
  };
  const buildCronSchedulling = (frequencyId2, cron) => {
    const baseCron = {
      timeZone: cron.timeZone,
      minute: { every: "" },
      hourly: { every: "", minute: "" },
      daily: { every: "", hour: "", minute: "" },
      weekly: { every: "", dayOfWeek: [] },
      monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
      monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" },
      cron: ""
    };
    const cronSchedulling = {
      [1]: {
        ...baseCron,
        minute: { every: String(cron.minute.every || "") },
        hourly: { every: "", minute: "" },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" }
      },
      [2]: {
        ...baseCron,
        minute: { every: "" },
        hourly: {
          every: String(cron.hourly.every || ""),
          minute: String(cron.hourly.minute || "")
        },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" }
      },
      [3]: {
        ...baseCron,
        minute: { every: "" },
        hourly: { every: "", minute: "" },
        daily: {
          every: String(cron.daily.every),
          hour: String(cron.daily.hour),
          minute: String(cron.daily.minute)
        },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" }
      },
      [4]: {
        ...baseCron,
        minute: { every: "" },
        hourly: { every: "", minute: "" },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: String(cron.weekly.every), dayOfWeek: cron.weekly.dayOfWeek || [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" }
      },
      [5]: {
        ...baseCron,
        minute: { every: "" },
        hourly: { every: "", minute: "" },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: {
          every: String(cron.monthlyDay.every),
          dayOfMonth: String(cron.monthlyDay.dayOfMonth),
          hour: String(cron.monthlyDay.hour),
          minute: String(cron.monthlyDay.minute)
        },
        monthlyWeek: { every: "", weekOfMonth: "", dayOfWeek: [], hour: "", minute: "" }
      },
      [6]: {
        ...baseCron,
        minute: { every: "" },
        hourly: { every: "", minute: "" },
        daily: { every: "", hour: "", minute: "" },
        weekly: { every: "", dayOfWeek: [] },
        monthlyDay: { every: "", dayOfMonth: "", hour: "", minute: "" },
        monthlyWeek: {
          every: String(cron.monthlyWeek.every),
          weekOfMonth: String(cron.monthlyWeek.weekOfMonth),
          dayOfWeek: [cron.monthlyWeek.dayOfWeek],
          hour: String(cron.monthlyWeek.hour),
          minute: String(cron.monthlyWeek.minute)
        }
      }
    };
    return cronSchedulling[frequencyId2] || baseCron;
  };
  const onSubmit = async (data) => {
    try {
      console.log("=== DADOS DO FORMULÁRIO ===");
      console.log("FrequencyId:", data.frequencyId);
      console.log("CronSchedulling completo:", JSON.stringify(data.cronSchedulling, null, 2));
      console.log("Hourly values:", {
        every: data.cronSchedulling.hourly.every,
        minute: data.cronSchedulling.hourly.minute,
        everyType: typeof data.cronSchedulling.hourly.every,
        minuteType: typeof data.cronSchedulling.hourly.minute
      });
      console.log("=== DADOS DO FORMULÁRIO ===");
      console.log("FrequencyId:", data.frequencyId);
      console.log("CronSchedulling completo:", JSON.stringify(data.cronSchedulling, null, 2));
      console.log("Hourly values:", {
        every: data.cronSchedulling.hourly.every,
        minute: data.cronSchedulling.hourly.minute,
        everyType: typeof data.cronSchedulling.hourly.every,
        minuteType: typeof data.cronSchedulling.hourly.minute
      });
      const frequencyIdNum = Number(data.frequencyId);
      if (frequencyIdNum === 2) {
        const everyValue = data.cronSchedulling.hourly.every;
        const minuteValue = data.cronSchedulling.hourly.minute;
        if (!everyValue || everyValue === "" || Number(everyValue) <= 0) {
          console.error("Erro: every inválido ou vazio");
          showToast("Error", 'Para frequência Hourly, o campo "Repeat every" é obrigatório e deve ser maior que 0', "error");
          return;
        }
        if (minuteValue === null || minuteValue === void 0 || minuteValue === "" || Number(minuteValue) < 0 || Number(minuteValue) > 59) {
          console.error("Erro: minute inválido ou vazio");
          showToast("Error", 'Para frequência Hourly, o campo "Minute" é obrigatório e deve ser entre 0 e 59', "error");
          return;
        }
      } else if (frequencyIdNum === 1) {
        if (!data.cronSchedulling.minute.every) {
          showToast("Error", 'Para frequência Minute, o campo "Every" é obrigatório', "error");
          return;
        }
      } else if (frequencyIdNum === 3) {
        if (!data.cronSchedulling.daily.every || !data.cronSchedulling.daily.hour || !data.cronSchedulling.daily.minute) {
          showToast("Error", 'Para frequência Daily, os campos "Repeat every", "Hour" e "Minute" são obrigatórios', "error");
          return;
        }
      } else if (frequencyIdNum === 4) {
        if (!data.cronSchedulling.weekly.every || !data.cronSchedulling.weekly.dayOfWeek || data.cronSchedulling.weekly.dayOfWeek.length === 0) {
          showToast("Error", 'Para frequência Weekly, os campos "Repeat every" e "Day of Week" são obrigatórios', "error");
          return;
        }
      } else if (frequencyIdNum === 5) {
        if (!data.cronSchedulling.monthlyDay.every || !data.cronSchedulling.monthlyDay.dayOfMonth || !data.cronSchedulling.monthlyDay.hour || !data.cronSchedulling.monthlyDay.minute) {
          showToast("Error", "Para frequência Monthly Day, todos os campos são obrigatórios", "error");
          return;
        }
      } else if (frequencyIdNum === 6) {
        if (!data.cronSchedulling.monthlyWeek.every || !data.cronSchedulling.monthlyWeek.weekOfMonth || !data.cronSchedulling.monthlyWeek.dayOfWeek || !data.cronSchedulling.monthlyWeek.hour || !data.cronSchedulling.monthlyWeek.minute) {
          showToast("Error", "Para frequência Monthly Week, todos os campos são obrigatórios", "error");
          return;
        }
      }
      if (isEditMode && id) {
        const updateInput = {
          frequencyId: data.frequencyId,
          name: data.name,
          priority: data.priority,
          details: data.details
        };
        await scheduleService.updateSchedule(Number(id), updateInput);
        showToast("Success", "Schedule updated successfully", "success");
        navigate("/scheduled");
      } else {
        const createInput = {
          frequencyId: Number(data.frequencyId),
          name: data.name,
          projectId: Number(data.projectId),
          machineId: Number(data.machineId),
          priority: Number(data.priority),
          details: data.details,
          arguments: [
            {
              name: "default",
              key: "default",
              value: "default",
              order: 1
            }
          ],
          cronSchedulling: buildCronSchedulling(Number(data.frequencyId), data.cronSchedulling)
        };
        await scheduleService.createSchedule(createInput);
        showToast("Success", "Schedule created successfully", "success");
        navigate("/scheduled");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao salvar schedule";
      showToast("Error", message, "error");
    }
  };
  const renderCronFields = () => {
    const freqId = Number(frequencyId);
    console.log("renderCronFields - frequencyId:", frequencyId, "tipo:", typeof frequencyId, "convertido:", freqId);
    switch (freqId) {
      case 1:
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Every (minutes)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              ...register("cronSchedulling.minute.every"),
              className: fieldInputClass
            }
          )
        ] });
      case 2:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Repeat every *" }),
            /* @__PURE__ */ jsx(
              Controller,
              {
                name: "cronSchedulling.hourly.every",
                control,
                rules: {
                  required: "Repeat every é obrigatório",
                  validate: (value) => {
                    if (!value || value === "") {
                      return "Repeat every é obrigatório";
                    }
                    const num = Number(value);
                    if (isNaN(num) || num <= 0) {
                      return "Deve ser maior que 0";
                    }
                    return true;
                  }
                },
                render: ({ field, fieldState }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      step: "1",
                      value: field.value || "",
                      onChange: (e) => {
                        const value = e.target.value;
                        console.log("Every onChange - valor recebido:", value, "tipo:", typeof value);
                        console.log("Every onChange - field.value antes:", field.value);
                        field.onChange(value);
                        console.log("Every onChange - field.onChange chamado com:", value);
                      },
                      onBlur: (e) => {
                        field.onBlur();
                        console.log("Every onBlur - valor final:", e.target.value);
                      },
                      name: field.name,
                      ref: field.ref,
                      className: fieldInputClass
                    }
                  ),
                  fieldState.error && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: fieldState.error.message })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Minute *" }),
            /* @__PURE__ */ jsx(
              Controller,
              {
                name: "cronSchedulling.hourly.minute",
                control,
                rules: {
                  required: "Minute é obrigatório",
                  validate: (value) => {
                    if (value === null || value === void 0 || value === "") {
                      return "Minute é obrigatório";
                    }
                    const num = Number(value);
                    if (isNaN(num) || num < 0 || num > 59) {
                      return "Deve ser entre 0 e 59";
                    }
                    return true;
                  }
                },
                render: ({ field, fieldState }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      max: "59",
                      step: "1",
                      value: field.value || "",
                      onChange: (e) => {
                        const value = e.target.value;
                        console.log("Minute onChange - valor recebido:", value, "tipo:", typeof value);
                        console.log("Minute onChange - field.value antes:", field.value);
                        field.onChange(value);
                        console.log("Minute onChange - field.onChange chamado com:", value);
                      },
                      onBlur: (e) => {
                        field.onBlur();
                        console.log("Minute onBlur - valor final:", e.target.value);
                      },
                      name: field.name,
                      ref: field.ref,
                      className: fieldInputClass
                    }
                  ),
                  fieldState.error && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: fieldState.error.message })
                ] })
              }
            )
          ] })
        ] });
      case 3:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Repeat every *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                ...register("cronSchedulling.daily.every"),
                className: fieldInputClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Hour" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.daily.hour"),
                  className: fieldInputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Minute" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.daily.minute"),
                  className: fieldInputClass
                }
              )
            ] })
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Repeat every *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                ...register("cronSchedulling.weekly.every"),
                className: fieldInputClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Day of Week" }),
            /* @__PURE__ */ jsx(
              Controller,
              {
                name: "cronSchedulling.weekly.dayOfWeek",
                control,
                render: ({ field }) => /* @__PURE__ */ jsx("select", { multiple: true, ...field, className: fieldSelectClass, children: DAYS_OF_WEEK.map((day) => /* @__PURE__ */ jsx("option", { value: day, children: day }, day)) })
              }
            )
          ] })
        ] });
      case 5:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Repeat every *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                ...register("cronSchedulling.monthlyDay.every"),
                className: fieldInputClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Day of Month" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyDay.dayOfMonth"),
                  className: fieldInputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Hour" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyDay.hour"),
                  className: fieldInputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Minute" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyDay.minute"),
                  className: fieldInputClass
                }
              )
            ] })
          ] })
        ] });
      case 6:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Repeat every *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                ...register("cronSchedulling.monthlyWeek.every"),
                className: fieldInputClass
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Week of Month" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyWeek.weekOfMonth"),
                  className: fieldInputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Day of Week" }),
              /* @__PURE__ */ jsx("select", { ...register("cronSchedulling.monthlyWeek.dayOfWeek"), className: fieldSelectClass, children: DAYS_OF_WEEK.map((day) => /* @__PURE__ */ jsx("option", { value: day, children: day }, day)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Hour" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyWeek.hour"),
                  className: fieldInputClass
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: "Minute" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  ...register("cronSchedulling.monthlyWeek.minute"),
                  className: fieldInputClass
                }
              )
            ] })
          ] })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/scheduled"),
          className: "text-primary hover:text-primary/80 mb-4 font-medium text-base",
          children: "← Voltar"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: isEditMode ? "Edit Schedule" : "Create Schedule" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-2xl shadow-card p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Project",
            required: true,
            error: errors.projectId?.message,
            ...register("projectId", {
              required: "Project is required",
              min: { value: 1, message: "Project is required" }
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the project" }),
              projects.map((project) => /* @__PURE__ */ jsx("option", { value: project.id, children: project.name }, project.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Priority",
            required: true,
            error: errors.priority?.message,
            ...register("priority", {
              required: "Priority is required",
              min: { value: 1, message: "Priority is required" }
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the priority" }),
              priorities.map((priority) => /* @__PURE__ */ jsx("option", { value: priority.id, children: priority.name }, priority.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Frequency",
            required: true,
            error: errors.frequencyId?.message,
            ...register("frequencyId", {
              required: "Frequency is required",
              min: { value: 1, message: "Frequency is required" },
              valueAsNumber: true
            }),
            onChange: (e) => {
              const value = Number(e.target.value);
              setValue("frequencyId", value, { shouldValidate: true });
              console.log("Frequency onChange - valor selecionado:", value, "tipo:", typeof value);
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the frequency" }),
              frequencies.map((frequency) => /* @__PURE__ */ jsx("option", { value: frequency.id, children: frequency.name }, frequency.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          FormSelect,
          {
            label: "Machine",
            required: true,
            error: errors.machineId?.message,
            ...register("machineId", {
              required: "Machine is required",
              min: { value: 1, message: "Machine is required" }
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: "Filter the machine" }),
              machines.map((machine) => /* @__PURE__ */ jsx("option", { value: machine.id, children: machine.machineName }, machine.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
          FormTextarea,
          {
            label: "Details",
            required: true,
            rows: 4,
            placeholder: "Schedule details",
            error: errors.details?.message,
            ...register("details", {
              required: "Details is required",
              minLength: { value: 5, message: "Details must be at least 5 characters" }
            })
          }
        ) }),
        Number(frequencyId) > 0 && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 border-t border-border-form pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-text-primary mb-4", children: "Cron Scheduling" }),
          renderCronFields()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(FormButton, { variant: "secondary", type: "button", onClick: () => navigate("/scheduled"), children: "Cancel" }),
        /* @__PURE__ */ jsx(FormButton, { type: "submit", children: isEditMode ? "Edit" : "Create" })
      ] })
    ] })
  ] });
}
export {
  Schedule as default
};
