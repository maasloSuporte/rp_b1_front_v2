import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, useLocation, Link, useParams, useNavigate } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Component, Fragment, useState, useEffect, lazy, Suspense, useRef, useCallback, useMemo } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { create } from "zustand";
import { Transition, Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowDownTrayIcon, XMarkIcon, ChevronDownIcon, Bars3Icon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PlayCircle, Shield, Users as Users$1, FolderOpen, Server, Package, Briefcase, Calendar, Settings, FilePlus, LayoutDashboard, Home } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Algo deu errado" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: this.state.error?.message || "Erro desconhecido" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "px-4 py-2 bg-primary text-white rounded hover:bg-primary/90",
            children: "Recarregar página"
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
const en = {
  common: {
    buttons: {
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      search: "Search",
      back: "Back",
      signIn: "Sign In",
      yesDelete: "Yes, delete"
    },
    actions: {
      label: "Actions",
      edit: "Edit",
      delete: "Delete"
    },
    states: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      pending: "Pending",
      running: "Running",
      stopping: "Stopping",
      suspended: "Suspended",
      terminating: "Terminating",
      resumed: "Resumed"
    },
    validation: {
      required: "Required field",
      emailRequired: "Email is required",
      emailMinLength: "Email should be at least 6 characters",
      passwordRequired: "Password is required"
    },
    table: {
      filterPlaceholder: "Filter by...",
      searchIn: "Search in {{label}}...",
      all: "All",
      clearFilters: "Clear filters",
      noResults: "No results found.",
      noResultsHint: "Try adjusting filters or clearing the search to see more results.",
      selectAll: "Select all",
      sortBy: "Sort by {{label}}",
      showing: "Showing",
      of: "of",
      perPage: "Per page",
      prevPage: "Previous page",
      nextPage: "Next page",
      previous: "Previous",
      next: "Next"
    },
    status: {
      active: "Active",
      inactive: "Inactive"
    },
    selectOption: "Select option",
    filterPackage: "Filter the package...",
    filterVersion: "Filter the version...",
    filterTechnology: "Filter the technology...",
    true: "True",
    false: "False",
    warning: "Warning"
  },
  breadcrumb: {
    dashboard: "Dashboard",
    home: "Home",
    users: "Users",
    roles: "Permissions",
    assets: "Assets",
    packages: "Packages",
    jobs: "Jobs",
    scheduled: "Scheduled",
    queues: "Queues",
    machines: "Machines",
    automation: "Automation",
    project: "Project",
    execution: "Execution",
    create: "Create",
    upload: "Upload"
  },
  nav: {
    dashboards: "DASHBOARDS",
    home: "Home",
    projects: "PROJECTS",
    automation: "Automation",
    createProject: "Create Project",
    manage: "MANAGE",
    scheduled: "Scheduled",
    jobs: "Jobs",
    packages: "Packages",
    machines: "Machines",
    assets: "Assets",
    administration: "ADMINISTRATION",
    users: "Users",
    groupPermissions: "Group permissions",
    closeMenu: "Close menu",
    logout: "Logout",
    admin: "Admin"
  },
  pages: {
    login: {
      title: "Welcome to Beanstalk",
      subtitle: "Orchestrate Efficiency",
      email: "Email",
      password: "Password",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      signIn: "Sign In",
      loginSuccess: "Login successful",
      loginError: "Login failed",
      success: "Success",
      failure: "Failure"
    },
    dashboard: {
      title: "Dashboard",
      loadingData: "Loading dashboard data...",
      users: "Users",
      processes: "Processes",
      triggers: "Triggers",
      assets: "Assets",
      queues: "Queues",
      machines: "Machines",
      jobStatus: "Job Status",
      jobsHistory: "Jobs History",
      revenueUpdates: "Revenue Updates",
      successful: "Successful",
      faulted: "Faulted",
      stopped: "Stopped",
      overviewProfit: "Overview of Profit",
      modernize: "Modernize",
      spikeAdmin: "Spike Admin",
      loadingChart: "Loading chart..."
    },
    assets: {
      title: "Assets",
      createAsset: "Create Asset",
      name: "Name",
      type: "Type",
      description: "Description",
      actions: "Actions",
      edit: "Edit",
      deleted: "Delete",
      deleteSuccess: "Asset deleted successfully",
      deleteError: "Failed to delete asset"
    },
    scheduled: {
      title: "Scheduled Activities",
      subtitle: "Create and manage scheduled activities from this page",
      createSchedule: "Create Schedule",
      activityName: "Activity name",
      frequency: "Frequency",
      nextExecution: "Next execution",
      priority: "Priority",
      details: "Details",
      activitiesCount: "Activities",
      deleteSuccess: "Schedule deleted successfully",
      deleteError: "Failed to delete schedule"
    },
    jobs: {
      title: "Jobs",
      columnName: "Name",
      hostName: "HostName",
      projectName: "ProjectName",
      machineUser: "Machine User",
      state: "State",
      priority: "Priority",
      robotVersion: "Robot Version",
      startedAt: "StartedAt",
      endedAt: "EndedAt",
      preview: "Preview",
      execute: "Execute",
      deleteSuccess: "Job deleted successfully",
      deleteError: "Failed to delete job",
      deleteMultipleSuccess: "{{count}} job(s) deleted successfully",
      deleteMultiplePartial: "{{ok}} deleted, {{fail}} failed",
      clearAllSuccess: "{{count}} job(s) deleted. You can start from scratch.",
      executeSuccess: "Job executed successfully",
      createSuccess: "Job created successfully",
      createError: "Failed to create job",
      deleteAll: "Delete all jobs",
      deleteSelected: "Delete selected ({{count}})",
      deleteAllConfirmItemName: "ALL jobs",
      deleteAllConfirmDescription: "This will delete all jobs in your organization. This cannot be undone. Continue?",
      deleteAllConfirmButton: "Yes, delete all",
      noJobsToDelete: "No jobs to delete",
      deleteAllConfirmTitle: "Delete all jobs and start from scratch",
      deleteSelectedConfirmDescription: "Do you really want to delete the selected jobs?"
    },
    packages: {
      title: "Packages",
      download: "Download",
      downloadSuccess: "Download completed successfully",
      downloadError: "Failed to download package",
      upload: "Upload",
      new: "New",
      upgrade: "Upgrade",
      deleteSuccess: "Package deleted successfully",
      deleteError: "Failed to delete package"
    },
    machines: {
      title: "Machines",
      createMachineTemplate: "Create Machine Template",
      back: "Back",
      titleEdit: "Edit Machine",
      titleCreate: "Create Machine",
      machineName: "Machine Name",
      machineNameRequired: "Machine name is required",
      machineNameMinLength: "Machine name must be at least 5 characters",
      environment: "Environment",
      environmentRequired: "Environment is required",
      environmentMinLength: "Environment must be at least 5 characters",
      hostname: "Host Name",
      hostNameRequired: "Host name is required",
      hostNameMinLength: "Host name must be at least 3 characters",
      ip: "IP",
      ipRequired: "IP is required",
      invalidIp: "Invalid IP address format",
      deleteSuccess: "Machine deleted successfully",
      deleteError: "Failed to delete machine",
      editSuccess: "Machine edited successfully",
      createSuccess: "Machine created successfully",
      saveError: "Failed to save machine"
    },
    users: {
      title: "Users",
      createUser: "Create User",
      email: "Email",
      role: "Role",
      disable: "Disable",
      enable: "Enable",
      disableSuccess: "User successfully disabled",
      disableError: "Failed to disable user",
      enableSuccess: "User successfully active",
      enableError: "Failed to enable user"
    },
    roles: {
      title: "Permissions",
      addRole: "Add role",
      deleteSuccess: "Permission group successfully deleted",
      deleteError: "Failed to delete role"
    },
    permissions: {
      title: "Permissions",
      nameRequired: "Name *",
      placeholder: "Enter group name",
      roleNameRequired: "Role name is required.",
      roleNameMinLength: "Role must be at least 5 characters long.",
      permissions: "Permissions",
      view: "View",
      edit: "Edit",
      create: "Create",
      delete: "Delete",
      requiredFieldsWarning: "Fields with * are required",
      editSuccess: "Permission group edit successfully",
      createSuccess: "Permission group created successfully",
      saveError: "Failed to save permissions"
    },
    automation: {
      title: "Automation",
      createProject: "Create Project",
      execute: "Execute",
      columnName: "Name",
      columnPackageVersion: "Package Version",
      columnStatus: "Status",
      columnCreatedAt: "Created at",
      edit: "Edit",
      delete: "Delete",
      deleteSuccess: "Project deleted successfully",
      deleteError: "Failed to delete project"
    },
    schedule: {
      editSchedule: "Edit Schedule",
      createSchedule: "Create Schedule",
      newSchedule: "New schedule",
      name: "Name",
      nameRequired: "Name is required",
      nameMinLength: "Name must be at least 5 characters",
      project: "Project",
      projectRequired: "Project is required",
      priority: "Priority",
      priorityRequired: "Priority is required",
      frequency: "Frequency",
      frequencyRequired: "Frequency is required",
      machine: "Machine",
      machineRequired: "Machine is required",
      details: "Details",
      detailsRequired: "Details is required",
      detailsMinLength: "Details must be at least 5 characters",
      detailsPlaceholder: "Schedule details",
      repeatEvery: "Repeat every",
      repeatEveryRequired: "Repeat every is required",
      minute: "Minute",
      minuteRequired: "Minute is required",
      create: "Create",
      edit: "Edit",
      updatedSuccess: "Schedule updated successfully",
      createdSuccess: "Schedule created successfully",
      saveError: "Failed to save schedule",
      loadError: "Failed to load schedule data",
      daysOfWeek: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      },
      everyMinutes: "Every (minutes)",
      hour: "Hour",
      dayOfWeek: "Day of Week",
      dayOfMonth: "Day of Month",
      weekOfMonth: "Week of Month",
      cronScheduling: "Cron Scheduling",
      selectOption: "Select option",
      stepsEdit: {
        step1: "Change the name and project if needed.",
        step2: "Adjust priority and execution machine.",
        step3: "Update frequency and cron parameters.",
        step4: "Review details and save."
      },
      stepsCreate: {
        step1: "Enter the name and choose the project.",
        step2: "Set priority and execution machine.",
        step3: "Choose frequency (minute, hour, day, week or month).",
        step4: "Fill in cron parameters for when the task should run.",
        step5: "Add details and create the schedule."
      },
      validationHourlyRepeat: 'For Hourly frequency, "Repeat every" is required and must be greater than 0',
      validationHourlyMinute: 'For Hourly frequency, "Minute" is required and must be between 0 and 59',
      validationMinuteEvery: 'For Minute frequency, "Every" is required',
      validationDaily: 'For Daily frequency, "Repeat every", "Hour" and "Minute" are required',
      validationWeekly: 'For Weekly frequency, "Repeat every" and "Day of Week" are required',
      validationMonthlyDay: "For Monthly Day frequency, all fields are required",
      validationMonthlyWeek: "For Monthly Week frequency, all fields are required",
      validationMustBeGreaterThanZero: "Must be greater than 0",
      validationBetween0And59: "Must be between 0 and 59",
      frequencies: {
        everyMinute: "Every Minute",
        hourly: "Hourly",
        daily: "Daily",
        weekly: "Weekly",
        monthlyByDay: "Monthly by Day",
        monthlyByWeek: "Monthly by Week",
        customCron: "Custom Cron"
      },
      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical"
      }
    },
    execution: {
      title: "Execution",
      backToAutomation: "Back to Automation",
      selectProject: "Select a project",
      selectMachine: "Select machine",
      selectPriority: "Select priority",
      jobName: "Job name",
      jobNamePlaceholder: "e.g. Manual run",
      selectType: "Select type",
      typeString: "String",
      typeNumber: "Number",
      typeBoolean: "Boolean",
      parameters: "Parameters",
      addParameter: "Add Parameter",
      namePlaceholder: "Name",
      valuePlaceholder: "Value",
      execute: "Execute",
      executeSuccess: "Job created and executed successfully",
      executeError: "Failed to create or execute job"
    },
    project: {
      titleEdit: "Edit Project",
      titleCreate: "Create Project",
      back: "Back",
      name: "Name",
      active: "Active",
      autoUpdateVersion: "Auto Update Version",
      status: "Status",
      description: "Description",
      packageName: "Package Name",
      versionPackage: "Version Package",
      filterPackage: "Filter the package...",
      filterVersion: "Filter the version…",
      editSuccess: "Project edited successfully",
      createSuccess: "Project created successfully",
      nameRequired: "Name is required",
      nameMinLength: "Name must be at least 5 characters",
      descriptionRequired: "Description is required",
      descriptionMinLength: "Description must be at least 5 characters",
      statusRequired: "Status is required",
      statusMinLength: "Status must be at least 5 characters",
      packageRequired: "Package is required",
      versionRequired: "Version package is required",
      saveError: "Failed to save project"
    },
    packagesUpload: {
      title: "Upload Packages",
      createSuccess: "Package create successfully",
      versionUpdateSuccess: "Package version update successfully",
      selectedFile: "Selected",
      filterPackage: "Filter the package...",
      filterTechnology: "Filter the technology...",
      back: "Back",
      packageName: "Package Name",
      packageLabel: "Package",
      description: "Description",
      technology: "Technology",
      version: "Version",
      file: "File",
      clickToUpload: "Click to upload or drag and drop",
      cancel: "Cancel",
      create: "Create",
      upgrade: "Upgrade",
      nameRequired: "Package name is required",
      nameMinLength: "Package name must be at least 5 characters",
      descriptionRequired: "Description is required",
      descriptionMinLength: "Description must be at least 5 characters",
      packageRequired: "Package is required",
      technologyRequired: "Technology is required",
      versionRequired: "Version is required",
      versionFormat: "Version must be in format X.Y.Z (e.g., 1.0.0)",
      fileRequired: "File is required",
      uploadError: "Failed to upload package"
    },
    jobDetails: {
      loading: "Loading job details...",
      backToJobs: "Back to Jobs",
      title: "Job Details",
      name: "Name",
      hostname: "Hostname",
      projectName: "Project Name",
      state: "State",
      priority: "Priority",
      packageVersion: "Package Version",
      robot: "Robot",
      startedAt: "Started At",
      endedAt: "Ended At",
      inputValues: "Input Values",
      nameCol: "Name",
      typeCol: "Type",
      valueCol: "Value"
    },
    asset: {
      back: "Back",
      titleEdit: "Edit Asset",
      titleCreate: "Create Asset",
      name: "Name",
      type: "Type",
      description: "Description",
      value: "Value",
      userName: "User Name",
      nameRequired: "Name is required",
      nameMinLength: "Name must be at least 5 characters",
      typeRequired: "Type is required",
      descriptionRequired: "Description is required",
      descriptionMinLength: "Description must be at least 5 characters",
      valueRequired: "Value is required",
      userNameRequired: "User Name is required",
      editSuccess: "Asset edited successfully",
      createSuccess: "Asset created successfully",
      typeText: "Text",
      typeInteger: "Integer",
      typeBool: "Bool",
      typeCredential: "Credential",
      saveError: "Failed to save asset"
    },
    user: {
      back: "Back",
      titleEdit: "Edit User",
      titleCreate: "Create User",
      name: "Name",
      cpf: "CPF",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match",
      roles: "Roles",
      availableRoles: "Available Roles",
      selectedRoles: "Selected Roles",
      nameRequired: "Name is required",
      cpfRequired: "CPF is required",
      emailRequired: "Email is required",
      phoneRequired: "Phone is required",
      passwordRequired: "Password is required",
      confirmPasswordRequired: "Confirm password is required",
      selectOneRole: "Select at least one role",
      updateSuccess: "User updated successfully",
      createSuccess: "User created successfully",
      saveError: "Failed to save user"
    },
    queues: {
      title: "Queues",
      realtime: "Real time",
      historical: "Historical",
      name: "Name",
      status: "Status",
      items: "Items",
      actions: "Actions",
      view: "View",
      viewDetails: "View Details",
      processedItems: "Processed Items",
      lastProcessed: "Last Processed",
      loadingRealtime: "Loading real time queues...",
      loadingHistorical: "Loading queues history...",
      titleRealtime: "Real Time Queues",
      titleHistorical: "Historical Queues"
    }
  },
  modals: {
    delete: {
      title: "Are you absolutely sure?",
      description: "This action will permanently delete",
      cancel: "Cancel",
      yesDelete: "Yes, delete"
    }
  },
  userDropdown: {
    selectLanguage: "Select language",
    languageEnglish: "English",
    languagePortuguese: "Portuguese (Brazil)",
    mySettings: "My settings",
    logOut: "Log out",
    lastLogin: "Last login",
    justNow: "Just now"
  }
};
const ptBR = {
  common: {
    buttons: {
      cancel: "Cancelar",
      confirm: "Confirmar",
      save: "Salvar",
      create: "Criar",
      edit: "Editar",
      delete: "Excluir",
      close: "Fechar",
      search: "Buscar",
      back: "Voltar",
      signIn: "Entrar",
      yesDelete: "Sim, excluir"
    },
    actions: {
      label: "Ações",
      edit: "Editar",
      delete: "Excluir"
    },
    states: {
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
      pending: "Pendente",
      running: "Em execução",
      stopping: "Parando",
      suspended: "Suspenso",
      terminating: "Encerrando",
      resumed: "Retomado"
    },
    validation: {
      required: "Campo obrigatório",
      emailRequired: "Email é obrigatório",
      emailMinLength: "Email deve ter pelo menos 6 caracteres",
      passwordRequired: "Senha é obrigatória"
    },
    table: {
      filterPlaceholder: "Filtrar por...",
      searchIn: "Buscar em {{label}}...",
      all: "Todos",
      clearFilters: "Limpar filtros",
      noResults: "Nenhum resultado encontrado na busca.",
      noResultsHint: "Tente ajustar os filtros ou limpar a busca para ver mais resultados.",
      selectAll: "Selecionar todos",
      sortBy: "Ordenar por {{label}}",
      showing: "Mostrando",
      of: "de",
      perPage: "Por página",
      prevPage: "Página anterior",
      nextPage: "Próxima página",
      previous: "Anterior",
      next: "Próximo"
    },
    status: {
      active: "Ativo",
      inactive: "Inativo"
    },
    selectOption: "Selecionar opção",
    filterPackage: "Filtrar pacote...",
    filterVersion: "Filtrar versão...",
    filterTechnology: "Filtrar tecnologia...",
    true: "Sim",
    false: "Não",
    warning: "Atenção"
  },
  breadcrumb: {
    dashboard: "Dashboard",
    home: "Home",
    users: "Usuários",
    roles: "Permissões",
    assets: "Ativos",
    packages: "Pacotes",
    jobs: "Jobs",
    scheduled: "Agendamentos",
    queues: "Filas",
    machines: "Máquinas",
    automation: "Automação",
    project: "Projeto",
    execution: "Execução",
    create: "Criar",
    upload: "Upload"
  },
  nav: {
    dashboards: "DASHBOARDS",
    home: "Início",
    projects: "Projetos",
    automation: "Automação",
    createProject: "Criar Projeto",
    manage: "Gerenciar",
    scheduled: "Agendado",
    jobs: "Fila de espera",
    packages: "Pacotes",
    machines: "Dispositivos",
    assets: "Assets",
    administration: "Administração",
    users: "Usuários",
    groupPermissions: "Funções",
    closeMenu: "Fechar menu",
    logout: "Sair",
    admin: "Admin"
  },
  pages: {
    login: {
      title: "Bem-vindo ao Beanstalk",
      subtitle: "Orquestre a eficiência",
      email: "Email",
      password: "Senha",
      emailPlaceholder: "Endereço de email",
      passwordPlaceholder: "Senha",
      signIn: "Entrar",
      loginSuccess: "Login bem-sucedido",
      loginError: "Falha ao realizar login",
      success: "Sucesso",
      failure: "Falha"
    },
    dashboard: {
      title: "Dashboard",
      loadingData: "Carregando dados do dashboard...",
      users: "Usuários",
      processes: "Processos",
      triggers: "Gatilhos",
      assets: "Ativos",
      queues: "Filas",
      machines: "Máquinas",
      jobStatus: "Status dos processos",
      jobsHistory: "Histórico de processos",
      revenueUpdates: "Atualizações",
      successful: "Sucesso",
      faulted: "Falha",
      stopped: "Parado",
      overviewProfit: "Visão geral",
      modernize: "Modernize",
      spikeAdmin: "Spike Admin",
      loadingChart: "Carregando gráfico..."
    },
    assets: {
      title: "Ativos",
      createAsset: "Criar ativo",
      name: "Nome",
      type: "Tipo",
      description: "Descrição",
      actions: "Ações",
      edit: "Editar",
      deleted: "Excluir",
      deleteSuccess: "Ativo excluído com sucesso",
      deleteError: "Falha ao excluir ativo"
    },
    scheduled: {
      title: "Agendamentos",
      subtitle: "Criar e gerenciar atividades programadas a partir desta página",
      createSchedule: "Criar agendamento",
      activityName: "Nome da atividade",
      frequency: "Frequência",
      nextExecution: "Próxima execução",
      priority: "Prioridade",
      details: "Detalhes",
      activitiesCount: "Atividades",
      deleteSuccess: "Agendamento excluído com sucesso",
      deleteError: "Falha ao excluir agendamento"
    },
    jobs: {
      title: "Jobs",
      columnName: "Nome",
      hostName: "Host",
      projectName: "Projeto",
      machineUser: "Usuário máquina",
      state: "Estado",
      priority: "Prioridade",
      robotVersion: "Versão do robô",
      startedAt: "Iniciado em",
      endedAt: "Finalizado em",
      preview: "Visualizar",
      execute: "Executar",
      deleteSuccess: "Job excluído com sucesso",
      deleteError: "Falha ao excluir job",
      deleteMultipleSuccess: "{{count}} job(s) excluído(s) com sucesso",
      deleteMultiplePartial: "{{ok}} excluído(s), {{fail}} falha(s)",
      clearAllSuccess: "{{count}} job(s) excluído(s). Você pode começar do zero.",
      executeSuccess: "Job executado com sucesso",
      createSuccess: "Job criado com sucesso",
      createError: "Falha ao criar job",
      deleteAll: "Excluir todos os jobs",
      deleteSelected: "Excluir selecionados ({{count}})",
      deleteAllConfirmItemName: "TODOS os jobs",
      deleteAllConfirmDescription: "Isso vai excluir todos os jobs da sua empresa. Não é possível desfazer. Deseja continuar?",
      deleteAllConfirmButton: "Sim, excluir tudo",
      noJobsToDelete: "Não há jobs para excluir",
      deleteAllConfirmTitle: "Excluir todos os jobs da empresa e começar do zero",
      deleteSelectedConfirmDescription: "Deseja realmente excluir os jobs selecionados?"
    },
    packages: {
      title: "Pacotes",
      download: "Download",
      downloadSuccess: "Download concluído com sucesso",
      downloadError: "Falha ao baixar pacote",
      upload: "Upload",
      new: "Novo",
      upgrade: "Atualizar",
      deleteSuccess: "Pacote excluído com sucesso",
      deleteError: "Falha ao excluir pacote"
    },
    machines: {
      title: "Máquinas",
      createMachineTemplate: "Criar modelo de máquina",
      back: "Voltar",
      titleEdit: "Editar máquina",
      titleCreate: "Criar máquina",
      machineName: "Nome da máquina",
      machineNameRequired: "Nome da máquina é obrigatório",
      machineNameMinLength: "Nome deve ter pelo menos 5 caracteres",
      environment: "Ambiente",
      environmentRequired: "Ambiente é obrigatório",
      environmentMinLength: "Ambiente deve ter pelo menos 5 caracteres",
      hostname: "Host",
      hostNameRequired: "Host é obrigatório",
      hostNameMinLength: "Host deve ter pelo menos 3 caracteres",
      ip: "IP",
      ipRequired: "IP é obrigatório",
      invalidIp: "Formato de IP inválido",
      deleteSuccess: "Máquina excluída com sucesso",
      deleteError: "Falha ao excluir máquina",
      editSuccess: "Máquina editada com sucesso",
      createSuccess: "Máquina criada com sucesso",
      saveError: "Falha ao salvar máquina"
    },
    users: {
      title: "Usuários",
      createUser: "Criar usuário",
      email: "Email",
      role: "Função",
      disable: "Desativar",
      enable: "Ativar",
      disableSuccess: "Usuário desativado com sucesso",
      disableError: "Falha ao desativar usuário",
      enableSuccess: "Usuário ativado com sucesso",
      enableError: "Falha ao ativar usuário"
    },
    roles: {
      title: "Permissões",
      addRole: "Adicionar permissão",
      deleteSuccess: "Grupo de permissão excluído com sucesso",
      deleteError: "Falha ao excluir permissão"
    },
    permissions: {
      title: "Permissões",
      nameRequired: "Nome *",
      placeholder: "Digite o nome do grupo",
      roleNameRequired: "O nome do grupo é obrigatório.",
      roleNameMinLength: "O grupo deve ter pelo menos 5 caracteres.",
      permissions: "Permissões",
      view: "Visualizar",
      edit: "Editar",
      create: "Criar",
      delete: "Excluir",
      requiredFieldsWarning: "Os campos com * são obrigatórios",
      editSuccess: "Grupo de permissão editado com sucesso",
      createSuccess: "Grupo de permissão criado com sucesso",
      saveError: "Falha ao salvar permissões"
    },
    automation: {
      title: "Automação",
      createProject: "Criar projeto",
      execute: "Executar",
      columnName: "Nome",
      columnPackageVersion: "Versão do pacote",
      columnStatus: "Status",
      columnCreatedAt: "Criado em",
      edit: "Editar",
      delete: "Excluir",
      deleteSuccess: "Projeto excluído com sucesso",
      deleteError: "Falha ao excluir projeto"
    },
    schedule: {
      editSchedule: "Editar agendamento",
      createSchedule: "Criar agendamento",
      newSchedule: "Novo agendamento",
      name: "Nome",
      nameRequired: "Nome é obrigatório",
      nameMinLength: "O nome deve ter pelo menos 5 caracteres",
      project: "Projeto",
      projectRequired: "Projeto é obrigatório",
      priority: "Prioridade",
      priorityRequired: "Prioridade é obrigatória",
      frequency: "Frequência",
      frequencyRequired: "Frequência é obrigatória",
      machine: "Máquina",
      machineRequired: "Máquina é obrigatória",
      details: "Detalhes",
      detailsRequired: "Detalhes são obrigatórios",
      detailsMinLength: "Os detalhes devem ter pelo menos 5 caracteres",
      detailsPlaceholder: "Detalhes do agendamento",
      repeatEvery: "Repetir a cada",
      repeatEveryRequired: "Repetir a cada é obrigatório",
      minute: "Minuto",
      minuteRequired: "Minuto é obrigatório",
      create: "Criar",
      edit: "Editar",
      updatedSuccess: "Agendamento atualizado com sucesso",
      createdSuccess: "Agendamento criado com sucesso",
      saveError: "Falha ao salvar agendamento",
      loadError: "Falha ao carregar dados do agendamento",
      daysOfWeek: {
        monday: "Segunda",
        tuesday: "Terça",
        wednesday: "Quarta",
        thursday: "Quinta",
        friday: "Sexta",
        saturday: "Sábado",
        sunday: "Domingo"
      },
      everyMinutes: "A cada (minutos)",
      hour: "Hora",
      dayOfWeek: "Dia da semana",
      dayOfMonth: "Dia do mês",
      weekOfMonth: "Semana do mês",
      cronScheduling: "Agendamento Cron",
      selectOption: "Selecionar opção",
      stepsEdit: {
        step1: "Altere o nome e o projeto, se precisar.",
        step2: "Ajuste prioridade e máquina de execução.",
        step3: "Atualize a frequência e os parâmetros de cron.",
        step4: "Revise os detalhes e salve."
      },
      stepsCreate: {
        step1: "Informe o nome e escolha o projeto.",
        step2: "Defina a prioridade e a máquina de execução.",
        step3: "Escolha a frequência (minuto, hora, dia, semana ou mês).",
        step4: "Preencha os parâmetros de cron para quando a tarefa deve rodar.",
        step5: "Adicione os detalhes e crie o agendamento."
      },
      validationHourlyRepeat: 'Para frequência Hourly, o campo "Repetir a cada" é obrigatório e deve ser maior que 0',
      validationHourlyMinute: 'Para frequência Hourly, o campo "Minuto" é obrigatório e deve ser entre 0 e 59',
      validationMinuteEvery: 'Para frequência Minute, o campo "A cada" é obrigatório',
      validationDaily: 'Para frequência Daily, os campos "Repetir a cada", "Hora" e "Minuto" são obrigatórios',
      validationWeekly: 'Para frequência Weekly, os campos "Repetir a cada" e "Dia da semana" são obrigatórios',
      validationMonthlyDay: "Para frequência Monthly Day, todos os campos são obrigatórios",
      validationMonthlyWeek: "Para frequência Monthly Week, todos os campos são obrigatórios",
      validationMustBeGreaterThanZero: "Deve ser maior que 0",
      validationBetween0And59: "Deve ser entre 0 e 59",
      frequencies: {
        everyMinute: "A cada minuto",
        hourly: "A cada hora",
        daily: "Diário",
        weekly: "Semanal",
        monthlyByDay: "Mensal por dia",
        monthlyByWeek: "Mensal por semana",
        customCron: "Cron personalizado"
      },
      priorities: {
        low: "Baixa",
        medium: "Média",
        high: "Alta",
        critical: "Crítica"
      }
    },
    execution: {
      title: "Execução",
      backToAutomation: "Voltar à Automação",
      selectProject: "Selecionar projeto",
      selectMachine: "Selecionar máquina",
      selectPriority: "Selecionar prioridade",
      jobName: "Nome do job",
      jobNamePlaceholder: "Ex: Execução manual",
      selectType: "Selecionar tipo",
      typeString: "String",
      typeNumber: "Number",
      typeBoolean: "Boolean",
      parameters: "Parâmetros",
      addParameter: "Adicionar parâmetro",
      namePlaceholder: "Nome",
      valuePlaceholder: "Valor",
      execute: "Executar",
      executeSuccess: "Job criado e executado com sucesso",
      executeError: "Erro ao criar ou executar job"
    },
    project: {
      titleEdit: "Editar projeto",
      titleCreate: "Criar projeto",
      back: "Voltar",
      name: "Nome",
      active: "Ativo",
      autoUpdateVersion: "Atualizar versão automaticamente",
      status: "Status",
      description: "Descrição",
      packageName: "Pacote",
      versionPackage: "Versão do pacote",
      filterPackage: "Filtrar pacote...",
      filterVersion: "Filtrar versão...",
      editSuccess: "Projeto editado com sucesso",
      createSuccess: "Projeto criado com sucesso",
      nameRequired: "Nome é obrigatório",
      nameMinLength: "Nome deve ter pelo menos 5 caracteres",
      descriptionRequired: "Descrição é obrigatória",
      descriptionMinLength: "Descrição deve ter pelo menos 5 caracteres",
      statusRequired: "Status é obrigatório",
      statusMinLength: "Status deve ter pelo menos 5 caracteres",
      packageRequired: "Pacote é obrigatório",
      versionRequired: "Versão do pacote é obrigatória",
      saveError: "Falha ao salvar projeto"
    },
    packagesUpload: {
      title: "Upload de pacotes",
      createSuccess: "Pacote criado com sucesso",
      versionUpdateSuccess: "Versão do pacote atualizada com sucesso",
      selectedFile: "Selecionado",
      filterPackage: "Filtrar pacote...",
      filterTechnology: "Filtrar tecnologia...",
      back: "Voltar",
      packageName: "Nome do pacote",
      packageLabel: "Pacote",
      description: "Descrição",
      technology: "Tecnologia",
      version: "Versão",
      file: "Arquivo",
      clickToUpload: "Clique para enviar ou arraste o arquivo",
      cancel: "Cancelar",
      create: "Criar",
      upgrade: "Atualizar",
      nameRequired: "Nome do pacote é obrigatório",
      nameMinLength: "Nome deve ter pelo menos 5 caracteres",
      descriptionRequired: "Descrição é obrigatória",
      descriptionMinLength: "Descrição deve ter pelo menos 5 caracteres",
      packageRequired: "Pacote é obrigatório",
      technologyRequired: "Tecnologia é obrigatória",
      versionRequired: "Versão é obrigatória",
      versionFormat: "Versão deve estar no formato X.Y.Z (ex.: 1.0.0)",
      fileRequired: "Arquivo é obrigatório",
      uploadError: "Falha ao fazer upload do pacote"
    },
    jobDetails: {
      loading: "Carregando detalhes do job...",
      backToJobs: "Voltar para Jobs",
      title: "Detalhes do job",
      name: "Nome",
      hostname: "Host",
      projectName: "Projeto",
      state: "Estado",
      priority: "Prioridade",
      packageVersion: "Versão do pacote",
      robot: "Robô",
      startedAt: "Iniciado em",
      endedAt: "Finalizado em",
      inputValues: "Valores de entrada",
      nameCol: "Nome",
      typeCol: "Tipo",
      valueCol: "Valor"
    },
    asset: {
      back: "Voltar",
      titleEdit: "Editar ativo",
      titleCreate: "Criar ativo",
      name: "Nome",
      type: "Tipo",
      description: "Descrição",
      value: "Valor",
      userName: "Nome de usuário",
      nameRequired: "Nome é obrigatório",
      nameMinLength: "Nome deve ter pelo menos 5 caracteres",
      typeRequired: "Tipo é obrigatório",
      descriptionRequired: "Descrição é obrigatória",
      descriptionMinLength: "Descrição deve ter pelo menos 5 caracteres",
      valueRequired: "Valor é obrigatório",
      userNameRequired: "Nome de usuário é obrigatório",
      editSuccess: "Ativo editado com sucesso",
      createSuccess: "Ativo criado com sucesso",
      typeText: "Texto",
      typeInteger: "Inteiro",
      typeBool: "Bool",
      typeCredential: "Credencial",
      saveError: "Falha ao salvar ativo"
    },
    user: {
      back: "Voltar",
      titleEdit: "Editar usuário",
      titleCreate: "Criar usuário",
      name: "Nome",
      cpf: "CPF",
      email: "Email",
      phone: "Telefone",
      password: "Senha",
      confirmPassword: "Confirmar senha",
      passwordMismatch: "As senhas não coincidem",
      roles: "Funções",
      availableRoles: "Funções disponíveis",
      selectedRoles: "Funções selecionadas",
      nameRequired: "Nome é obrigatório",
      cpfRequired: "CPF é obrigatório",
      emailRequired: "Email é obrigatório",
      phoneRequired: "Telefone é obrigatório",
      passwordRequired: "Senha é obrigatória",
      confirmPasswordRequired: "Confirmação de senha é obrigatória",
      selectOneRole: "Selecione pelo menos um role",
      updateSuccess: "Usuário atualizado com sucesso",
      createSuccess: "Usuário criado com sucesso",
      saveError: "Falha ao salvar usuário"
    },
    queues: {
      title: "Filas",
      realtime: "Tempo real",
      historical: "Histórico",
      name: "Nome",
      status: "Status",
      items: "Itens",
      actions: "Ações",
      view: "Visualizar",
      viewDetails: "Ver detalhes",
      processedItems: "Itens processados",
      lastProcessed: "Último processamento",
      loadingRealtime: "Carregando filas em tempo real...",
      loadingHistorical: "Carregando histórico de filas...",
      titleRealtime: "Filas em tempo real",
      titleHistorical: "Histórico de filas"
    }
  },
  modals: {
    delete: {
      title: "Tem certeza absoluta?",
      description: "Esta ação excluirá permanentemente",
      cancel: "Cancelar",
      yesDelete: "Sim, excluir"
    }
  },
  userDropdown: {
    selectLanguage: "Selecionar idioma",
    languageEnglish: "Inglês",
    languagePortuguese: "Português (Brasil)",
    mySettings: "Minhas configurações",
    logOut: "Sair",
    lastLogin: "Último acesso",
    justNow: "Agora mesmo"
  }
};
const LANGUAGE_STORAGE_KEY = "i18n_lng";
i18n.use(initReactI18next).init({
  lng: typeof window !== "undefined" ? localStorage.getItem(LANGUAGE_STORAGE_KEY) || "pt-BR" : "pt-BR",
  debug: false,
  resources: {
    en: {
      translation: en
    },
    "pt-BR": {
      translation: ptBR
    }
  },
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false
  }
});
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
});
const useNotificationStore = create((set) => ({
  notification: null,
  showToast: (title, message, type) => {
    set({ notification: { title, message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, 3e3);
  },
  clearNotification: () => set({ notification: null })
}));
function Notification() {
  const notification = useNotificationStore((state) => state.notification);
  if (!notification) return null;
  const bgColor = notification.type === "success" ? "bg-green-500" : notification.type === "error" ? "bg-red-500" : "bg-yellow-500";
  return /* @__PURE__ */ jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in", children: /* @__PURE__ */ jsx("div", { className: `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-md`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: notification.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: notification.message })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => useNotificationStore.getState().clearNotification(),
        className: "ml-4 text-white hover:text-gray-200",
        children: "×"
      }
    )
  ] }) }) });
}
function DeleteModal({ isOpen, onClose, data }) {
  const { t } = useTranslation("translation");
  return /* @__PURE__ */ jsx(Transition, { show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => onClose(false), children: [
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
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/85" })
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
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx(ExclamationTriangleIcon, { className: "h-24 w-24 text-error mb-6" }),
          /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-2xl font-semibold leading-8 text-gray-900 mb-4", children: data.title?.trim() || t("modals.delete.title") }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-lg text-gray-500", children: [
            data.description?.trim() || t("modals.delete.description"),
            " ",
            /* @__PURE__ */ jsx("strong", { children: data.itemName }),
            "."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                onClick: () => onClose(false),
                children: t("modals.delete.cancel")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-xl bg-error px-8 py-3.5 text-base font-medium text-white hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2",
                onClick: () => onClose(true),
                children: data.buttonName?.trim() || t("modals.delete.yesDelete")
              }
            )
          ] })
        ] }) })
      }
    ) }) })
  ] }) });
}
function EnabledModal({ isOpen, onClose, data }) {
  return /* @__PURE__ */ jsx(Transition, { show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => onClose(false), children: [
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
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx(CheckCircleIcon, { className: "h-12 w-12 text-success mb-3" }),
          /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-lg font-semibold leading-6 text-gray-900 mb-2", children: data.title?.trim() || "Enable Item" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            data.description?.trim() || "Do you want to enable",
            " ",
            /* @__PURE__ */ jsx("strong", { children: data.itemName }),
            "?"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                onClick: () => onClose(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2",
                onClick: () => onClose(true),
                children: data.buttonName?.trim() || "Yes, Enable"
              }
            )
          ] })
        ] }) })
      }
    ) }) })
  ] }) });
}
function DownloadModal({ isOpen, onClose, data }) {
  const [selectedVersion, setSelectedVersion] = useState(
    data.versions.length > 0 ? data.versions[0] : null
  );
  useEffect(() => {
    if (isOpen && data.versions.length > 0) {
      setSelectedVersion(data.versions[0]);
    } else if (isOpen && data.versions.length === 0) {
      setSelectedVersion(null);
    }
  }, [isOpen, data.versions]);
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
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx(ArrowDownTrayIcon, { className: "h-12 w-12 text-primary mb-3" }),
          /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-lg font-semibold leading-6 text-gray-900 mb-4", children: data.title || "Select Version to Download" }),
          /* @__PURE__ */ jsxs("div", { className: "w-full mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Version" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                value: selectedVersion?.id || "",
                onChange: (e) => {
                  const version = data.versions.find((v) => v.id === Number(e.target.value));
                  setSelectedVersion(version || null);
                },
                children: data.versions.map((version) => /* @__PURE__ */ jsx("option", { value: version.id, children: version.version }, version.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                onClick: () => onClose(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                onClick: () => onClose(selectedVersion),
                disabled: !selectedVersion,
                children: "Download"
              }
            )
          ] })
        ] }) })
      }
    ) }) })
  ] }) });
}
let deleteResolve = null;
let enabledResolve = null;
let downloadResolve = null;
const useModalStore = create((set) => ({
  deleteModal: {
    isOpen: false,
    data: {}
  },
  enabledModal: {
    isOpen: false,
    data: {}
  },
  downloadModal: {
    isOpen: false,
    data: { versions: [] }
  },
  confirmDelete: (data) => {
    return new Promise((resolve) => {
      deleteResolve = resolve;
      set({
        deleteModal: {
          isOpen: true,
          data
        }
      });
    });
  },
  confirmEnable: (data) => {
    return new Promise((resolve) => {
      enabledResolve = resolve;
      set({
        enabledModal: {
          isOpen: true,
          data
        }
      });
    });
  },
  confirmDownload: (data) => {
    return new Promise((resolve) => {
      downloadResolve = resolve;
      set({
        downloadModal: {
          isOpen: true,
          data
        }
      });
    });
  },
  closeDeleteModal: (confirmed) => {
    if (deleteResolve) {
      deleteResolve(confirmed);
      deleteResolve = null;
    }
    set({
      deleteModal: {
        isOpen: false,
        data: {}
      }
    });
  },
  closeEnabledModal: (confirmed) => {
    if (enabledResolve) {
      enabledResolve(confirmed);
      enabledResolve = null;
    }
    set({
      enabledModal: {
        isOpen: false,
        data: {}
      }
    });
  },
  closeDownloadModal: (result) => {
    if (downloadResolve) {
      downloadResolve(result);
      downloadResolve = null;
    }
    set({
      downloadModal: {
        isOpen: false,
        data: { versions: [] }
      }
    });
  }
}));
function ModalProvider() {
  const deleteModal = useModalStore((state) => state.deleteModal);
  const enabledModal = useModalStore((state) => state.enabledModal);
  const downloadModal = useModalStore((state) => state.downloadModal);
  const closeDeleteModal = useModalStore((state) => state.closeDeleteModal);
  const closeEnabledModal = useModalStore((state) => state.closeEnabledModal);
  const closeDownloadModal = useModalStore((state) => state.closeDownloadModal);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      DeleteModal,
      {
        isOpen: deleteModal.isOpen,
        onClose: closeDeleteModal,
        data: deleteModal.data
      }
    ),
    /* @__PURE__ */ jsx(
      EnabledModal,
      {
        isOpen: enabledModal.isOpen,
        onClose: closeEnabledModal,
        data: enabledModal.data
      }
    ),
    /* @__PURE__ */ jsx(
      DownloadModal,
      {
        isOpen: downloadModal.isOpen,
        onClose: closeDownloadModal,
        data: downloadModal.data
      }
    )
  ] });
}
const links = () => [{
  rel: "icon",
  type: "image/svg+xml",
  href: "/assets/images/svgs/login/image 83.svg"
}];
function Layout$1({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "pt-BR",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(ErrorBoundary, {
        children
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function Root() {
  return /* @__PURE__ */ jsxs(ErrorBoundary, {
    children: [/* @__PURE__ */ jsx(Notification, {}), /* @__PURE__ */ jsx(ModalProvider, {}), /* @__PURE__ */ jsx(Outlet, {})]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout: Layout$1,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const navItems = [
  {
    navCap: "nav.dashboards",
    chipClass: "title-sidebar"
  },
  {
    displayName: "nav.home",
    iconName: "home",
    route: "/dashboard"
  },
  {
    navCap: "nav.projects",
    chipClass: "title-sidebar"
  },
  {
    displayName: "nav.automation",
    iconName: "automation",
    children: [
      {
        displayName: "nav.automation",
        route: "/automation"
      },
      {
        displayName: "nav.createProject",
        route: "/project"
      }
    ]
  },
  {
    navCap: "nav.manage",
    chipClass: "title-sidebar"
  },
  {
    displayName: "nav.manage",
    iconName: "manage",
    children: [
      {
        displayName: "nav.scheduled",
        chipClass: "children",
        route: "/scheduled"
      },
      {
        displayName: "nav.jobs",
        chipClass: "children",
        route: "/jobs"
      },
      {
        displayName: "nav.packages",
        chipClass: "children",
        route: "/packages"
      },
      {
        displayName: "nav.machines",
        chipClass: "children",
        route: "/machines"
      },
      {
        displayName: "nav.assets",
        chipClass: "children",
        route: "/assets"
      }
    ]
  },
  {
    navCap: "nav.administration",
    chipClass: "title-sidebar"
  },
  {
    displayName: "nav.administration",
    iconName: "administration",
    children: [
      {
        displayName: "nav.users",
        route: "/users"
      },
      {
        displayName: "nav.groupPermissions",
        route: "/roles"
      }
    ]
  }
];
const iconMap = {
  aperture: LayoutDashboard,
  home: Home,
  dashboard: LayoutDashboard,
  automation: Settings,
  project: FilePlus,
  manage: Settings,
  scheduled: Calendar,
  jobs: Briefcase,
  packages: Package,
  machines: Server,
  assets: FolderOpen,
  administration: Shield,
  users: Users$1,
  roles: Shield,
  "group-permissions": Shield,
  execute: PlayCircle
};
const getIcon = (iconName) => {
  if (!iconName) return null;
  const IconComponent = iconMap[iconName.toLowerCase()] || LayoutDashboard;
  return IconComponent;
};
const TOKEN_KEY = "Authorization";
const tokenService = {
  saveToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("token", token);
  },
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
  },
  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
  }
};
const authService = {
  logout: () => {
    tokenService.removeToken();
    window.location.href = "/login";
  },
  isLoggedIn: () => {
    return tokenService.getToken() !== null;
  }
};
const LANGUAGE_OPTIONS = [
  { value: "en", labelKey: "userDropdown.languageEnglish" },
  { value: "pt-BR", labelKey: "userDropdown.languagePortuguese" }
];
function AdminUserModal({
  open,
  onClose,
  userName = "Admin",
  userEmail = ""
}) {
  const { t } = useTranslation("translation");
  const currentLng = i18n.language || "pt-BR";
  const handleLanguageChange = (event) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
  };
  const handleLogout = () => {
    onClose();
    authService.logout();
  };
  return /* @__PURE__ */ jsx(Transition, { show: open, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose, children: [
    /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-200",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-150",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-200",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leave: "ease-in duration-150",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
        children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-6 py-4", children: [
            /* @__PURE__ */ jsx(Dialog.Title, { as: "h2", className: "text-lg font-semibold text-gray-900", children: userName }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors",
                "aria-label": t("common.buttons.close"),
                children: /* @__PURE__ */ jsx(XMarkIcon, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 font-semibold text-lg", children: userName.slice(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-gray-900", children: userName }),
              userEmail && /* @__PURE__ */ jsx("p", { className: "truncate text-sm text-gray-500", children: userEmail }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-gray-500", children: [
                t("userDropdown.lastLogin"),
                ": ",
                t("userDropdown.justNow")
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 px-6 py-4", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "admin-language-select", className: "mb-2 block text-sm font-medium text-gray-700", children: t("userDropdown.selectLanguage") }),
            /* @__PURE__ */ jsx(
              "select",
              {
                id: "admin-language-select",
                value: currentLng,
                onChange: handleLanguageChange,
                className: "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500",
                children: LANGUAGE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: t(opt.labelKey) }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                onClick: (e) => {
                  e.preventDefault();
                  onClose();
                },
                className: "text-sm font-medium text-blue-600 hover:text-blue-800",
                children: t("userDropdown.mySettings")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleLogout,
                className: "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                children: t("userDropdown.logOut")
              }
            )
          ] })
        ] })
      }
    ) }) })
  ] }) });
}
const logoClosed = "/assets/logoNovo-CRsuGCax.svg";
const logoOpen = "/assets/2%2091-BIBokIlh.svg";
function normalizeRoute(route) {
  if (!route) return "";
  return route.startsWith("/") ? route : `/${route}`;
}
function Sidebar({
  isOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  showToggle = true,
  width = 270
}) {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(/* @__PURE__ */ new Set());
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  useEffect(() => {
    const path = location.pathname;
    setExpandedItems((prev) => {
      const next = new Set(prev);
      navItems.forEach((item) => {
        if (item.children?.some((c) => {
          const r = normalizeRoute(c.route);
          return r && (path === r || path.startsWith(r + "/"));
        })) {
          if (item.displayName) next.add(item.displayName);
        }
      });
      return next;
    });
  }, [location.pathname]);
  const toggleExpand = (item) => {
    if (item.children && item.children.length > 0) {
      const key = item.displayName || "";
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    }
  };
  const isActive = (route) => {
    const r = normalizeRoute(route);
    if (!r) return false;
    return location.pathname === r || location.pathname.startsWith(`${r}/`);
  };
  const renderNavItem = (item, depth = 0, index) => {
    if (item.navCap) {
      if (isCollapsed) return null;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "px-5 py-2.5 mt-4 first:mt-2 text-[11px] font-semibold text-white/50 uppercase tracking-widest",
          children: t(item.navCap)
        },
        `cap-${item.navCap}`
      );
    }
    if (item.external) {
      return /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.route,
          target: "_blank",
          rel: "noopener noreferrer",
          style: { cursor: "pointer" },
          className: `cursor-pointer flex items-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors ${isCollapsed ? "justify-center py-3 px-2.5" : "gap-3 px-5 py-3"}`,
          children: [
            item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return /* @__PURE__ */ jsx(IconComponent, { className: "w-6 h-6 shrink-0 text-white/70" });
            })(),
            !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.displayName ? t(item.displayName) : "" })
          ]
        },
        `ext-${item.displayName}-${item.route}`
      );
    }
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.displayName || "");
    const active = isActive(item.route);
    const basePadding = isCollapsed ? "justify-center py-3 px-2.5" : "pl-5 gap-3 py-3 pr-5";
    const indent = depth > 0 && !isCollapsed ? { paddingLeft: `${1.25 + depth * 1.25}rem` } : void 0;
    const itemKey = `nav-${depth}-${item.route ?? item.displayName ?? index ?? ""}`;
    if (isCollapsed && hasChildren) {
      return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => toggleExpand(item),
          style: { cursor: item.disabled ? "not-allowed" : "pointer" },
          className: `cursor-pointer w-full flex items-center rounded-lg justify-center py-3 px-2.5 transition-colors ${active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`,
          children: item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 shrink-0 text-white/70" });
          })()
        }
      ) }, itemKey);
    }
    return /* @__PURE__ */ jsx("div", { children: item.route && !hasChildren ? /* @__PURE__ */ jsxs(
      Link,
      {
        to: normalizeRoute(item.route) || "#",
        onClick: () => onClose(),
        style: indent,
        className: `flex items-center rounded-lg transition-colors ${basePadding} ${active ? "bg-orange text-white shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer"}`,
        children: [
          item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return /* @__PURE__ */ jsx(IconComponent, { className: `w-8 h-8 shrink-0 ${active ? "text-white" : "text-white/70"}` });
          })(),
          !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1 font-medium", children: item.displayName ? t(item.displayName) : "" })
        ]
      }
    ) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => toggleExpand(item),
          style: indent,
          className: `cursor-pointer w-full flex items-center rounded-lg text-left transition-colors ${basePadding} ${active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`,
          children: [
            item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 shrink-0 text-white/70" });
            })(),
            !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1 font-medium", children: item.displayName ? t(item.displayName) : "" }),
            hasChildren && !isCollapsed && /* @__PURE__ */ jsx(
              ChevronDownIcon,
              {
                className: `w-5 h-5 shrink-0 text-white/60 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`
              }
            )
          ]
        }
      ),
      hasChildren && isExpanded && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "mt-1 space-y-1 border-l border-white/10 ml-7 pl-2", children: item.children?.map((child, childIndex) => renderNavItem(child, depth + 1, childIndex)) })
    ] }) }, itemKey);
  };
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `app-sidebar fixed inset-y-0 left-0 z-50 flex flex-col bg-purple shadow-xl transition-[transform,width] duration-300 ease-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
      style: { width },
      children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between shrink-0 h-[70px] bg-white border-b border-gray-100 ${isCollapsed ? "px-2" : "px-5"}`, children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/dashboard",
              className: `cursor-pointer flex items-center min-w-0 h-full ${isCollapsed ? "flex-1 justify-center" : "gap-3"}`,
              children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center shrink-0 h-full w-full max-h-[70px]", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: isCollapsed ? logoClosed : logoOpen,
                  alt: "Beanstalk",
                  className: `object-contain object-center h-full max-h-[70px] ${isCollapsed ? "w-full max-w-[66px]" : "w-auto min-h-[50px]"}`
                }
              ) })
            }
          ),
          showToggle && !isCollapsed && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "cursor-pointer p-2 -m-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors lg:hidden",
              "aria-label": t("nav.closeMenu"),
              children: /* @__PURE__ */ jsx(XMarkIcon, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden py-3", children: /* @__PURE__ */ jsx("div", { className: `space-y-3 ${isCollapsed ? "px-2" : "px-0"}`, children: navItems.map((item, index) => renderNavItem(item, 0, index)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "shrink-0 p-4 border-t border-white/10 bg-purple", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setAdminModalOpen(true),
              className: `cursor-pointer w-full flex items-center rounded-xl bg-white/10 transition-[padding] duration-300 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 ${isCollapsed ? "justify-center p-2.5" : "gap-3 px-4 py-3"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/assets/images/profile/user-1.jpg",
                    alt: "",
                    className: "w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20",
                    onError: (e) => {
                      const el = e.target;
                      el.src = "data:image/svg+xml," + encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.2)"/><path fill="white" d="M20 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 4c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>'
                      );
                    }
                  }
                ),
                !isCollapsed && /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 text-left", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-white/80 uppercase tracking-wider truncate", children: t("nav.admin") }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            AdminUserModal,
            {
              open: adminModalOpen,
              onClose: () => setAdminModalOpen(false),
              userName: "Admin",
              userEmail: ""
            }
          )
        ] })
      ]
    }
  );
}
function Header({
  onToggleSidebar,
  onToggleMobileNav,
  showToggle = true
}) {
  return /* @__PURE__ */ jsxs("header", { className: "h-[70px] bg-white shadow-sm border-b border-gray-200 flex items-center px-4", children: [
    showToggle ? /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onToggleSidebar,
        className: "p-2 text-gray-600 hover:text-gray-900 lg:block hidden",
        children: /* @__PURE__ */ jsx(Bars3Icon, { className: "w-6 h-6" })
      }
    ) : /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onToggleMobileNav,
        className: "p-2 text-gray-600 hover:text-gray-900 lg:hidden",
        children: /* @__PURE__ */ jsx(Bars3Icon, { className: "w-6 h-6" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onToggleMobileNav,
        className: "p-2 text-gray-600 hover:text-gray-900 lg:hidden",
        children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "⚙️" })
      }
    )
  ] });
}
const BREADCRUMB_KEYS = {
  dashboard: "breadcrumb.dashboard",
  users: "breadcrumb.users",
  roles: "breadcrumb.roles",
  assets: "breadcrumb.assets",
  packages: "breadcrumb.packages",
  jobs: "breadcrumb.jobs",
  scheduled: "breadcrumb.scheduled",
  queues: "breadcrumb.queues",
  machines: "breadcrumb.machines",
  automation: "breadcrumb.automation",
  project: "breadcrumb.project",
  execution: "breadcrumb.execution",
  create: "breadcrumb.create",
  upload: "breadcrumb.upload"
};
function Breadcrumb() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);
  const getBreadcrumbName = (path) => {
    const key = BREADCRUMB_KEYS[path];
    return key ? t(key) : path.charAt(0).toUpperCase() + path.slice(1);
  };
  if (paths.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-2 text-sm text-gray-600 mb-4", children: [
    /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "hover:text-primary", children: /* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }) }),
    paths.map((path, index) => {
      const isLast = index === paths.length - 1;
      const route = "/" + paths.slice(0, index + 1).join("/");
      const name = getBreadcrumbName(path);
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(ChevronRightIcon, { className: "w-4 h-4 text-gray-400" }),
        isLast ? /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-medium", children: name }) : /* @__PURE__ */ jsx(Link, { to: route, className: "hover:text-primary", children: name })
      ] }, route);
    })
  ] });
}
const SIDEBAR_WIDTH = 270;
const SIDEBAR_COLLAPSED_WIDTH = 72;
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location, isMobile]);
  const desktopSidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        isOpen: sidebarOpen,
        isCollapsed: !isMobile && sidebarCollapsed,
        onClose: () => setSidebarOpen(false),
        onToggleCollapse: () => setSidebarCollapsed((c) => !c),
        showToggle: isMobile,
        width: isMobile ? SIDEBAR_WIDTH : desktopSidebarWidth
      }
    ),
    sidebarOpen && isMobile && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-[margin] duration-300",
        style: { marginLeft: isMobile ? 0 : desktopSidebarWidth },
        children: [
          /* @__PURE__ */ jsx(
            Header,
            {
              onToggleSidebar: () => !isMobile ? setSidebarCollapsed((c) => !c) : setSidebarOpen((o) => !o),
              onToggleMobileNav: () => setSidebarOpen(!sidebarOpen),
              showToggle: !isMobile
            }
          ),
          /* @__PURE__ */ jsx("main", { className: "flex-1 bg-background min-w-0 overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-5 min-w-0 max-w-full", children: [
            /* @__PURE__ */ jsx(Breadcrumb, {}),
            /* @__PURE__ */ jsx(Outlet, {})
          ] }) })
        ]
      }
    )
  ] });
}
function ProtectedRoute({ children }) {
  return /* @__PURE__ */ jsx(Fragment$1, { children });
}
const _layout = UNSAFE_withComponentProps(function LayoutRoute() {
  return /* @__PURE__ */ jsx(ProtectedRoute, {
    children: /* @__PURE__ */ jsx(Layout, {})
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout
}, Symbol.toStringTag, { value: "Module" }));
const environment = {
  apiUrl: "/api"
};
const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 6e4
  // 60s para uploads grandes
});
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("Authorization") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
const jobService = {
  getAllJobs: async (queryString) => {
    const response = await api.get(
      `/jobs?${queryString}`
    );
    return response.data;
  },
  getByIdJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (job) => {
    const response = await api.post("/jobs", job);
    return response.data;
  },
  executeJob: async (id) => {
    await api.post(`/jobs/${id}/execute`);
  },
  deleteJob: async (id) => {
    await api.delete(`/jobs/${id}`);
  },
  deleteAllJobs: async () => {
    const response = await api.delete("/jobs/all");
    return response.data;
  }
};
function JobDetails() {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  useEffect(() => {
    if (id) {
      loadJobById(Number(id));
    } else {
      navigate("/jobs");
    }
  }, [id]);
  const loadJobById = async (jobId) => {
    try {
      const result = await jobService.getByIdJob(jobId);
      setJob(result);
    } catch (error) {
      console.error("Erro ao carregar job:", error);
      navigate("/jobs");
    }
  };
  if (!job) {
    return /* @__PURE__ */ jsx("div", { className: "p-5 min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("pages.jobDetails.loading") })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/jobs"),
          className: "text-primary hover:text-primary/80 mb-4 flex items-center gap-2",
          children: [
            "← ",
            t("pages.jobDetails.backToJobs")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: t("pages.jobDetails.title") })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.name") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.name || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.hostname") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.hostname || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.projectName") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.projectName || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.state") }),
        /* @__PURE__ */ jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm ${job.state === "Running" ? "bg-green-100 text-green-800" : job.state === "Completed" ? "bg-blue-100 text-blue-800" : job.state === "Failed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`, children: job.state || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.priority") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.priority || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.packageVersion") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.packageVersion || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.startedAt") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.started ? new Date(job.started).toLocaleString() : "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t("pages.jobDetails.endedAt") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.ended ? new Date(job.ended).toLocaleString() : "-" })
      ] })
    ] }) })
  ] });
}
const _layout_jobDetails_$id = UNSAFE_withComponentProps(function JobDetailsRoute() {
  return /* @__PURE__ */ jsx(JobDetails, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_jobDetails_$id
}, Symbol.toStringTag, { value: "Module" }));
function Loading({ size = "md", text }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen w-full bg-background", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`
      }
    ),
    text && /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-600", children: text })
  ] });
}
const Permissions$1 = lazy(() => import("./Permissions-Cd4Lnutg.js"));
const _layout_permissions = UNSAFE_withComponentProps(function PermissionsRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Permissions$1, {})
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_permissions
}, Symbol.toStringTag, { value: "Module" }));
const Permissions = lazy(() => import("./Permissions-Cd4Lnutg.js"));
const _layout_permissions_$id = UNSAFE_withComponentProps(function PermissionsEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Permissions, {})
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_permissions_$id
}, Symbol.toStringTag, { value: "Module" }));
const projectsService = {
  createProject: async (project) => {
    const response = await api.post("/projects", project);
    return response.data;
  },
  updateProject: async (id, project) => {
    const response = await api.patch(`/projects/${id}`, project);
    return response.data;
  },
  getAllProjects: async (paginations, queryParams) => {
    const queryString = queryParams || `SortField=id&SortOrder=asc&PageNumber=${paginations.pageNumber}&PageSize=${paginations.pageSize}`;
    const response = await api.get(
      `/projects/all?${queryString}`
    );
    return response.data;
  },
  getByIdProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },
  getProjects: async () => {
    const response = await api.get("/projects/simple/all");
    return response.data;
  },
  deleteProject: async (project) => {
    const response = await api.delete(`/projects/${project.id}`);
    return response.data;
  }
};
const actionIcons = {
  download: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
  "arrow-up": /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 11l5-5m0 0l5 5m-5-5v12" }) }),
  edit: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
  trash: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
  block: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" }) }),
  play: /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }),
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
  ] }),
  preview: /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
  ] })
};
function DynamicTable({
  columns,
  data,
  actionMenuItems = [],
  pageSize = 5,
  pageSizeOptions = [5, 10, 25, 100],
  totalItems = 0,
  showFirstLastButtons = true,
  onActionClick,
  onQueryParamsChange,
  initialSortField = "id",
  initialSortOrder = "asc",
  selectedRowIds = [],
  onSelectionChange
}) {
  const { t } = useTranslation("translation");
  const [columnFilters, setColumnFilters] = useState({});
  const [selectedFilterColumn, setSelectedFilterColumn] = useState("");
  const [currentSort, setCurrentSort] = useState({
    column: initialSortField,
    direction: initialSortOrder
  });
  const [currentPage, setCurrentPage] = useState({ pageSize, pageNumber: 0 });
  const filterTimeoutRef = useRef(null);
  const FILTER_DEBOUNCE_MS = 3e3;
  const buildQueryString = useCallback(() => {
    const queryParams = [];
    Object.entries(columnFilters).filter(([_, val]) => {
      if (!val) return false;
      if (Array.isArray(val) && val.length === 0) return false;
      if (val === "") return false;
      return true;
    }).forEach(([key, val]) => {
      const column2 = columns.find((col) => col.key === key);
      const paramName = column2?.filterKey ?? key;
      const value = Array.isArray(val) ? val.join(",") : String(val);
      queryParams.push(`${paramName}=${encodeURIComponent(value)}`);
    });
    const column = columns.find((col) => col.key === currentSort.column);
    const sortField = column?.sortKey || currentSort.column;
    if (sortField) {
      queryParams.push(`SortField=${sortField}`);
      queryParams.push(`SortOrder=${currentSort.direction}`);
    }
    queryParams.push(`PageSize=${currentPage.pageSize}`);
    queryParams.push(`PageNumber=${currentPage.pageNumber + 1}`);
    return queryParams.join("&");
  }, [columnFilters, currentSort, currentPage, columns]);
  const emitQueryParams = useCallback(() => {
    if (onQueryParamsChange) {
      const queryString = buildQueryString();
      onQueryParamsChange(queryString);
    }
  }, [buildQueryString, onQueryParamsChange]);
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      emitQueryParams();
    }, FILTER_DEBOUNCE_MS);
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [columnFilters, emitQueryParams]);
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }
    emitQueryParams();
  }, [currentSort, currentPage, emitQueryParams]);
  const handleActionClick = (action, item) => {
    if (onActionClick) {
      onActionClick({ action, item });
    }
  };
  const applyFilter = (columnKey, value) => {
    const column = columns.find((col) => col.key === columnKey);
    if (column?.filterType === "select" && column.selectMode === "single" && value === "") {
      setColumnFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[columnKey];
        return newFilters;
      });
    } else {
      setColumnFilters((prev) => ({ ...prev, [columnKey]: value }));
    }
  };
  const onSort = (column) => {
    if (!column.sortable) return;
    if (currentSort.column === column.key) {
      const nextDirection = currentSort.direction === "asc" ? "desc" : "asc";
      setCurrentSort({ column: column.key, direction: nextDirection });
    } else {
      setCurrentSort({ column: column.key, direction: "asc" });
    }
  };
  const onPageChange = (newPage, newPageSize) => {
    setCurrentPage({
      pageSize: newPageSize || currentPage.pageSize,
      pageNumber: newPage
    });
  };
  const getSortIcon = (column) => {
    if (!column.sortable || currentSort.column !== column.key) {
      return "⇅";
    }
    return currentSort.direction === "asc" ? "↑" : "↓";
  };
  const clearAllFilters = () => {
    setColumnFilters({});
    setSelectedFilterColumn("");
  };
  const totalPages = Math.max(1, Math.ceil(totalItems / currentPage.pageSize));
  const startItem = totalItems === 0 ? 0 : currentPage.pageNumber * currentPage.pageSize + 1;
  const endItem = Math.min((currentPage.pageNumber + 1) * currentPage.pageSize, totalItems);
  const filterableColumns = columns.filter((col) => col.filterable);
  const selectedColumn = columns.find((col) => col.key === selectedFilterColumn);
  const hasFilterableColumns = filterableColumns.length > 0;
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const cur = currentPage.pageNumber;
    if (cur <= 3) return [0, 1, 2, 3, 4, "ellipsis", totalPages - 1];
    if (cur >= totalPages - 4) return [0, "ellipsis", ...Array.from({ length: 5 }, (_, i) => totalPages - 5 + i)];
    return [0, "ellipsis", cur - 1, cur, cur + 1, "ellipsis", totalPages - 1];
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl overflow-visible border border-border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05)]", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    hasFilterableColumns && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: selectedFilterColumn,
          onChange: (e) => setSelectedFilterColumn(e.target.value),
          className: "rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[180px]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: t("common.table.filterPlaceholder") }),
            filterableColumns.map((col) => /* @__PURE__ */ jsx("option", { value: col.key, children: col.label }, col.key))
          ]
        }
      ),
      selectedColumn && (selectedColumn.filterType === "text" ? /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: t("common.table.searchIn", { label: selectedColumn.label }),
          value: columnFilters[selectedFilterColumn] ?? "",
          onChange: (e) => applyFilter(selectedFilterColumn, e.target.value),
          className: "rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary placeholder:text-text-secondary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[200px]"
        }
      ) : /* @__PURE__ */ jsxs(
        "select",
        {
          value: Array.isArray(columnFilters[selectedFilterColumn]) ? "" : columnFilters[selectedFilterColumn] ?? "",
          onChange: (e) => applyFilter(selectedFilterColumn, e.target.value),
          className: "rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[180px]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: t("common.table.all") }),
            selectedColumn.filterOptions?.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.id, children: opt.label }, String(opt.id)))
          ]
        }
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: clearAllFilters,
          disabled: !Object.keys(columnFilters).some((k) => {
            const v = columnFilters[k];
            return v !== "" && v != null && (!Array.isArray(v) || v.length > 0);
          }),
          className: "inline-flex items-center justify-center rounded-lg border border-border bg-white p-2.5 text-text-secondary hover:bg-error/10 hover:text-error hover:border-error/30 disabled:opacity-40 disabled:pointer-events-none transition-colors",
          title: t("common.table.clearFilters"),
          "aria-label": t("common.table.clearFilters"),
          children: actionIcons.trash
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-w-0 w-full overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full w-full border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-200/60", children: columns.map((column) => /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-6 py-5 text-left text-sm font-bold text-text-primary uppercase tracking-wider first:pl-8 last:pr-8",
          children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: column.type === "checkbox" ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: data.length > 0 && data.every((r) => selectedRowIds.includes(r.id)),
              onChange: (e) => {
                if (onSelectionChange) {
                  data.forEach((r) => onSelectionChange(r.id, e.target.checked));
                }
              },
              className: "rounded border-gray-300 text-purple focus:ring-purple",
              "aria-label": t("common.table.selectAll")
            }
          ) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
            /* @__PURE__ */ jsx("span", { children: column.label }),
            column.sortable && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onSort(column),
                className: "p-1 rounded text-text-secondary hover:text-text-primary hover:bg-border transition-colors",
                "aria-label": t("common.table.sortBy", { label: column.label }),
                children: getSortIcon(column)
              }
            )
          ] }) })
        },
        column.key
      )) }) }),
      /* @__PURE__ */ jsx("tbody", { children: data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
        "td",
        {
          colSpan: columns.length,
          className: "px-6 py-12 text-center first:pl-8 last:pr-8",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-base text-text-secondary", children: t("common.table.noResults") }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-secondary/80", children: t("common.table.noResultsHint") })
          ]
        }
      ) }) : data.map((row, rowIndex) => /* @__PURE__ */ jsx(
        "tr",
        {
          className: `transition-colors ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-purple-100/20`,
          children: columns.map((column) => /* @__PURE__ */ jsx(
            "td",
            {
              className: "px-6 py-5 text-base text-text-primary first:pl-8 last:pr-8",
              children: column.type === "checkbox" ? /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: selectedRowIds.includes(row.id),
                  onChange: (e) => onSelectionChange?.(row.id, e.target.checked),
                  className: "rounded border-gray-300 text-purple focus:ring-purple",
                  "aria-label": `Selecionar ${row.id}`
                }
              ) : column.type === "action" ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: actionMenuItems.filter((item) => !item.showCondition || item.showCondition(row)).map((item) => {
                const isDelete = item.action === "delete" || item.action === "deleted";
                const icon = actionIcons[item.icon ?? "edit"] ?? actionIcons.edit;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleActionClick(item.action, row),
                    className: `p-2 rounded-lg transition-colors ${isDelete ? "text-error hover:bg-error/10" : "text-purple hover:bg-purple-100"}`,
                    title: item.label,
                    "aria-label": item.label,
                    children: isDelete ? actionIcons.trash : icon
                  },
                  item.action
                );
              }) }) : /* @__PURE__ */ jsx("span", { className: "block min-w-0", children: row[column.key] ?? "—" })
            },
            column.key
          ))
        },
        rowIndex
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full sm:w-auto order-2 sm:order-1", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-base text-text-secondary", children: [
          t("common.table.showing"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: startItem }),
          startItem !== endItem && /* @__PURE__ */ jsxs(Fragment$1, { children: [
            "–",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: endItem })
          ] }),
          " ",
          t("common.table.of"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: totalItems })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-base text-text-secondary", children: t("common.table.perPage") }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: currentPage.pageSize,
              onChange: (e) => onPageChange(0, Number(e.target.value)),
              className: "border border-border/80 rounded-lg px-2.5 py-1.5 text-base text-text-primary bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple outline-none",
              children: pageSizeOptions.map((size) => /* @__PURE__ */ jsx("option", { value: size, children: size }, size))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end order-1 sm:order-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onPageChange(Math.max(0, currentPage.pageNumber - 1)),
            disabled: currentPage.pageNumber === 0,
            className: "p-2 rounded-lg text-text-secondary hover:bg-white hover:text-purple disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent hover:border-border/80",
            "aria-label": "Página anterior",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
          }
        ),
        getPageNumbers().map(
          (page, i) => page === "ellipsis" ? /* @__PURE__ */ jsx("span", { className: "px-2 text-text-secondary", children: "…" }, `e-${i}`) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onPageChange(page),
              className: `min-w-[2.5rem] h-10 rounded-lg text-base font-medium transition-colors ${currentPage.pageNumber === page ? "bg-purple text-white shadow-sm" : "text-text-primary hover:bg-white border border-border/80"}`,
              children: page + 1
            },
            page
          )
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1)),
            disabled: currentPage.pageNumber >= totalPages - 1,
            className: "p-2 rounded-lg text-text-secondary hover:bg-white hover:text-purple disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent hover:border-border/80",
            "aria-label": t("common.table.nextPage"),
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sm:hidden mt-4 pt-4 flex justify-between", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(Math.max(0, currentPage.pageNumber - 1)),
          disabled: currentPage.pageNumber === 0,
          className: "px-4 py-2 rounded-lg border border-border/80 text-sm font-medium text-text-primary bg-white hover:bg-purple-100/50 disabled:opacity-50",
          children: t("common.table.previous")
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "py-2 text-sm text-text-secondary", children: [
        currentPage.pageNumber + 1,
        " / ",
        totalPages
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1)),
          disabled: currentPage.pageNumber >= totalPages - 1,
          className: "px-4 py-2 rounded-lg border border-border/80 text-sm font-medium text-text-primary bg-white hover:bg-purple-100/50 disabled:opacity-50",
          children: t("common.table.next")
        }
      )
    ] })
  ] }) });
}
function Automation() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [rawProjects, setRawProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queryString, setQueryString] = useState("SortField=id&SortOrder=asc&PageNumber=1&PageSize=100");
  const projects = useMemo(
    () => rawProjects.map(
      (p) => ({
        ...p,
        active: p.active ? t("common.status.active") : t("common.status.inactive")
      })
    ),
    [rawProjects, t]
  );
  useEffect(() => {
    loadProjects();
  }, [queryString]);
  const loadProjects = async () => {
    try {
      const result = await projectsService.getAllProjects({ pageNumber: 1, pageSize: 100 }, queryString);
      setRawProjects(result.items);
      setTotalCount(result.totalItems);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };
  const columns = useMemo(
    () => [
      {
        key: "name",
        filterKey: "ProjectName",
        label: t("pages.automation.columnName"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "packageVersionId",
        label: t("pages.automation.columnPackageVersion"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "active",
        filterKey: "Status",
        label: t("pages.automation.columnStatus"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "createdAt",
        label: t("pages.automation.columnCreatedAt"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "actions",
        label: t("common.actions.label"),
        type: "action"
      }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      {
        label: t("pages.automation.edit"),
        action: "edit",
        icon: "edit"
      },
      {
        label: t("pages.automation.delete"),
        action: "delete",
        icon: "trash"
      }
    ],
    [t]
  );
  const handleDelete = async (project) => {
    const confirmed = await confirmDelete({
      itemName: project.name
    });
    if (confirmed) {
      try {
        await projectsService.deleteProject({ id: project.id });
        showToast(t("common.states.success"), t("pages.automation.deleteSuccess"), "success");
        loadProjects();
      } catch (error) {
        showToast(t("common.states.error"), t("pages.automation.deleteError"), "error");
      }
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/project/${event.item.id}`);
        break;
      case "delete":
        await handleDelete(event.item);
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.automation.title") }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/project"),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
            children: t("pages.automation.createProject")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/execution"),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-purple hover:bg-purple/90 shadow-sm hover:shadow transition-all duration-200",
            children: t("pages.automation.execute")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mt-6", children: /* @__PURE__ */ jsx(
      DynamicTable,
      {
        columns,
        data: projects,
        totalItems: totalCount,
        pageSize: 5,
        pageSizeOptions: [5, 10, 25, 100],
        showFirstLastButtons: true,
        actionMenuItems,
        onActionClick: handleActionClick,
        onQueryParamsChange: setQueryString
      }
    ) })
  ] });
}
const _layout_automation = UNSAFE_withComponentProps(function AutomationRoute() {
  return /* @__PURE__ */ jsx(Automation, {});
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_automation
}, Symbol.toStringTag, { value: "Module" }));
const companyUserService = {
  createCompanyUser: async (companyUser) => {
    const response = await api.post(
      "/companyUsers",
      companyUser
    );
    return response.data;
  },
  getAllUsers: async (queryString) => {
    const response = await api.get(
      `/companyUsers?${queryString}`
    );
    console.log(response.data);
    return response.data;
  },
  getRoles: async () => {
    const response = await api.get("/companyUsers/roles");
    return response.data;
  }
};
const usersService = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      return [];
    }
  },
  getByIdUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  createUser: async (user) => {
    console.log(user);
    const response = await api.post("/users", user);
    return response.data;
  },
  updateUser: async (id, user) => {
    const response = await api.patch(`/users/Update/${id}`, user);
    return response.data;
  },
  disabledUser: async (user) => {
    await api.patch(
      `/users/disable/${user.id}?callerEmail=${encodeURIComponent(user.callerEmail)}`,
      {}
    );
  },
  enabledUser: async (user) => {
    await api.patch(
      `/users/enable/${user.id}?callerEmail=${encodeURIComponent(user.callerEmail)}`,
      {}
    );
  }
};
const scheduleService = {
  getAllSchedule: async (queryString) => {
    const response = await api.get(
      `/schedules?${queryString}`
    );
    return response.data;
  },
  getByIdSchedule: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  createSchedule: async (schedule) => {
    const response = await api.post("/schedules", schedule);
    return response.data;
  },
  updateSchedule: async (id, schedule) => {
    const response = await api.patch(`/schedules/${id}`, schedule, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },
  deleteSchedule: async (schedule) => {
    await api.delete(`/schedules/${schedule.id}`);
  }
};
const assetsService = {
  getAllAssets: async (queryString) => {
    const response = await api.get(
      `/assets?${queryString}`
    );
    return response.data;
  },
  getByIdAsset: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },
  createAsset: async (asset) => {
    const response = await api.post("/assets", asset);
    return response.data;
  },
  updateAsset: async (id, asset) => {
    const response = await api.patch(`/assets/${id}`, asset);
    return response.data;
  },
  deleteAsset: async (asset) => {
    const response = await api.delete(`/assets/${asset.id}`);
    return response.data;
  }
};
const queuesService = {
  getAllQueues: async (paginations) => {
    const response = await api.get(
      `/queues/all?PageNumber=${paginations.pageNumber}&PageSize=${paginations.pageSize}&SortField=id`
    );
    return response.data;
  },
  getByIdQueue: async (id) => {
    const response = await api.get(`/queue/${id}`);
    return response.data;
  },
  createQueue: async (queue) => {
    const response = await api.post("/queue", queue);
    return response.data;
  },
  updateQueue: async (id, queue) => {
    const response = await api.patch(`/queue/${id}`, queue);
    return response.data;
  },
  deleteQueue: async (queue) => {
    const response = await api.delete(`/queue/${queue.id}`);
    return response.data;
  }
};
const devicesService = {
  getAllDevices: async (queryString) => {
    const response = await api.get(
      `/machines?${queryString}`
    );
    return response.data;
  },
  getDevices: async () => {
    const response = await api.get("/machines/all");
    return response.data;
  },
  getByIdDevices: async (id) => {
    const response = await api.get(`/machines/${id}`);
    return response.data;
  },
  createDevice: async (device) => {
    const response = await api.post("/machines", device);
    return response.data;
  },
  updateDevice: async (id, device) => {
    const response = await api.patch(`/machines/${id}`, device);
    return response.data;
  },
  deleteDevice: async (device) => {
    const response = await api.delete(`/machines/${device.id}`);
    return response.data;
  }
};
const JOB_STATE = {
  NEW: 0,
  RUNNING: 1,
  STOPPING: 2,
  SUSPENDED: 3,
  PENDING: 4,
  TERMINATING: 5,
  RESUMED: 6,
  SUCCESSFUL: 7,
  FAULTED: 8,
  STOPPED: 9
};
const dashboardService = {
  getDashboardData: async () => {
    try {
      let activeUsersCount = 0;
      try {
        const companyUsersResponse = await companyUserService.getAllUsers("PageNumber=1&PageSize=100");
        const items = companyUsersResponse?.items ?? [];
        activeUsersCount = items.filter((u) => u.userActive === true).length;
      } catch {
        const users = await usersService.getAllUsers();
        activeUsersCount = users.filter((u) => u.enabled === true).length;
      }
      const [jobs, schedules, assets, queues, machines] = await Promise.all([
        jobService.getAllJobs("PageNumber=1&PageSize=100"),
        scheduleService.getAllSchedule("PageNumber=1&PageSize=100"),
        assetsService.getAllAssets("PageNumber=1&PageSize=100"),
        queuesService.getAllQueues({ pageNumber: 1, pageSize: 100 }),
        devicesService.getAllDevices("PageNumber=1&PageSize=100")
      ]);
      const stats = {
        users: activeUsersCount,
        processes: jobs.totalItems ?? jobs.items?.length ?? 0,
        triggers: schedules.totalItems ?? schedules.items?.length ?? 0,
        assets: assets.totalItems ?? assets.items?.length ?? 0,
        queues: queues.totalItems ?? queues.items?.length ?? 0,
        machines: machines.totalItems ?? machines.items?.length ?? 0
      };
      const jobStatuses = {
        running: 0,
        stopping: 0,
        suspended: 0,
        pending: 0,
        terminating: 0,
        resumed: 0
      };
      const jobHistory = {
        successful: 0,
        faulted: 0,
        stopped: 0
      };
      if (jobs.items) {
        jobs.items.forEach((job) => {
          const state = job.state;
          if (state === JOB_STATE.RUNNING) jobStatuses.running++;
          else if (state === JOB_STATE.STOPPING) jobStatuses.stopping++;
          else if (state === JOB_STATE.SUSPENDED) jobStatuses.suspended++;
          else if (state === JOB_STATE.PENDING) jobStatuses.pending++;
          else if (state === JOB_STATE.TERMINATING) jobStatuses.terminating++;
          else if (state === JOB_STATE.RESUMED) jobStatuses.resumed++;
          if (state === JOB_STATE.SUCCESSFUL) jobHistory.successful++;
          else if (state === JOB_STATE.FAULTED) jobHistory.faulted++;
          else if (state === JOB_STATE.STOPPED) jobHistory.stopped++;
        });
      }
      return {
        stats,
        jobStatuses,
        jobHistory
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  }
};
function Dashboard() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ChartComponent, setChartComponent] = useState(null);
  const [stats, setStats] = useState([
    { id: 1, titleKey: "users", value: "0", icon: "/assets/images/svgs/icon-user-male.svg", color: "primary", route: "/users" },
    { id: 2, titleKey: "processes", value: "0", icon: "/assets/images/svgs/icon-briefcase.svg", color: "warning", route: "/jobs" },
    { id: 3, titleKey: "triggers", value: "0", icon: "/assets/images/svgs/icon-mailbox.svg", color: "accent", route: "/scheduled" },
    { id: 4, titleKey: "assets", value: "0", icon: "/assets/images/svgs/icon-favorites.svg", color: "error", route: "/assets" },
    { id: 5, titleKey: "queues", value: "0", icon: "/assets/images/svgs/icon-speech-bubble.svg", color: "success", route: "/queues" },
    { id: 6, titleKey: "machines", value: "0", icon: "/assets/images/svgs/icon-connect.svg", color: "accent", route: "/machines" }
  ]);
  const [jobStatuses, setJobStatuses] = useState([
    { labelKey: "running", value: 0 },
    { labelKey: "stopping", value: 0 },
    { labelKey: "suspended", value: 0 },
    { labelKey: "pending", value: 0 },
    { labelKey: "terminating", value: 0 },
    { labelKey: "resumed", value: 0 }
  ]);
  const [donutChartSeries, setDonutChartSeries] = useState([0, 0, 0]);
  const donutChartOptions = {
    series: donutChartSeries,
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      height: 280,
      toolbar: {
        show: false
      }
    },
    colors: ["#FB7F0D", "#2E186A", "#181717"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent"
        }
      }
    },
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  };
  const areaChartOptions = {
    series: [
      {
        name: "Modernize",
        data: [0, 300, 100, 200, 1200, 100, 500, 100]
      },
      {
        name: "Spike Admin",
        data: [0, 500, 600, 800, 2800, 900, 800, 2200]
      }
    ],
    chart: {
      fontFamily: "inherit",
      foreColor: "#a1aab2",
      height: 300,
      type: "area",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 3
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    colors: ["#FB7F0D", "#13deb9"],
    legend: {
      show: false
    },
    grid: {
      show: true,
      strokeDashArray: 0,
      borderColor: "rgba(0,0,0,0.1)",
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: "category",
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    },
    tooltip: {
      theme: "dark"
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    }
  };
  const colorClasses = {
    primary: {
      bg: "bg-[#ecf2ff]",
      text: "text-[#5d87ff]"
    },
    warning: {
      bg: "bg-[#fef5e5]",
      text: "text-[#ffae1f]"
    },
    accent: {
      bg: "bg-[#e8f7ff]",
      text: "text-[#49beff]"
    },
    error: {
      bg: "bg-[#fdede8]",
      text: "text-[#fa896b]"
    },
    success: {
      bg: "bg-[#e6fffa]",
      text: "text-[#13deb9]"
    }
  };
  useEffect(() => {
    loadDashboardStats();
    if (typeof window !== "undefined") {
      import("react-apexcharts").then((module) => {
        setChartComponent(() => module.default);
      });
    }
  }, []);
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardService.getDashboardData();
      setStats([
        { id: 1, titleKey: "users", value: formatNumber(dashboardData.stats.users), icon: "/assets/images/svgs/icon-user-male.svg", color: "primary", route: "/users" },
        { id: 2, titleKey: "processes", value: formatNumber(dashboardData.stats.processes), icon: "/assets/images/svgs/icon-briefcase.svg", color: "warning", route: "/jobs" },
        { id: 3, titleKey: "triggers", value: formatNumber(dashboardData.stats.triggers), icon: "/assets/images/svgs/icon-mailbox.svg", color: "accent", route: "/scheduled" },
        { id: 4, titleKey: "assets", value: formatNumber(dashboardData.stats.assets), icon: "/assets/images/svgs/icon-favorites.svg", color: "error", route: "/assets" },
        { id: 5, titleKey: "queues", value: formatNumber(dashboardData.stats.queues), icon: "/assets/images/svgs/icon-speech-bubble.svg", color: "success", route: "/queues" },
        { id: 6, titleKey: "machines", value: formatNumber(dashboardData.stats.machines), icon: "/assets/images/svgs/icon-connect.svg", color: "accent", route: "/machines" }
      ]);
      setJobStatuses([
        { labelKey: "running", value: dashboardData.jobStatuses.running },
        { labelKey: "stopping", value: dashboardData.jobStatuses.stopping },
        { labelKey: "suspended", value: dashboardData.jobStatuses.suspended },
        { labelKey: "pending", value: dashboardData.jobStatuses.pending },
        { labelKey: "terminating", value: dashboardData.jobStatuses.terminating },
        { labelKey: "resumed", value: dashboardData.jobStatuses.resumed }
      ]);
      setDonutChartSeries([
        dashboardData.jobHistory.successful,
        dashboardData.jobHistory.faulted,
        dashboardData.jobHistory.stopped
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatNumber = (num) => {
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    }
    if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}k`;
    }
    return num.toString();
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("pages.dashboard.loadingData") })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background min-w-0 max-w-full", children: [
    /* @__PURE__ */ jsx("section", { className: "mb-8 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 min-w-0", children: stats.map((stat) => {
      const colorClass = colorClasses[stat.color] || {
        bg: "bg-gray-100",
        text: "text-gray-500"
      };
      return /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => stat.route && navigate(stat.route),
          className: `min-w-0 ${colorClass.bg} rounded-lg shadow-none p-4 sm:p-6 lg:p-8 cursor-pointer hover:shadow-lg transition-all ${stat.route ? "hover:scale-105" : ""}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: stat.icon,
                alt: t(`pages.dashboard.${stat.titleKey}`),
                width: "40",
                height: "40",
                className: "mb-2 rounded-full",
                style: { objectFit: "contain" },
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsx("h4", { className: `text-sm font-semibold mb-2 mt-2 ${colorClass.text}`, style: { fontSize: "14px", fontWeight: 600 }, children: t(`pages.dashboard.${stat.titleKey}`) }),
            /* @__PURE__ */ jsx("h6", { className: `text-xl font-semibold ${colorClass.text}`, style: { fontSize: "21px", fontWeight: 600, marginTop: "4px" }, children: stat.value })
          ] })
        },
        stat.id
      );
    }) }) }),
    /* @__PURE__ */ jsx("section", { className: "mb-8 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-900", children: t("pages.dashboard.jobStatus") }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/assets/images/svgs/dashboard-dwa/Ellipse 59.svg",
              alt: "",
              className: "w-3 h-3 ml-2",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 min-w-0", children: jobStatuses.map((status, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white border border-gray-200 rounded-lg p-4 text-center flex flex-col justify-between min-w-0",
            style: { minHeight: "230px" },
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-base font-normal", style: { fontSize: "16.85px", lineHeight: "140%" }, children: t(`common.states.${status.labelKey}`) }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-semibold", style: { fontSize: "15.82px", lineHeight: "120%", marginBottom: "30px" }, children: status.value })
            ]
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-6 text-center", children: t("pages.dashboard.jobsHistory") }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/assets/images/svgs/dashboard-dwa/Ellipse 59.svg",
                  alt: "",
                  className: "w-4 h-4",
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
                t("pages.dashboard.successful"),
                " (",
                donutChartSeries[0],
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/assets/images/svgs/dashboard-dwa/Ellipse 73.svg",
                  alt: "",
                  className: "w-4 h-4",
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
                t("pages.dashboard.faulted"),
                " (",
                donutChartSeries[1],
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/assets/images/svgs/dashboard-dwa/Ellipse 72.svg",
                  alt: "",
                  className: "w-4 h-4",
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
                t("pages.dashboard.stopped"),
                " (",
                donutChartSeries[2],
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full", children: ChartComponent ? /* @__PURE__ */ jsx(
            ChartComponent,
            {
              options: donutChartOptions,
              series: donutChartOptions.series,
              type: "donut",
              height: 280
            }
          ) : /* @__PURE__ */ jsx("div", { className: "h-[280px] flex items-center justify-center text-gray-500", children: t("pages.dashboard.loadingChart") }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-1", children: t("pages.dashboard.revenueUpdates") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: t("pages.dashboard.overviewProfit") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/assets/images/svgs/dashboard-dwa/Ellipse 59.svg",
                alt: "",
                className: "w-3 h-3",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("pages.dashboard.modernize") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/assets/images/svgs/dashboard-dwa/Ellipse 73.svg",
                alt: "",
                className: "w-3 h-3",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("pages.dashboard.spikeAdmin") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: ChartComponent ? /* @__PURE__ */ jsx(
        ChartComponent,
        {
          options: areaChartOptions,
          series: areaChartOptions.series,
          type: "area",
          height: 300
        }
      ) : /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center text-gray-500", children: t("pages.dashboard.loadingChart") }) })
    ] }) })
  ] });
}
const _layout_dashboard = UNSAFE_withComponentProps(function DashboardRoute() {
  return /* @__PURE__ */ jsx(Dashboard, {});
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_dashboard
}, Symbol.toStringTag, { value: "Module" }));
const priorityService = {
  getPriority: async () => {
    const response = await api.get("/priorities");
    return response.data;
  }
};
function Execution() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedMachine, setSelectedMachine] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState(0);
  const [jobName, setJobName] = useState("");
  const [parameterRows, setParameterRows] = useState([
    { name: "", type: "", value: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    loadData();
  }, []);
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
      showToast(t("common.states.error"), t("pages.execution.executeError"), "error");
    }
  };
  const addLine = () => {
    setParameterRows([...parameterRows, { name: "", type: "", value: "" }]);
  };
  const removeLine = (index) => {
    if (parameterRows.length > 1) {
      setParameterRows(parameterRows.filter((_, i) => i !== index));
    }
  };
  const updateRow = (index, field, value) => {
    const newRows = [...parameterRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setParameterRows(newRows);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProject === 0 || selectedMachine === 0 || selectedPriority === 0) {
      showToast(t("common.states.error"), t("pages.execution.executeError"), "error");
      return;
    }
    const name = jobName.trim() || `Execution-${Date.now()}`;
    setIsSubmitting(true);
    try {
      const created = await jobService.createJob({
        name,
        projectId: selectedProject,
        priorityId: selectedPriority,
        machineId: selectedMachine
      });
      await jobService.executeJob(created.id);
      showToast(t("common.states.success"), t("pages.execution.executeSuccess"), "success");
      navigate("/jobs");
    } catch (error) {
      const message = error.response?.data?.message || t("pages.execution.executeError");
      showToast(t("common.states.error"), message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/automation"),
          className: "text-primary hover:text-primary/80 mb-4 flex items-center gap-2",
          children: [
            "← ",
            t("pages.execution.backToAutomation")
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: t("pages.execution.title") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: t("pages.execution.jobName") }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: jobName,
            onChange: (e) => setJobName(e.target.value),
            placeholder: t("pages.execution.jobNamePlaceholder"),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
          t("pages.execution.selectProject"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedProject,
            onChange: (e) => setSelectedProject(Number(e.target.value)),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.execution.selectProject") }),
              projects.map((project) => /* @__PURE__ */ jsx("option", { value: project.id, children: project.name }, project.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
          t("pages.execution.selectMachine"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedMachine,
            onChange: (e) => setSelectedMachine(Number(e.target.value)),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.execution.selectMachine") }),
              machines.map((machine) => /* @__PURE__ */ jsx("option", { value: machine.id, children: machine.machineName }, machine.id))
            ]
          }
        ),
        machines.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-amber-600", children: "Nenhuma máquina registrada. O agent precisa estar instalado e conectado na máquina para aparecer aqui." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
          t("pages.execution.selectPriority"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedPriority,
            onChange: (e) => setSelectedPriority(Number(e.target.value)),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: 0, children: t("pages.execution.selectPriority") }),
              priorities.map((priority) => /* @__PURE__ */ jsx("option", { value: priority.id, children: priority.name }, priority.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700", children: [
            t("pages.execution.parameters"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(opcional)" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: addLine,
              className: "flex items-center gap-2 text-primary hover:text-primary/80",
              children: [
                /* @__PURE__ */ jsx(PlusIcon, { className: "w-5 h-5" }),
                t("pages.execution.addParameter")
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: parameterRows.map((row, index) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: t("pages.execution.namePlaceholder"),
              value: row.name,
              onChange: (e) => updateRow(index, "name", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsxs(
            "select",
            {
              value: row.type,
              onChange: (e) => updateRow(index, "type", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: t("pages.execution.selectType") }),
                /* @__PURE__ */ jsx("option", { value: "string", children: t("pages.execution.typeString") }),
                /* @__PURE__ */ jsx("option", { value: "number", children: t("pages.execution.typeNumber") }),
                /* @__PURE__ */ jsx("option", { value: "boolean", children: t("pages.execution.typeBoolean") })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: t("pages.execution.valuePlaceholder"),
              value: row.value,
              onChange: (e) => updateRow(index, "value", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-1", children: parameterRows.length > 1 && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeLine(index),
              className: "text-red-600 hover:text-red-800",
              children: /* @__PURE__ */ jsx(XMarkIcon, { className: "w-5 h-5" })
            }
          ) })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate("/automation"),
            className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",
            children: t("common.buttons.cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting,
            className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
            children: isSubmitting ? "..." : t("pages.execution.execute")
          }
        )
      ] })
    ] })
  ] });
}
const _layout_execution = UNSAFE_withComponentProps(function ExecutionRoute() {
  return /* @__PURE__ */ jsx(Execution, {});
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_execution
}, Symbol.toStringTag, { value: "Module" }));
const _layout_scheduled = UNSAFE_withComponentProps(function ScheduledLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_scheduled
}, Symbol.toStringTag, { value: "Module" }));
const Schedule$1 = lazy(() => import("./Schedule-D91xQ4YN.js"));
const _layout_scheduled_create = UNSAFE_withComponentProps(function ScheduleCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Schedule$1, {})
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_scheduled_create
}, Symbol.toStringTag, { value: "Module" }));
const frequencyService = {
  getFrequency: async () => {
    const response = await api.get("/frequencies");
    return response.data;
  }
};
function formatNextExecution(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return d.toLocaleString(void 0, {
      dateStyle: "short",
      timeStyle: "short"
    });
  } catch {
    return String(value);
  }
}
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
function ScheduledActivities() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState(
    "PageNumber=1&PageSize=10&SortField=nextExecution&SortOrder=asc"
  );
  const [priorities, setPriorities] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: t("pages.scheduled.activityName"),
        filterable: true,
        sortable: true,
        filterType: "text"
      },
      {
        key: "frequencyName",
        label: t("pages.scheduled.frequency"),
        filterable: false,
        sortable: false,
        filterType: "text"
      },
      {
        key: "nextExecution",
        label: t("pages.scheduled.nextExecution"),
        filterable: false,
        sortable: true,
        filterType: "text"
      },
      {
        key: "priorityName",
        label: t("pages.scheduled.priority"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "details",
        label: t("pages.scheduled.details"),
        filterable: false,
        sortable: false,
        filterType: "text"
      },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("common.buttons.edit"), action: "edit", icon: "edit" },
      { label: t("pages.assets.deleted"), action: "deleted", icon: "deleted" }
    ],
    [t]
  );
  useEffect(() => {
    const load = async () => {
      try {
        const [pri, freq] = await Promise.all([
          priorityService.getPriority(),
          frequencyService.getFrequency()
        ]);
        setPriorities(pri ?? []);
        setFrequencies(freq ?? []);
      } catch (e) {
        console.error("Erro ao carregar prioridades/frequências:", e);
      }
    };
    load();
  }, []);
  const loadSchedule = async () => {
    try {
      const result = await scheduleService.getAllSchedule(queryString);
      setTotalItems(result.totalItems ?? 0);
      const items = result.items ?? [];
      setData(
        items.map((x) => {
          const frequency = frequencies.find((f) => f.id === x.frequencyId);
          const priority = priorities.find((p) => p.id === Number(x.priority));
          return {
            id: x.id,
            name: x.name ?? "—",
            frequencyId: x.frequencyId,
            frequencyNameFromApi: frequency?.name ?? "—",
            nextExecution: formatNextExecution(x.nextExecution),
            nextExecutionRaw: x.nextExecution,
            priorityId: Number(x.priority),
            priorityNameFromApi: priority?.name ?? "—",
            details: x.details ?? "—"
          };
        })
      );
    } catch (error) {
      console.error("Erro ao buscar schedules:", error);
    }
  };
  useEffect(() => {
    loadSchedule();
  }, [queryString]);
  useEffect(() => {
    if (priorities.length > 0 || frequencies.length > 0) {
      loadSchedule();
    }
  }, [priorities.length, frequencies.length]);
  const displayData = useMemo(() => {
    return data.map((row) => {
      const freqKey = FREQUENCY_ID_TO_KEY[row.frequencyId] ?? FREQUENCY_KEYS[row.frequencyNameFromApi];
      const priKey = PRIORITY_ID_TO_KEY[row.priorityId] ?? PRIORITY_KEYS[row.priorityNameFromApi];
      return {
        ...row,
        frequencyName: freqKey ? t(`pages.schedule.frequencies.${freqKey}`) : row.frequencyNameFromApi ?? "—",
        priorityName: priKey ? t(`pages.schedule.priorities.${priKey}`) : row.priorityNameFromApi ?? "—"
      };
    });
  }, [data, t]);
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/scheduled/${event.item.id}`);
        break;
      case "deleted":
        const confirmed = await confirmDelete({
          itemName: event.item.name
        });
        if (confirmed) {
          try {
            await scheduleService.deleteSchedule({ id: event.item.id });
            showToast(
              t("common.states.success"),
              t("pages.scheduled.deleteSuccess"),
              "success"
            );
            loadSchedule();
          } catch (error) {
            showToast(
              t("common.states.error"),
              t("pages.scheduled.deleteError"),
              "error"
            );
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.scheduled.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-base text-text-secondary", children: t("pages.scheduled.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-secondary", children: [
        t("pages.scheduled.activitiesCount"),
        " (",
        totalItems,
        ")"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/scheduled/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: t("pages.scheduled.createSchedule")
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mt-4", children: /* @__PURE__ */ jsx(
      DynamicTable,
      {
        columns,
        data: displayData,
        totalItems,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 100],
        showFirstLastButtons: true,
        initialSortField: "nextExecution",
        initialSortOrder: "asc",
        actionMenuItems,
        onActionClick: handleActionClick,
        onQueryParamsChange: setQueryString
      }
    ) })
  ] });
}
const _layout_scheduled__index = UNSAFE_withComponentProps(function ScheduledIndexRoute() {
  return /* @__PURE__ */ jsx(ScheduledActivities, {});
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_scheduled__index
}, Symbol.toStringTag, { value: "Module" }));
const Schedule = lazy(() => import("./Schedule-D91xQ4YN.js"));
const _layout_scheduled_$id = UNSAFE_withComponentProps(function ScheduleEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Schedule, {})
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_scheduled_$id
}, Symbol.toStringTag, { value: "Module" }));
function Device() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("PageNumber=1&PageSize=5&SortField=id&SortOrder=asc");
  const columns = useMemo(
    () => [
      { key: "machineName", label: t("pages.assets.name"), filterable: true, sortable: false, filterType: "text" },
      { key: "environment", label: t("pages.machines.environment"), filterable: true, sortable: false, filterType: "text" },
      { key: "hostName", label: t("pages.machines.hostname"), filterable: true, sortable: false, filterType: "text" },
      { key: "ip", label: t("pages.machines.ip"), filterable: true, sortable: false, filterType: "text" },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("common.buttons.edit"), action: "edit", icon: "edit" },
      { label: t("pages.assets.deleted"), action: "deleted", icon: "block" }
    ],
    [t]
  );
  useEffect(() => {
    loadDevices();
  }, [queryString]);
  const loadDevices = async () => {
    try {
      const result = await devicesService.getAllDevices(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.id,
        machineName: x.machineName,
        environment: x.environment,
        hostName: x.hostName,
        ip: x.ip
      })));
    } catch (error) {
      console.error("Erro ao carregar devices:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/machine/${event.item.id}`);
        break;
      case "deleted":
        const confirmed = await confirmDelete({
          itemName: event.item.hostName
        });
        if (confirmed) {
          try {
            await devicesService.deleteDevice({ id: event.item.id });
            showToast(t("common.states.success"), t("pages.machines.deleteSuccess"), "success");
            loadDevices();
          } catch (error) {
            showToast(t("common.states.error"), t("pages.machines.deleteError"), "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.machines.title") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/machine/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: t("pages.machines.createMachineTemplate")
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
    ) })
  ] });
}
const _layout_machines = UNSAFE_withComponentProps(function MachinesRoute() {
  return /* @__PURE__ */ jsx(Device, {});
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machines
}, Symbol.toStringTag, { value: "Module" }));
const _layout_packages = UNSAFE_withComponentProps(function PackagesLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_packages
}, Symbol.toStringTag, { value: "Module" }));
const PackagesUpload = lazy(() => import("./PackagesUpload-BcxIg2GD.js"));
const _layout_packages_upload = UNSAFE_withComponentProps(function PackagesUploadRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(PackagesUpload, {})
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_packages_upload
}, Symbol.toStringTag, { value: "Module" }));
const packagesService = {
  createPackege: async (pkg) => {
    const response = await api.post("/packages/create", pkg);
    return response.data;
  },
  getAllPackages: async (queryString) => {
    const response = await api.get(
      `/packages/all?${queryString}`
    );
    return response.data;
  },
  getByIdPackage: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  getPackageCompany: async () => {
    const response = await api.get("/packages/company-packages");
    return response.data;
  },
  deletePackage: async (id) => {
    await api.delete(`/packages/${id}`);
  }
};
const LOG = "[packagesVersions]";
const packagesVersionsService = {
  createPackageVersion: async (packageVersion) => {
    const formData = new FormData();
    formData.append("File", packageVersion.file, packageVersion.file.name);
    formData.append("Description", packageVersion.description);
    formData.append("PackageId", packageVersion.packageId.toString());
    formData.append("Version", packageVersion.version ?? "");
    console.log(`${LOG} createPackageVersion: payload`, {
      packageId: packageVersion.packageId,
      version: packageVersion.version,
      description: packageVersion.description,
      fileName: packageVersion.file?.name,
      fileSize: packageVersion.file?.size,
      formDataKeys: Array.from(formData.keys())
    });
    try {
      const response = await api.post(
        "/packageVersions",
        formData,
        { timeout: 12e4 }
        // 2 min; Content-Type é removido pelo interceptor quando data é FormData
      );
      console.log(`${LOG} createPackageVersion: success`, response.status, response.data);
      return response.data;
    } catch (err) {
      const axiosErr = err;
      console.error(`${LOG} createPackageVersion: error`, {
        code: axiosErr?.code,
        message: axiosErr?.message,
        status: axiosErr?.response?.status,
        data: axiosErr?.response?.data
      });
      throw err;
    }
  },
  getDownloadPackage: async (id) => {
    const response = await api.get(`/packageVersions/download/${id}`, {
      responseType: "blob"
    });
    return response.data;
  },
  getByIdPackageVersion: async (packageVersionId) => {
    const response = await api.get(
      `/packageVersions/listPackage/${packageVersionId}`
    );
    return response.data;
  }
};
const fileDownloadService = {
  downloadBlobFile: (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
const PACKAGES_LOG = "[Packages]";
function Packages() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDownload = useModalStore((state) => state.confirmDownload);
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("PageNumber=1&PageSize=5&SortField=id&SortOrder=asc");
  const [showOptions, setShowOptions] = useState(false);
  const columns = useMemo(
    () => [
      { key: "Name", label: t("pages.assets.name"), filterable: true, sortable: false, filterType: "text" },
      { key: "Description", label: t("pages.assets.description"), filterable: true, sortable: false, filterType: "text" },
      { key: "PackageVersion", label: t("pages.automation.columnPackageVersion"), filterable: true, sortable: false, filterType: "text" },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("pages.packages.download"), action: "download", icon: "download" },
      { label: t("pages.packages.upgrade") || "Upgrade", action: "edit", icon: "edit" },
      { label: t("common.actions.delete") || "Excluir", action: "delete", icon: "trash" }
    ],
    [t]
  );
  useEffect(() => {
    loadPackages();
  }, [queryString]);
  const loadPackages = async () => {
    try {
      const result = await packagesService.getAllPackages(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.id,
        Name: x.name,
        Description: x.description,
        PackageVersion: x.packageVersions?.map((v) => v.version).join(", ") ?? "",
        rawPackageVersions: x.packageVersions ?? []
      })));
    } catch (error) {
      console.error("Erro ao carregar packages:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "download":
        await handleDownload(event.item);
        break;
      case "edit":
        handleEdit(event.item);
        break;
      case "delete":
        await handleDelete(event.item);
        break;
    }
  };
  const handleEdit = (item) => {
    console.log(PACKAGES_LOG, "edit (upgrade)", item?.id, item?.Name);
    navigate("/packages/upload", { state: { isNew: false, packageId: item.id } });
  };
  const handleDelete = async (item) => {
    const name = item?.Name ?? `#${item?.id}`;
    console.log(PACKAGES_LOG, "delete", item?.id, name);
    const confirmed = await confirmDelete({ itemName: name });
    if (!confirmed) return;
    try {
      await packagesService.deletePackage(item.id);
      showToast("Success", t("pages.packages.deleteSuccess"), "success");
      loadPackages();
    } catch (error) {
      console.error(PACKAGES_LOG, "delete error", error);
      const res = error?.response;
      const data2 = res?.data;
      const msg = data2?.extensions?.errorDescription ?? data2?.detail ?? data2?.title ?? error?.message ?? t("pages.packages.deleteError");
      showToast("Error", String(msg), "error");
    }
  };
  const handleDownload = async (packageItem) => {
    const selectedVersion = await confirmDownload({
      title: `Download - ${packageItem.Name}`,
      versions: packageItem.rawPackageVersions.map((v) => ({
        id: v.id,
        version: v.version
      }))
    });
    if (selectedVersion) {
      try {
        const blob = await packagesVersionsService.getDownloadPackage(selectedVersion.id);
        const fileName = `v${selectedVersion.version}-${packageItem.Name}.zip`;
        fileDownloadService.downloadBlobFile(blob, fileName);
        showToast("Success", "Download completed successfully", "success");
      } catch (error) {
        showToast("Error", "Failed to download package", "error");
      }
    }
  };
  const handleUpload = (isNew) => {
    navigate("/packages/upload", { state: { isNew } });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.packages.title") }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowOptions(!showOptions),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
            children: [
              t("pages.packages.upload"),
              /* @__PURE__ */ jsx("span", { className: `ml-1 transform transition-transform ${showOptions ? "rotate-180" : ""}`, children: "▼" })
            ]
          }
        ),
        showOptions && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 bg-white rounded-xl shadow-card border border-border z-10 min-w-[120px] py-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                handleUpload(true);
                setShowOptions(false);
              },
              className: "block w-full text-left px-4 py-2.5 text-text-primary hover:bg-gray-50 rounded-t-xl transition-colors",
              children: t("pages.packages.new")
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                handleUpload(false);
                setShowOptions(false);
              },
              className: "block w-full text-left px-4 py-2.5 text-text-primary hover:bg-gray-50 rounded-b-xl transition-colors",
              children: t("pages.packages.upgrade")
            }
          )
        ] })
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
        onQueryParamsChange: setQueryString
      }
    ) })
  ] });
}
const _layout_packages__index = UNSAFE_withComponentProps(function PackagesIndexRoute() {
  return /* @__PURE__ */ jsx(Packages, {});
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_packages__index
}, Symbol.toStringTag, { value: "Module" }));
const _layout_machine = UNSAFE_withComponentProps(function MachineLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine
}, Symbol.toStringTag, { value: "Module" }));
const Machine$1 = lazy(() => import("./Machine-Cr_Q-mKv.js"));
const _layout_machine_create = UNSAFE_withComponentProps(function MachineCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Machine$1, {})
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine_create
}, Symbol.toStringTag, { value: "Module" }));
const Machine = lazy(() => import("./Machine-Cr_Q-mKv.js"));
const _layout_machine_$id = UNSAFE_withComponentProps(function MachineEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Machine, {})
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine_$id
}, Symbol.toStringTag, { value: "Module" }));
const Project$1 = lazy(() => import("./Project-BJ1z-FhY.js"));
const _layout_project = UNSAFE_withComponentProps(function ProjectRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Project$1, {})
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_project
}, Symbol.toStringTag, { value: "Module" }));
const Project = lazy(() => import("./Project-BJ1z-FhY.js"));
const _layout_project_$id = UNSAFE_withComponentProps(function ProjectEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Project, {})
  });
});
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_project_$id
}, Symbol.toStringTag, { value: "Module" }));
const _layout_assets = UNSAFE_withComponentProps(function AssetsLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets
}, Symbol.toStringTag, { value: "Module" }));
const Asset$1 = lazy(() => import("./Asset-C5Wqq5yN.js"));
const _layout_assets_create = UNSAFE_withComponentProps(function AssetCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Asset$1, {})
  });
});
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets_create
}, Symbol.toStringTag, { value: "Module" }));
function AssetsManagement() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("PageNumber=1&PageSize=5&SortField=id&SortOrder=asc");
  const [typeFilterOptions, setTypeFilterOptions] = useState([]);
  const columns = useMemo(
    () => [
      {
        key: "name",
        sortKey: "name",
        label: t("pages.assets.name"),
        filterable: true,
        sortable: false,
        filterType: "text"
      },
      {
        key: "type",
        label: t("pages.assets.type"),
        filterable: true,
        sortable: false,
        filterType: "select",
        selectMode: "multiple",
        filterOptions: typeFilterOptions
      },
      {
        key: "description",
        label: t("pages.assets.description"),
        filterable: false,
        sortable: false
      },
      {
        key: "actions",
        label: t("pages.assets.actions"),
        type: "action"
      }
    ],
    [t, typeFilterOptions]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("pages.assets.edit"), action: "edit", icon: "edit" },
      { label: t("pages.assets.deleted"), action: "deleted", icon: "block" }
    ],
    [t]
  );
  useEffect(() => {
    loadAssets();
  }, [queryString]);
  const loadAssets = async () => {
    try {
      const result = await assetsService.getAllAssets(queryString);
      setTotalItems(result.totalItems);
      const mappedData = result.items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description
      }));
      setData(mappedData);
      setTypeFilterOptions(
        Array.from(new Set(mappedData.map((asset) => asset.type))).map((typeValue) => ({
          id: typeValue,
          label: typeValue
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar assets:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/assets/${event.item.id}`);
        break;
      case "deleted":
        const confirmed = await confirmDelete({
          itemName: event.item.name
        });
        if (confirmed) {
          try {
            await assetsService.deleteAsset({ id: event.item.id });
            showToast(t("common.states.success"), t("pages.assets.deleteSuccess"), "success");
            loadAssets();
          } catch (error) {
            showToast(t("common.states.error"), t("pages.assets.deleteError"), "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.assets.title") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/assets/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: t("pages.assets.createAsset")
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
    ) })
  ] });
}
const _layout_assets__index = UNSAFE_withComponentProps(function AssetsIndexRoute() {
  return /* @__PURE__ */ jsx(AssetsManagement, {});
});
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets__index
}, Symbol.toStringTag, { value: "Module" }));
const Asset = lazy(() => import("./Asset-C5Wqq5yN.js"));
const _layout_assets_$id = UNSAFE_withComponentProps(function AssetEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Asset, {})
  });
});
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets_$id
}, Symbol.toStringTag, { value: "Module" }));
const Realtime = lazy(() => import("./Realtime-41EfQCKS.js"));
const Historical = lazy(() => import("./Historical-BW17vTT4.js"));
function Queues() {
  const { t } = useTranslation("translation");
  const [activeTab, setActiveTab] = useState("realtime");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary mb-6", children: t("pages.queues.title") }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("realtime"),
          className: `px-4 py-2 rounded-md transition-colors ${activeTab === "realtime" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`,
          children: t("pages.queues.realtime")
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("historical"),
          className: `px-4 py-2 rounded-md transition-colors ${activeTab === "historical" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`,
          children: t("pages.queues.historical")
        }
      )
    ] }),
    activeTab === "realtime" && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(Realtime, {}) }),
    activeTab === "historical" && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(Historical, {}) })
  ] });
}
const _layout_queues = UNSAFE_withComponentProps(function QueuesRoute() {
  return /* @__PURE__ */ jsx(Queues, {});
});
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_queues
}, Symbol.toStringTag, { value: "Module" }));
const rolesService = {
  getAllRoles: async () => {
    const response = await api.get("/roles/all");
    return response.data;
  },
  getAllRolesFilter: async (queryString) => {
    const response = await api.get(
      `/roles?${queryString}`
    );
    return response.data;
  },
  getRole: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
  createRole: async (role) => {
    const response = await api.post("/roles", role);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await api.patch(`/roles/${id}`, role);
    return response.data;
  },
  deleteRole: async (role) => {
    const response = await api.delete(`/roles/${role.id}`);
    return response.data;
  }
};
function Roles() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("PageNumber=1&PageSize=5&SortField=id&SortOrder=asc");
  const columns = useMemo(
    () => [
      { key: "name", sortKey: "name", label: t("pages.assets.name"), filterable: true, sortable: false, filterType: "text" },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("common.buttons.edit"), action: "edit", icon: "edit" },
      { label: t("pages.assets.deleted"), action: "deleted", icon: "block" }
    ],
    [t]
  );
  useEffect(() => {
    loadRoles();
  }, [queryString]);
  const loadRoles = async () => {
    try {
      const result = await rolesService.getAllRolesFilter(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.id,
        name: x.name
      })));
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/permissions/${event.item.id}`);
        break;
      case "deleted":
        const confirmed = await confirmDelete({
          itemName: event.item.name
        });
        if (confirmed) {
          try {
            await rolesService.deleteRole({ id: event.item.id });
            showToast("Sucess", "Permission group successfully deleted", "success");
            loadRoles();
          } catch (error) {
            showToast("Error", "Failed to delete role", "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.roles.title") }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/permissions"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: [
            t("pages.roles.addRole"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "ml-1", children: "+" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mt-6", children: /* @__PURE__ */ jsx(
      DynamicTable,
      {
        columns,
        data,
        totalItems,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 100],
        showFirstLastButtons: true,
        actionMenuItems,
        onActionClick: handleActionClick,
        onQueryParamsChange: setQueryString
      }
    ) })
  ] });
}
const _layout_roles = UNSAFE_withComponentProps(function RolesRoute() {
  return /* @__PURE__ */ jsx(Roles, {});
});
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_roles
}, Symbol.toStringTag, { value: "Module" }));
const _layout_users = UNSAFE_withComponentProps(function UsersLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users
}, Symbol.toStringTag, { value: "Module" }));
const User$1 = lazy(() => import("./User-DPdVMEjJ.js"));
const _layout_users_create = UNSAFE_withComponentProps(function UserCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(User$1, {})
  });
});
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users_create
}, Symbol.toStringTag, { value: "Module" }));
function Users() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const confirmEnable = useModalStore((state) => state.confirmEnable);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("SortField=id&SortOrder=asc&PageNumber=1&PageSize=100");
  const [roleFilterOptions, setRoleFilterOptions] = useState([]);
  const columns = useMemo(
    () => [
      { key: "email", sortKey: "User.Email", label: t("pages.users.email"), filterable: true, sortable: true, filterType: "text" },
      { key: "role", label: t("pages.users.role"), filterable: true, sortable: false, filterType: "select", selectMode: "multiple", filterOptions: roleFilterOptions },
      {
        key: "active",
        label: t("pages.automation.columnStatus"),
        filterable: true,
        filterType: "select",
        selectMode: "single",
        sortable: true,
        filterOptions: [
          { id: "true", label: t("common.status.active") },
          { id: "false", label: t("common.status.inactive") }
        ]
      },
      { key: "actions", label: t("common.actions.label"), type: "action" }
    ],
    [t, roleFilterOptions]
  );
  const actionMenuItems = useMemo(
    () => [
      { label: t("common.buttons.edit"), action: "edit", icon: "edit" },
      { label: t("pages.users.disable"), action: "disable", icon: "block", showCondition: (item) => item.activeValue },
      { label: t("pages.users.enable"), action: "enable", icon: "check_circle", showCondition: (item) => !item.activeValue }
    ],
    [t]
  );
  const loadRoles = async () => {
    try {
      const roles = await companyUserService.getRoles();
      setRoleFilterOptions(roles.map((role) => ({ id: role.id, label: role.name })));
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };
  const loadUsers = async () => {
    try {
      const result = await companyUserService.getAllUsers(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.userId,
        email: x.userEmail,
        role: x.userRoles.map((y) => y).join(", ") || "",
        rolesId: x.userRoles?.map((y) => y).join(", ") || "",
        active: x.userActive ? t("common.status.active") : t("common.status.inactive"),
        activeValue: x.userActive
      })));
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/users/${event.item.id}`);
        break;
      case "disable":
        const confirmedDelete = await confirmDelete({
          description: "This action will permanently disable",
          itemName: event.item.email,
          buttonName: "Yes, Disabled"
        });
        if (confirmedDelete) {
          try {
            await usersService.disabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast(t("common.states.success"), t("pages.users.disableSuccess"), "success");
            loadUsers();
          } catch (error) {
            showToast(t("common.states.error"), t("pages.users.disableError"), "error");
          }
        }
        break;
      case "enable":
        const confirmedEnable = await confirmEnable({
          itemName: event.item.email
        });
        if (confirmedEnable) {
          try {
            await usersService.enabledUser({
              id: Number(event.item.id),
              callerEmail: event.item.email
            });
            showToast(t("common.states.success"), t("pages.users.enableSuccess"), "success");
            loadUsers();
          } catch (error) {
            showToast(t("common.states.error"), t("pages.users.enableError"), "error");
          }
        }
        break;
    }
  };
  const loadfunctions = async () => {
    await loadRoles();
    await loadUsers();
  };
  useEffect(() => {
    loadfunctions().then();
  }, [queryString]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: t("pages.users.title") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/users/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: t("pages.users.createUser")
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
    ) })
  ] });
}
const _layout_users__index = UNSAFE_withComponentProps(function UsersIndexRoute() {
  return /* @__PURE__ */ jsx(Users, {});
});
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users__index
}, Symbol.toStringTag, { value: "Module" }));
const User = lazy(() => import("./User-DPdVMEjJ.js"));
const _layout_users_$id = UNSAFE_withComponentProps(function UserEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(User, {})
  });
});
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users_$id
}, Symbol.toStringTag, { value: "Module" }));
const Jobs = lazy(() => import("./Jobs-Bd0kGRV5.js"));
const _layout_jobs = UNSAFE_withComponentProps(function JobsRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Jobs, {})
  });
});
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_jobs
}, Symbol.toStringTag, { value: "Module" }));
const _index = UNSAFE_withComponentProps(function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", {
      replace: true
    });
  }, [navigate]);
  return null;
});
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index
}, Symbol.toStringTag, { value: "Module" }));
const loginService = {
  login: async (auth) => {
    const response = await api.post("/users/authenticate", auth);
    return response.data;
  }
};
function Login() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const showToast = useNotificationStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      email: "admin@ibasolutions.com.br",
      password: "StrongPassword"
    }
  });
  const onSubmit = async (data) => {
    try {
      const auth = {
        email: data.email,
        password: data.password
      };
      const response = await loginService.login(auth);
      tokenService.saveToken(response.token);
      showToast(t("pages.login.success"), t("pages.login.loginSuccess"), "success");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || t("pages.login.loginError");
      showToast(t("pages.login.failure"), message, "error");
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "h-screen w-full flex flex-col lg:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex w-full lg:w-1/2 h-screen bg-gray-100 flex-col relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 z-0", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/svgs/login/image 84.svg",
          alt: "",
          className: "h-auto",
          style: { maxWidth: "100%" },
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center z-10 relative", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/svgs/login/logoNovo.svg",
          alt: "Beanstalk Logo",
          className: "h-auto",
          style: { maxWidth: "300px" },
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 h-screen bg-white flex items-center justify-center relative overflow-hidden py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-[10%] right-[5%] z-0", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/svgs/login/image 86.svg",
          alt: "",
          className: "h-auto",
          style: { maxWidth: "200px" },
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 z-0", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/svgs/login/image 85.png",
          alt: "",
          className: "h-auto",
          style: { maxHeight: "200px" },
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md px-8 z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: t("pages.login.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("pages.login.subtitle") })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-2", children: /* @__PURE__ */ jsx("strong", { children: t("pages.login.email") }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                ...register("email", {
                  required: t("common.validation.emailRequired"),
                  minLength: { value: 6, message: t("common.validation.emailMinLength") }
                }),
                className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm",
                placeholder: t("pages.login.emailPlaceholder")
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: /* @__PURE__ */ jsx("strong", { children: t("pages.login.password") }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                type: "password",
                ...register("password", {
                  required: t("common.validation.passwordRequired")
                }),
                className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm",
                placeholder: t("pages.login.passwordPlaceholder")
              }
            ),
            errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !isValid,
              className: "w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
              children: t("pages.login.signIn")
            }
          ) })
        ] })
      ] })
    ] })
  ] });
}
const login = UNSAFE_withComponentProps(function LoginRoute() {
  return /* @__PURE__ */ jsx(Login, {});
});
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: "Module" }));
async function loader(_args) {
  throw new Response(null, {
    status: 404,
    statusText: "Not Found"
  });
}
const $ = UNSAFE_withComponentProps(function CatchAll() {
  return null;
});
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CpkYSQSv.js", "imports": ["/assets/vendor-react-GjWeapsa.js", "/assets/vendor-router-cHSbYr8A.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-C97Ivi92.js", "imports": ["/assets/vendor-react-GjWeapsa.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/index-DskYDVh7.js", "/assets/notification.service-DGIhKrzX.js", "/assets/modal.service-0dNnnw9p.js"], "css": ["/assets/root-DOcEzcni.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout": { "id": "routes/_layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout-N8L43S_a.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/index-DskYDVh7.js", "/assets/auth.service-DgGuiwR8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.job-details.$id": { "id": "routes/_layout.job-details.$id", "parentId": "routes/_layout", "path": "job-details/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.job-details._id-D6yGG5Qu.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/job.service-Bn0VNBC8.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.permissions": { "id": "routes/_layout.permissions", "parentId": "routes/_layout", "path": "permissions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.permissions-CtQbD_K6.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.permissions.$id": { "id": "routes/_layout.permissions.$id", "parentId": "routes/_layout.permissions", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.permissions._id-CtQbD_K6.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.automation": { "id": "routes/_layout.automation", "parentId": "routes/_layout", "path": "automation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.automation-CvRc_bOh.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/projects.service-DTH5gNiz.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.dashboard": { "id": "routes/_layout.dashboard", "parentId": "routes/_layout", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.dashboard-5-u8bsP2.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/users.service-DV2TtZrl.js", "/assets/job.service-Bn0VNBC8.js", "/assets/schedule.service-C92pRfiQ.js", "/assets/assets.service-F32CX5u3.js", "/assets/queues.service-_ltWKFCw.js", "/assets/devices.service-uF7n0LQ8.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.execution": { "id": "routes/_layout.execution", "parentId": "routes/_layout", "path": "execution", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.execution-CCH-iZkU.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/projects.service-DTH5gNiz.js", "/assets/priority.service-CMxhtK8e.js", "/assets/devices.service-uF7n0LQ8.js", "/assets/job.service-Bn0VNBC8.js", "/assets/notification.service-DGIhKrzX.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled": { "id": "routes/_layout.scheduled", "parentId": "routes/_layout", "path": "scheduled", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled-C0OMyIVK.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled.create": { "id": "routes/_layout.scheduled.create", "parentId": "routes/_layout.scheduled", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled.create-wptu7xVl.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled._index": { "id": "routes/_layout.scheduled._index", "parentId": "routes/_layout.scheduled", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled._index-B2BXq34Q.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/schedule.service-C92pRfiQ.js", "/assets/priority.service-CMxhtK8e.js", "/assets/frequency.service-DLKu-kq6.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled.$id": { "id": "routes/_layout.scheduled.$id", "parentId": "routes/_layout.scheduled", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled._id-d8fYQTkp.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machines": { "id": "routes/_layout.machines", "parentId": "routes/_layout", "path": "machines", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machines-ClFAlb6X.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/devices.service-uF7n0LQ8.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.packages": { "id": "routes/_layout.packages", "parentId": "routes/_layout", "path": "packages", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.packages-DQ7PGlsj.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.packages.upload": { "id": "routes/_layout.packages.upload", "parentId": "routes/_layout.packages", "path": "upload", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.packages.upload-3onnMLZ9.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.packages._index": { "id": "routes/_layout.packages._index", "parentId": "routes/_layout.packages", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.packages._index-fNu0QToz.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/packagesVersions.service-FNVeQxB5.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine": { "id": "routes/_layout.machine", "parentId": "routes/_layout", "path": "machine", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine-DK0vaZuO.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine.create": { "id": "routes/_layout.machine.create", "parentId": "routes/_layout.machine", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine.create-wthY5zDZ.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine.$id": { "id": "routes/_layout.machine.$id", "parentId": "routes/_layout.machine", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine._id-CvGR35Yw.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.project": { "id": "routes/_layout.project", "parentId": "routes/_layout", "path": "project", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.project-Cyt7yIZ8.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.project.$id": { "id": "routes/_layout.project.$id", "parentId": "routes/_layout.project", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.project._id-Cyt7yIZ8.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets": { "id": "routes/_layout.assets", "parentId": "routes/_layout", "path": "assets", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets-Dm1iqAg_.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets.create": { "id": "routes/_layout.assets.create", "parentId": "routes/_layout.assets", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets.create-B5I54Q73.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets._index": { "id": "routes/_layout.assets._index", "parentId": "routes/_layout.assets", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets._index-mkdUVKR_.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/assets.service-F32CX5u3.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets.$id": { "id": "routes/_layout.assets.$id", "parentId": "routes/_layout.assets", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets._id-B5I54Q73.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.queues": { "id": "routes/_layout.queues", "parentId": "routes/_layout", "path": "queues", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.queues-BGf6lsdM.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.roles": { "id": "routes/_layout.roles", "parentId": "routes/_layout", "path": "roles", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.roles-sK2aN2Z_.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/roles.service-CqkRpITf.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users": { "id": "routes/_layout.users", "parentId": "routes/_layout", "path": "users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users-B6cp4Qi5.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users.create": { "id": "routes/_layout.users.create", "parentId": "routes/_layout.users", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users.create-DCs6dxPa.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users._index": { "id": "routes/_layout.users._index", "parentId": "routes/_layout.users", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users._index-DIjVV1pg.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/users.service-DV2TtZrl.js", "/assets/modal.service-0dNnnw9p.js", "/assets/notification.service-DGIhKrzX.js", "/assets/DynamicTable-2EKp7iLd.js", "/assets/api-Cdl3BoFR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users.$id": { "id": "routes/_layout.users.$id", "parentId": "routes/_layout.users", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users._id-rua_KuTv.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.jobs": { "id": "routes/_layout.jobs", "parentId": "routes/_layout", "path": "jobs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.jobs-BtiTvvpF.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/Loading-DtjK9lpy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-DD5DKTuh.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-AW-KpVHU.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js", "/assets/api-Cdl3BoFR.js", "/assets/auth.service-DgGuiwR8.js", "/assets/notification.service-DGIhKrzX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_-iWTWxZMU.js", "imports": ["/assets/vendor-router-cHSbYr8A.js", "/assets/vendor-react-GjWeapsa.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-3df04d09.js", "version": "3df04d09", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": true, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_layout": {
    id: "routes/_layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_layout.job-details.$id": {
    id: "routes/_layout.job-details.$id",
    parentId: "routes/_layout",
    path: "job-details/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_layout.permissions": {
    id: "routes/_layout.permissions",
    parentId: "routes/_layout",
    path: "permissions",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_layout.permissions.$id": {
    id: "routes/_layout.permissions.$id",
    parentId: "routes/_layout.permissions",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_layout.automation": {
    id: "routes/_layout.automation",
    parentId: "routes/_layout",
    path: "automation",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_layout.dashboard": {
    id: "routes/_layout.dashboard",
    parentId: "routes/_layout",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_layout.execution": {
    id: "routes/_layout.execution",
    parentId: "routes/_layout",
    path: "execution",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_layout.scheduled": {
    id: "routes/_layout.scheduled",
    parentId: "routes/_layout",
    path: "scheduled",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_layout.scheduled.create": {
    id: "routes/_layout.scheduled.create",
    parentId: "routes/_layout.scheduled",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_layout.scheduled._index": {
    id: "routes/_layout.scheduled._index",
    parentId: "routes/_layout.scheduled",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_layout.scheduled.$id": {
    id: "routes/_layout.scheduled.$id",
    parentId: "routes/_layout.scheduled",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_layout.machines": {
    id: "routes/_layout.machines",
    parentId: "routes/_layout",
    path: "machines",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/_layout.packages": {
    id: "routes/_layout.packages",
    parentId: "routes/_layout",
    path: "packages",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/_layout.packages.upload": {
    id: "routes/_layout.packages.upload",
    parentId: "routes/_layout.packages",
    path: "upload",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/_layout.packages._index": {
    id: "routes/_layout.packages._index",
    parentId: "routes/_layout.packages",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_layout.machine": {
    id: "routes/_layout.machine",
    parentId: "routes/_layout",
    path: "machine",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_layout.machine.create": {
    id: "routes/_layout.machine.create",
    parentId: "routes/_layout.machine",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/_layout.machine.$id": {
    id: "routes/_layout.machine.$id",
    parentId: "routes/_layout.machine",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/_layout.project": {
    id: "routes/_layout.project",
    parentId: "routes/_layout",
    path: "project",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/_layout.project.$id": {
    id: "routes/_layout.project.$id",
    parentId: "routes/_layout.project",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/_layout.assets": {
    id: "routes/_layout.assets",
    parentId: "routes/_layout",
    path: "assets",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/_layout.assets.create": {
    id: "routes/_layout.assets.create",
    parentId: "routes/_layout.assets",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/_layout.assets._index": {
    id: "routes/_layout.assets._index",
    parentId: "routes/_layout.assets",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route23
  },
  "routes/_layout.assets.$id": {
    id: "routes/_layout.assets.$id",
    parentId: "routes/_layout.assets",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/_layout.queues": {
    id: "routes/_layout.queues",
    parentId: "routes/_layout",
    path: "queues",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/_layout.roles": {
    id: "routes/_layout.roles",
    parentId: "routes/_layout",
    path: "roles",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/_layout.users": {
    id: "routes/_layout.users",
    parentId: "routes/_layout",
    path: "users",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/_layout.users.create": {
    id: "routes/_layout.users.create",
    parentId: "routes/_layout.users",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/_layout.users._index": {
    id: "routes/_layout.users._index",
    parentId: "routes/_layout.users",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route29
  },
  "routes/_layout.users.$id": {
    id: "routes/_layout.users.$id",
    parentId: "routes/_layout.users",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/_layout.jobs": {
    id: "routes/_layout.jobs",
    parentId: "routes/_layout",
    path: "jobs",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route32
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins as A,
  serverManifest as B,
  DynamicTable as D,
  Loading as L,
  api as a,
  priorityService as b,
  packagesService as c,
  devicesService as d,
  packagesVersionsService as e,
  frequencyService as f,
  assetsService as g,
  usersService as h,
  companyUserService as i,
  useModalStore as j,
  jobService as k,
  assetsBuildDirectory as l,
  basename as m,
  future as n,
  ssr as o,
  projectsService as p,
  queuesService as q,
  rolesService as r,
  scheduleService as s,
  isSpaMode as t,
  useNotificationStore as u,
  prerender as v,
  routeDiscovery as w,
  publicPath as x,
  entry as y,
  routes as z
};
