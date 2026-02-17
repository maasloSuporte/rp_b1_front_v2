import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { u as useNotificationStore, f as frequencyService, p as projectsService, d as devicesService, b as priorityService, s as scheduleService } from "./server-build-CRVtuzGx.js";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { F as FormInput, a as FormSelect, b as FormTextarea, c as FormButton } from "./FormButton-huQ_rEf8.js";
import "stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "i18next";
import "zustand";
import "@headlessui/react";
import "lucide-react";
import "axios";
import "@heroicons/react/20/solid";
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FREQUENCY_KEYS = {
  "Every Minute": "everyMinute",
  "Hourly": "hourly",
  "Daily": "daily",
  "Weekly": "weekly",
  "Monthly by Day": "monthlyByDay",
  "Monthly by Week": "monthlyByWeek",
  "Custom Cron": "customCron"
};
const FREQUENCY_ID_TO_KEY = {
  1: "everyMinute",
  2: "hourly",
  3: "daily",
  4: "weekly",
  5: "monthlyByDay",
  6: "monthlyByWeek",
  7: "customCron"
};
const PRIORITY_KEYS = {
  "Low": "low",
  "Medium": "medium",
  "High": "high",
  "Critical": "critical"
};
const PRIORITY_ID_TO_KEY = {
  1: "low",
  2: "medium",
  3: "high",
  4: "critical"
};
const fieldInputClass = "w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200";
const fieldSelectClass = "w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200";
function Schedule() {
  const { t } = useTranslation("translation");
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
      const schedule = await scheduleService.getByIdSchedule(scheduleId);
      setValue("name", schedule.name);
      setValue("details", schedule.details);
      setValue("frequencyId", schedule.frequencyId);
      setValue("projectId", schedule.projectId);
      setValue("machineId", schedule.machineId);
      setValue("priority", schedule.priorityId);
      const cron = schedule.schedule;
      if (cron) {
        setValue("cronSchedulling.timeZone", cron.timeZone ?? "E. South America Standard Time");
        setValue("cronSchedulling.minute.every", cron.every ?? "");
        setValue("cronSchedulling.hourly.every", cron.every ?? "");
        setValue("cronSchedulling.hourly.minute", cron.minute ?? "");
        setValue("cronSchedulling.daily.every", cron.every ?? "");
        setValue("cronSchedulling.daily.hour", cron.hour ?? "");
        setValue("cronSchedulling.daily.minute", cron.minute ?? "");
        setValue("cronSchedulling.weekly.every", cron.every ?? "");
        setValue("cronSchedulling.weekly.dayOfWeek", Array.isArray(cron.dayOfWeek) ? cron.dayOfWeek : []);
        setValue("cronSchedulling.monthlyDay.every", cron.every ?? "");
        setValue("cronSchedulling.monthlyDay.dayOfMonth", "");
        setValue("cronSchedulling.monthlyDay.hour", cron.hour ?? "");
        setValue("cronSchedulling.monthlyDay.minute", cron.minute ?? "");
        setValue("cronSchedulling.monthlyWeek.every", cron.every ?? "");
        setValue("cronSchedulling.monthlyWeek.weekOfMonth", cron.weekOfMonth ?? "");
        setValue("cronSchedulling.monthlyWeek.dayOfWeek", Array.isArray(cron.dayOfWeek) ? cron.dayOfWeek[0] ?? "" : "");
        setValue("cronSchedulling.monthlyWeek.hour", cron.hour ?? "");
        setValue("cronSchedulling.monthlyWeek.minute", cron.minute ?? "");
      }
    } catch (error) {
      console.error("Erro ao carregar schedule:", error);
      showToast("Error", "Falha ao carregar dados do schedule", "error");
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
      const frequencyIdNum = Number(data.frequencyId);
      if (frequencyIdNum === 2) {
        const everyValue = data.cronSchedulling.hourly.every;
        const minuteValue = data.cronSchedulling.hourly.minute;
        if (!everyValue || everyValue === "" || Number(everyValue) <= 0) {
          showToast("Error", 'Para frequência Hourly, o campo "Repeat every" é obrigatório e deve ser maior que 0', "error");
          return;
        }
        if (minuteValue === null || minuteValue === void 0 || minuteValue === "" || Number(minuteValue) < 0 || Number(minuteValue) > 59) {
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
          name: data.name.trim(),
          priority: data.priority,
          details: data.details.trim(),
          projectId: data.projectId,
          machineId: data.machineId
        };
        await scheduleService.updateSchedule(Number(id), updateInput);
        showToast(t("common.states.success"), t("pages.schedule.updatedSuccess"), "success");
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
                      onChange: (e) => field.onChange(e.target.value),
                      onBlur: field.onBlur,
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
                      onChange: (e) => field.onChange(e.target.value),
                      onBlur: field.onBlur,
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
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/scheduled"),
          className: "text-primary hover:text-primary/80 mb-4 font-medium text-base",
          children: [
            "← ",
            t("common.buttons.back")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: isEditMode ? t("pages.schedule.editSchedule") : t("pages.schedule.createSchedule") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-6 rounded-2xl bg-purple border border-purple shadow-card p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 text-white mb-5", children: /* @__PURE__ */ jsx(CalendarDaysIcon, { className: "w-9 h-9", "aria-hidden": true }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-white mb-3", children: isEditMode ? t("pages.schedule.editSchedule") : t("pages.schedule.newSchedule") }),
        /* @__PURE__ */ jsx("div", { className: "text-xl text-white/90 leading-relaxed space-y-4", children: isEditMode ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { children: "Atualize as informações do agendamento conforme necessário." }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: "Etapas:" }),
          /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 pl-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Altere o nome e o projeto, se precisar." }),
            /* @__PURE__ */ jsx("li", { children: "Ajuste prioridade e máquina de execução." }),
            /* @__PURE__ */ jsx("li", { children: "Atualize a frequência e os parâmetros de cron." }),
            /* @__PURE__ */ jsx("li", { children: "Revise os detalhes e salve." })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { children: "Crie um agendamento para executar um projeto automaticamente em uma máquina." }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: "Etapas:" }),
          /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 pl-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Informe o nome e escolha o projeto." }),
            /* @__PURE__ */ jsx("li", { children: "Defina a prioridade e a máquina de execução." }),
            /* @__PURE__ */ jsx("li", { children: "Escolha a frequência (minuto, hora, dia, semana ou mês)." }),
            /* @__PURE__ */ jsx("li", { children: "Preencha os parâmetros de cron para quando a tarefa deve rodar." }),
            /* @__PURE__ */ jsx("li", { children: "Adicione os detalhes e crie o agendamento." })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "min-w-0 lg:col-span-2 bg-white rounded-2xl shadow-card border border-border p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
            FormInput,
            {
              label: t("pages.schedule.name"),
              required: true,
              placeholder: "DOWLOANDS_NFE",
              error: errors.name?.message,
              ...register("name", {
                required: t("pages.schedule.nameRequired"),
                minLength: { value: 5, message: t("pages.schedule.nameMinLength") }
              })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Controller,
            {
              name: "projectId",
              control,
              rules: { required: t("pages.schedule.projectRequired"), min: { value: 1, message: t("pages.schedule.projectRequired") } },
              render: ({ field }) => /* @__PURE__ */ jsxs(
                FormSelect,
                {
                  label: t("pages.schedule.project"),
                  required: true,
                  error: errors.projectId?.message,
                  name: field.name,
                  value: field.value,
                  onChange: (e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  },
                  onBlur: field.onBlur,
                  ref: field.ref,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.schedule.selectOption") }),
                    projects.map((project) => /* @__PURE__ */ jsx("option", { value: project.id, children: project.name }, project.id))
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Controller,
            {
              name: "priority",
              control,
              rules: { required: t("pages.schedule.priorityRequired"), min: { value: 1, message: t("pages.schedule.priorityRequired") } },
              render: ({ field }) => /* @__PURE__ */ jsxs(
                FormSelect,
                {
                  label: t("pages.schedule.priority"),
                  required: true,
                  error: errors.priority?.message,
                  name: field.name,
                  value: field.value,
                  onChange: (e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  },
                  onBlur: field.onBlur,
                  ref: field.ref,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.schedule.selectOption") }),
                    priorities.map((priority) => {
                      const key = PRIORITY_ID_TO_KEY[priority.id] ?? PRIORITY_KEYS[priority.name];
                      const label = key ? t(`pages.schedule.priorities.${key}`) : priority.name;
                      return /* @__PURE__ */ jsx("option", { value: priority.id, children: label }, priority.id);
                    })
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Controller,
            {
              name: "frequencyId",
              control,
              rules: { required: t("pages.schedule.frequencyRequired"), min: { value: 1, message: t("pages.schedule.frequencyRequired") } },
              render: ({ field }) => /* @__PURE__ */ jsxs(
                FormSelect,
                {
                  label: t("pages.schedule.frequency"),
                  required: true,
                  error: errors.frequencyId?.message,
                  name: field.name,
                  value: field.value,
                  onChange: (e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) {
                        field.onChange(v);
                        setValue("frequencyId", v, { shouldValidate: true });
                      }
                    }
                  },
                  onBlur: field.onBlur,
                  ref: field.ref,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.schedule.selectOption") }),
                    frequencies.map((frequency) => {
                      const key = FREQUENCY_ID_TO_KEY[frequency.id] ?? FREQUENCY_KEYS[frequency.name];
                      const label = key ? t(`pages.schedule.frequencies.${key}`) : frequency.name;
                      return /* @__PURE__ */ jsx("option", { value: frequency.id, children: label }, frequency.id);
                    })
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Controller,
            {
              name: "machineId",
              control,
              rules: { required: t("pages.schedule.machineRequired"), min: { value: 1, message: t("pages.schedule.machineRequired") } },
              render: ({ field }) => /* @__PURE__ */ jsxs(
                FormSelect,
                {
                  label: t("pages.schedule.machine"),
                  required: true,
                  error: errors.machineId?.message,
                  name: field.name,
                  value: field.value,
                  onChange: (e) => {
                    if (e != null && e.target != null) {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) field.onChange(v);
                    }
                  },
                  onBlur: field.onBlur,
                  ref: field.ref,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.schedule.selectOption") }),
                    machines.map((machine) => /* @__PURE__ */ jsx("option", { value: machine.id, children: machine.machineName }, machine.id))
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
            FormTextarea,
            {
              label: t("pages.schedule.details"),
              required: true,
              rows: 4,
              placeholder: t("pages.schedule.detailsPlaceholder"),
              error: errors.details?.message,
              ...register("details", {
                required: t("pages.schedule.detailsRequired"),
                minLength: { value: 5, message: t("pages.schedule.detailsMinLength") }
              })
            }
          ) }),
          Number(frequencyId) > 0 && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 border-t border-border-form pt-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-text-primary mb-4", children: t("pages.schedule.cronScheduling") }),
            renderCronFields()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx(FormButton, { variant: "secondary", type: "button", onClick: () => navigate("/scheduled"), children: t("common.buttons.cancel") }),
          /* @__PURE__ */ jsx(FormButton, { type: "submit", children: isEditMode ? t("pages.schedule.edit") : t("pages.schedule.create") })
        ] })
      ] })
    ] })
  ] });
}
export {
  Schedule as default
};
