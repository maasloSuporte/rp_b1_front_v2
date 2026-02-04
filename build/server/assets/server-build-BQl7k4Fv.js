import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, useLocation, Link, useParams, useNavigate } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Component, Fragment, useState, useEffect, lazy, Suspense, useRef, useCallback } from "react";
import { create } from "zustand";
import { Transition, Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowDownTrayIcon, XMarkIcon, PowerIcon, ChevronDownIcon, Bars3Icon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
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
          /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-2xl font-semibold leading-8 text-gray-900 mb-4", children: data.title?.trim() || "Tem certeza absoluta?" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-lg text-gray-500", children: [
            data.description?.trim() || "Esta ação excluirá permanentemente",
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
                children: "Cancelar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-xl bg-error px-8 py-3.5 text-base font-medium text-white hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2",
                onClick: () => onClose(true),
                children: data.buttonName?.trim() || "Sim, excluir"
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
    navCap: "DASHBOARDS",
    chipClass: "title-sidebar"
  },
  {
    displayName: "Home",
    iconName: "home",
    route: "/dashboard"
  },
  {
    navCap: "PROJECTS",
    chipClass: "title-sidebar"
  },
  {
    displayName: "Automation",
    iconName: "automation",
    children: [
      {
        displayName: "Automation",
        route: "/automation"
      },
      {
        displayName: "Create Project",
        route: "/project"
      }
    ]
  },
  {
    navCap: "MANAGE",
    chipClass: "title-sidebar"
  },
  {
    displayName: "Manage",
    iconName: "manage",
    children: [
      {
        displayName: "Scheduled",
        chipClass: "children",
        route: "/scheduled"
      },
      {
        displayName: "Jobs",
        chipClass: "children",
        route: "/jobs"
      },
      {
        displayName: "Packages",
        chipClass: "children",
        route: "/packages"
      },
      {
        displayName: "Machines",
        chipClass: "children",
        route: "/machines"
      },
      {
        displayName: "Assets",
        chipClass: "children",
        route: "/assets"
      }
    ]
  },
  {
    navCap: "ADMINISTRATION",
    chipClass: "title-sidebar"
  },
  {
    displayName: "Administration",
    iconName: "administration",
    children: [
      {
        displayName: "Users",
        route: "/users"
      },
      {
        displayName: "Group permissions",
        route: "/roles"
      }
    ]
  }
];
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
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(/* @__PURE__ */ new Set());
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
  const renderNavItem = (item, depth = 0) => {
    if (item.navCap) {
      if (isCollapsed) return null;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "px-5 py-2.5 mt-4 first:mt-2 text-[11px] font-semibold text-white/50 uppercase tracking-widest",
          children: item.navCap
        },
        item.navCap
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
          className: `flex items-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors ${isCollapsed ? "justify-center py-3 px-2.5" : "gap-3 px-5 py-3"}`,
          children: [
            item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return /* @__PURE__ */ jsx(IconComponent, { className: "w-6 h-6 shrink-0 text-white/70" });
            })(),
            !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.displayName })
          ]
        },
        item.displayName
      );
    }
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.displayName || "");
    const active = isActive(item.route);
    const basePadding = isCollapsed ? "justify-center py-3 px-2.5" : "pl-5 gap-3 py-3 pr-5";
    const indent = depth > 0 && !isCollapsed ? { paddingLeft: `${1.25 + depth * 1.25}rem` } : void 0;
    if (isCollapsed && hasChildren) {
      return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => toggleExpand(item),
          style: { cursor: item.disabled ? "not-allowed" : "pointer" },
          className: `w-full flex items-center rounded-lg justify-center py-3 px-2.5 transition-colors ${active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50" : ""}`,
          children: item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 shrink-0 text-white/70" });
          })()
        }
      ) }, item.displayName || item.route);
    }
    return /* @__PURE__ */ jsx("div", { children: item.route && !hasChildren ? /* @__PURE__ */ jsxs(
      Link,
      {
        to: normalizeRoute(item.route) || "#",
        onClick: () => onClose(),
        style: { ...indent, cursor: item.disabled ? "default" : "pointer" },
        className: `flex items-center rounded-lg transition-colors ${basePadding} ${active ? "bg-orange text-white shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50 pointer-events-none" : ""}`,
        children: [
          item.iconName && (() => {
            const IconComponent = getIcon(item.iconName);
            if (!IconComponent) return null;
            return /* @__PURE__ */ jsx(IconComponent, { className: `w-8 h-8 shrink-0 ${active ? "text-white" : "text-white/70"}` });
          })(),
          !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1 font-medium", children: item.displayName })
        ]
      }
    ) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => toggleExpand(item),
          style: { ...indent, cursor: item.disabled ? "not-allowed" : "pointer" },
          className: `w-full flex items-center rounded-lg text-left transition-colors ${basePadding} ${active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"} ${item.disabled ? "opacity-50" : ""}`,
          children: [
            item.iconName && (() => {
              const IconComponent = getIcon(item.iconName);
              if (!IconComponent) return null;
              return /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 shrink-0 text-white/70" });
            })(),
            !isCollapsed && /* @__PURE__ */ jsx("span", { className: "flex-1 font-medium", children: item.displayName }),
            hasChildren && !isCollapsed && /* @__PURE__ */ jsx(
              ChevronDownIcon,
              {
                className: `w-5 h-5 shrink-0 text-white/60 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`
              }
            )
          ]
        }
      ),
      hasChildren && isExpanded && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "mt-1 space-y-1 border-l border-white/10 ml-7 pl-2", children: item.children?.map((child) => renderNavItem(child, depth + 1)) })
    ] }) }, item.displayName || item.route);
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
              style: { cursor: "pointer" },
              className: `flex items-center min-w-0 h-full ${isCollapsed ? "flex-1 justify-center" : "gap-3"}`,
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
              style: { cursor: "pointer" },
              className: "p-2 -m-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors lg:hidden",
              "aria-label": "Fechar menu",
              children: /* @__PURE__ */ jsx(XMarkIcon, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden py-3", children: /* @__PURE__ */ jsx("div", { className: `space-y-3 ${isCollapsed ? "px-2" : "px-0"}`, children: navItems.map((item) => renderNavItem(item)) }) }),
        /* @__PURE__ */ jsx("div", { className: "shrink-0 p-4 border-t border-white/10 bg-purple", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center rounded-xl bg-white/10 transition-[padding] duration-300 ${isCollapsed ? "justify-center p-2.5" : "gap-3 px-4 py-3"}`,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/assets/images/profile/user-1.jpg",
                  alt: "",
                  className: "w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/20",
                  onError: (e) => {
                    const t = e.target;
                    t.src = "data:image/svg+xml," + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.2)"/><path fill="white" d="M20 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 4c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>'
                    );
                  }
                }
              ),
              !isCollapsed && /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-white/80 uppercase tracking-wider truncate", children: "Admin" }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => authService.logout(),
                  style: { cursor: "pointer" },
                  className: "p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0",
                  title: "Sair",
                  children: /* @__PURE__ */ jsx(PowerIcon, { className: "w-5 h-5" })
                }
              )
            ]
          }
        ) })
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
function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);
  const getBreadcrumbName = (path) => {
    const nameMap = {
      dashboard: "Dashboard",
      users: "Users",
      roles: "Roles",
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
    };
    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
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
  // Usa proxy no desenvolvimento
};
const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("Authorization") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  }
};
function JobDetails() {
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
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Carregando detalhes do job..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/jobs"),
          className: "text-primary hover:text-primary/80 mb-4 flex items-center gap-2",
          children: "← Voltar para Jobs"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: "Job Details" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.name || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Hostname" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.hostname || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Project Name" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.projectName || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "State" }),
        /* @__PURE__ */ jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm ${job.state === "Running" ? "bg-green-100 text-green-800" : job.state === "Completed" ? "bg-blue-100 text-blue-800" : job.state === "Failed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`, children: job.state || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.priority || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Package Version" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.packageVersion || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Started At" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-900", children: job.started ? new Date(job.started).toLocaleString() : "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ended At" }),
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
const Permissions$1 = lazy(() => import("./Permissions-bWPC87Zt.js"));
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
const Permissions = lazy(() => import("./Permissions-bWPC87Zt.js"));
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
  edit: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
  trash: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
  block: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" }) })
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
  onQueryParamsChange
}) {
  const [columnFilters, setColumnFilters] = useState({});
  const [selectedFilterColumn, setSelectedFilterColumn] = useState("");
  const [currentSort, setCurrentSort] = useState({
    column: "id",
    direction: "asc"
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
      if (currentSort.direction === "asc") {
        setCurrentSort({ column: "", direction: "desc" });
      } else {
        setCurrentSort({ column: column.key, direction: "desc" });
      }
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
            /* @__PURE__ */ jsx("option", { value: "", children: "Filtrar por..." }),
            filterableColumns.map((col) => /* @__PURE__ */ jsx("option", { value: col.key, children: col.label }, col.key))
          ]
        }
      ),
      selectedColumn && (selectedColumn.filterType === "text" ? /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: `Buscar em ${selectedColumn.label}...`,
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
            /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
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
          title: "Limpar filtros",
          "aria-label": "Limpar filtros",
          children: actionIcons.trash
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-w-0 w-full overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full w-full border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-200/60", children: columns.map((column) => /* @__PURE__ */ jsx(
        "th",
        {
          className: "px-6 py-5 text-left text-sm font-bold text-text-primary uppercase tracking-wider first:pl-8 last:pr-8",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { children: column.label }),
            column.sortable && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onSort(column),
                className: "p-1 rounded text-text-secondary hover:text-text-primary hover:bg-border transition-colors",
                "aria-label": `Ordenar por ${column.label}`,
                children: getSortIcon(column)
              }
            )
          ] })
        },
        column.key
      )) }) }),
      /* @__PURE__ */ jsx("tbody", { children: data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
        "td",
        {
          colSpan: columns.length,
          className: "px-6 py-12 text-center first:pl-8 last:pr-8",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-base text-text-secondary", children: "Nenhum resultado encontrado na busca." }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-secondary/80", children: "Tente ajustar os filtros ou limpar a busca para ver mais resultados." })
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
              children: column.type === "action" ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: actionMenuItems.filter((item) => !item.showCondition || item.showCondition(row)).map((item) => {
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
          "Mostrando ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: startItem }),
          startItem !== endItem && /* @__PURE__ */ jsxs(Fragment$1, { children: [
            "–",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: endItem })
          ] }),
          " ",
          "de ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-primary", children: totalItems })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-base text-text-secondary", children: "Por página" }),
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
            "aria-label": "Próxima página",
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
          children: "Anterior"
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
          children: "Próximo"
        }
      )
    ] })
  ] }) });
}
function Automation() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queryString, setQueryString] = useState("SortField=id&SortOrder=asc&PageNumber=1&PageSize=100");
  useEffect(() => {
    loadProjects();
  }, [queryString]);
  const loadProjects = async () => {
    try {
      const result = await projectsService.getAllProjects({ pageNumber: 1, pageSize: 100 }, queryString);
      setProjects(
        result.items.map((p) => ({
          ...p,
          active: p.active ? "Ativo" : "Inativo"
        }))
      );
      setTotalCount(result.totalItems);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };
  const columns = [
    {
      key: "name",
      filterKey: "ProjectName",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "packageVersionId",
      label: "Package Version",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "active",
      filterKey: "Status",
      label: "Status",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "createdAt",
      label: "Criado em",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "actions",
      label: "Actions",
      type: "action"
    }
  ];
  const handleDelete = async (project) => {
    const confirmed = await confirmDelete({
      itemName: project.name
    });
    if (confirmed) {
      try {
        await projectsService.deleteProject({ id: project.id });
        showToast("Sucess", "Project deleted successfully", "success");
        loadProjects();
      } catch (error) {
        showToast("Error", "Failed to delete project", "error");
      }
    }
  };
  const actionMenuItems = [
    {
      label: "Editar",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Delete",
      action: "delete",
      icon: "trash"
    }
  ];
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Automation" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/project"),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
            children: "Create Project"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/execution"),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-purple hover:bg-purple/90 shadow-sm hover:shadow transition-all duration-200",
            children: "Execute"
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
    const response = await api.patch(`/schedules/${id}`, schedule);
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
      debugger;
      const [users, jobs, schedules, assets, queues, machines] = await Promise.all([
        usersService.getAllUsers(),
        jobService.getAllJobs("PageNumber=1&PageSize=100"),
        // Buscar todos os jobs
        scheduleService.getAllSchedule("PageNumber=1&PageSize=100"),
        // Buscar todos os schedules
        assetsService.getAllAssets("PageNumber=1&PageSize=100"),
        // Buscar todos os assets
        queuesService.getAllQueues({ pageNumber: 1, pageSize: 100 }),
        // Buscar todas as queues
        devicesService.getAllDevices("PageNumber=1&PageSize=100")
        // Buscar todas as machines
      ]);
      const stats = {
        users: users.length,
        processes: jobs.totalItems || jobs.items?.length || 0,
        triggers: schedules.totalItems || schedules.items?.length || 0,
        assets: assets.totalItems || assets.items?.length || 0,
        queues: queues.totalItems || queues.items?.length || 0,
        machines: machines.totalItems || machines.items?.length || 0
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ChartComponent, setChartComponent] = useState(null);
  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Users",
      value: "0",
      icon: "/assets/images/svgs/icon-user-male.svg",
      color: "primary",
      route: "/users"
    },
    {
      id: 2,
      title: "Processes",
      value: "0",
      icon: "/assets/images/svgs/icon-briefcase.svg",
      color: "warning",
      route: "/jobs"
    },
    {
      id: 3,
      title: "Triggers",
      value: "0",
      icon: "/assets/images/svgs/icon-mailbox.svg",
      color: "accent",
      route: "/scheduled"
    },
    {
      id: 4,
      title: "Assets",
      value: "0",
      icon: "/assets/images/svgs/icon-favorites.svg",
      color: "error",
      route: "/assets"
    },
    {
      id: 5,
      title: "Queues",
      value: "0",
      icon: "/assets/images/svgs/icon-speech-bubble.svg",
      color: "success",
      route: "/queues"
    },
    {
      id: 6,
      title: "Machines",
      value: "0",
      icon: "/assets/images/svgs/icon-connect.svg",
      color: "accent",
      route: "/machines"
    }
  ]);
  const [jobStatuses, setJobStatuses] = useState([
    { label: "Running", value: 0 },
    { label: "Stopping", value: 0 },
    { label: "Suspended", value: 0 },
    { label: "Pending", value: 0 },
    { label: "Terminating", value: 0 },
    { label: "Resumed", value: 0 }
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
        {
          id: 1,
          title: "Users",
          value: formatNumber(dashboardData.stats.users),
          icon: "/assets/images/svgs/icon-user-male.svg",
          color: "primary",
          route: "/users"
        },
        {
          id: 2,
          title: "Processes",
          value: formatNumber(dashboardData.stats.processes),
          icon: "/assets/images/svgs/icon-briefcase.svg",
          color: "warning",
          route: "/jobs"
        },
        {
          id: 3,
          title: "Triggers",
          value: formatNumber(dashboardData.stats.triggers),
          icon: "/assets/images/svgs/icon-mailbox.svg",
          color: "accent",
          route: "/scheduled"
        },
        {
          id: 4,
          title: "Assets",
          value: formatNumber(dashboardData.stats.assets),
          icon: "/assets/images/svgs/icon-favorites.svg",
          color: "error",
          route: "/assets"
        },
        {
          id: 5,
          title: "Queues",
          value: formatNumber(dashboardData.stats.queues),
          icon: "/assets/images/svgs/icon-speech-bubble.svg",
          color: "success",
          route: "/queues"
        },
        {
          id: 6,
          title: "Machines",
          value: formatNumber(dashboardData.stats.machines),
          icon: "/assets/images/svgs/icon-connect.svg",
          color: "accent",
          route: "/machines"
        }
      ]);
      setJobStatuses([
        { label: "Running", value: dashboardData.jobStatuses.running },
        { label: "Stopping", value: dashboardData.jobStatuses.stopping },
        { label: "Suspended", value: dashboardData.jobStatuses.suspended },
        { label: "Pending", value: dashboardData.jobStatuses.pending },
        { label: "Terminating", value: dashboardData.jobStatuses.terminating },
        { label: "Resumed", value: dashboardData.jobStatuses.resumed }
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
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Carregando dados do dashboard..." })
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
                alt: stat.title,
                width: "40",
                height: "40",
                className: "mb-2 rounded-full",
                style: { objectFit: "contain" },
                onError: (e) => {
                  console.error("Failed to load icon:", stat.icon);
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsx("h4", { className: `text-sm font-semibold mb-2 mt-2 ${colorClass.text}`, style: { fontSize: "14px", fontWeight: 600 }, children: stat.title }),
            /* @__PURE__ */ jsx("h6", { className: `text-xl font-semibold ${colorClass.text}`, style: { fontSize: "21px", fontWeight: 600, marginTop: "4px" }, children: stat.value })
          ] })
        },
        stat.id
      );
    }) }) }),
    /* @__PURE__ */ jsx("section", { className: "mb-8 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-900", children: "Job Status" }),
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
              /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-base font-normal", style: { fontSize: "16.85px", lineHeight: "140%" }, children: status.label }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-semibold", style: { fontSize: "15.82px", lineHeight: "120%", marginBottom: "30px" }, children: status.value })
            ]
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-6 text-center", children: "Jobs History" }),
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
                "Successful (",
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
                "Faulted (",
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
                "Stopped (",
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
          ) : /* @__PURE__ */ jsx("div", { className: "h-[280px] flex items-center justify-center text-gray-500", children: "Carregando gráfico..." }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-1", children: "Revenue updates" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "Overview of Profit" }),
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
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Modernize" })
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
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Spike Admin" })
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
      ) : /* @__PURE__ */ jsx("div", { className: "h-[300px] flex items-center justify-center text-gray-500", children: "Carregando gráfico..." }) })
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
function Execution() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [parameterRows, setParameterRows] = useState([
    { name: "", type: "", value: "" }
  ]);
  useEffect(() => {
    loadProjects();
  }, []);
  const loadProjects = async () => {
    try {
      const result = await projectsService.getProjects();
      setProjects(result);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
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
    console.log("Executar projeto:", selectedProject, parameterRows);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/automation"),
          className: "text-primary hover:text-primary/80 mb-4 flex items-center gap-2",
          children: "← Voltar para Automation"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary", children: "Execution" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
          "Select Project ",
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
              /* @__PURE__ */ jsx("option", { value: 0, children: "Select a project" }),
              projects.map((project) => /* @__PURE__ */ jsx("option", { value: project.id, children: project.name }, project.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Parameters" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: addLine,
              className: "flex items-center gap-2 text-primary hover:text-primary/80",
              children: [
                /* @__PURE__ */ jsx(PlusIcon, { className: "w-5 h-5" }),
                "Add Parameter"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: parameterRows.map((row, index) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Name",
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
                /* @__PURE__ */ jsx("option", { value: "", children: "Select type" }),
                /* @__PURE__ */ jsx("option", { value: "string", children: "String" }),
                /* @__PURE__ */ jsx("option", { value: "number", children: "Number" }),
                /* @__PURE__ */ jsx("option", { value: "boolean", children: "Boolean" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Value",
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
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90",
            children: "Execute"
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
const Schedule$1 = lazy(() => import("./Schedule-BNG68dUw.js"));
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
function ScheduledActivities() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const columns = [
    {
      key: "Name",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "Priority",
      label: "Priority",
      filterable: false,
      sortable: false,
      filterType: "text"
    },
    {
      key: "NextExecution",
      label: "Next execution",
      filterable: false,
      sortable: true,
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
      label: "Edit",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Deleted",
      action: "deleted",
      icon: "deleted"
    }
  ];
  useEffect(() => {
    loadSchedule();
  }, [queryString]);
  const loadSchedule = async () => {
    try {
      const result = await scheduleService.getAllSchedule(queryString);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.id,
        Name: x.name,
        Priority: x.priority,
        NextExecution: x.nextExecution
      })));
    } catch (error) {
      console.error("Erro ao buscar schedules:", error);
    }
  };
  const handleActionClick = async (event) => {
    switch (event.action) {
      case "edit":
        navigate(`/scheduled/${event.item.id}`);
        break;
      case "deleted":
        const confirmed = await confirmDelete({
          itemName: event.item.Name
        });
        if (confirmed) {
          try {
            await scheduleService.deleteSchedule({ id: event.item.id });
            showToast("Sucess", "Schedule deleted successfully", "success");
            loadSchedule();
          } catch (error) {
            showToast("Error", "Failed to delete schedule", "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Schedules" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/scheduled/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: "Create Schedule"
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
const _layout_scheduled__index = UNSAFE_withComponentProps(function ScheduledIndexRoute() {
  return /* @__PURE__ */ jsx(ScheduledActivities, {});
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_scheduled__index
}, Symbol.toStringTag, { value: "Module" }));
const Schedule = lazy(() => import("./Schedule-BNG68dUw.js"));
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
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const columns = [
    {
      key: "machineName",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "environment",
      label: "Environment",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "hostName",
      label: "Hostname",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "ip",
      label: "IP",
      filterable: true,
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
      label: "Edit",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Deleted",
      action: "deleted",
      icon: "block"
    }
  ];
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
            showToast("Sucess", "Machine deleted successfully", "success");
            loadDevices();
          } catch (error) {
            showToast("Error", "Failed to delete machine", "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Machines" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/machine/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: "Create Machine Template"
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
const packagesService = {
  createPackege: async (pkg) => {
    const response = await api.post("/packages", pkg);
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
  }
};
const packagesVersionsService = {
  createPackageVersion: async (packageVersion) => {
    const formData = new FormData();
    formData.append("File", packageVersion.file, packageVersion.file.name);
    const params = new URLSearchParams();
    params.append("Description", packageVersion.description);
    params.append("PackageId", packageVersion.packageId.toString());
    params.append("Version", packageVersion.version);
    const response = await api.post(
      `/packageVersions?${params.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
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
function Packages() {
  const navigate = useNavigate();
  const confirmDownload = useModalStore((state) => state.confirmDownload);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const columns = [
    {
      key: "Name",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "Description",
      label: "Description",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "PackageVersion",
      label: "PackageVersion",
      filterable: true,
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
      label: "Download",
      action: "download",
      icon: "download"
    }
  ];
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Packages" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowOptions(!showOptions),
            className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
            children: [
              "Upload",
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
              children: "New"
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
              children: "Upgrade"
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
const _layout_packages = UNSAFE_withComponentProps(function PackagesRoute() {
  return /* @__PURE__ */ jsx(Packages, {});
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_packages
}, Symbol.toStringTag, { value: "Module" }));
const PackagesUpload = lazy(() => import("./PackagesUpload-BeqknIR4.js"));
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
const _layout_machine = UNSAFE_withComponentProps(function MachineLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine
}, Symbol.toStringTag, { value: "Module" }));
const Machine$1 = lazy(() => import("./Machine-CV3hMOMV.js"));
const _layout_machine_create = UNSAFE_withComponentProps(function MachineCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Machine$1, {})
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine_create
}, Symbol.toStringTag, { value: "Module" }));
const Machine = lazy(() => import("./Machine-CV3hMOMV.js"));
const _layout_machine_$id = UNSAFE_withComponentProps(function MachineEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Machine, {})
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_machine_$id
}, Symbol.toStringTag, { value: "Module" }));
const Project$1 = lazy(() => import("./Project-DEmqW6Wn.js"));
const _layout_project = UNSAFE_withComponentProps(function ProjectRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Project$1, {})
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_project
}, Symbol.toStringTag, { value: "Module" }));
const Project = lazy(() => import("./Project-DEmqW6Wn.js"));
const _layout_project_$id = UNSAFE_withComponentProps(function ProjectEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Project, {})
  });
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_project_$id
}, Symbol.toStringTag, { value: "Module" }));
const _layout_assets = UNSAFE_withComponentProps(function AssetsLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets
}, Symbol.toStringTag, { value: "Module" }));
const Asset$1 = lazy(() => import("./Asset-Cgjihhoe.js"));
const _layout_assets_create = UNSAFE_withComponentProps(function AssetCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Asset$1, {})
  });
});
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets_create
}, Symbol.toStringTag, { value: "Module" }));
function AssetsManagement() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const columns = [
    {
      key: "name",
      sortKey: "name",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "type",
      label: "Type",
      filterable: true,
      sortable: false,
      filterType: "select",
      selectMode: "multiple",
      filterOptions: []
    },
    {
      key: "description",
      label: "Description",
      filterable: false,
      sortable: false
    },
    {
      key: "actions",
      label: "Actions",
      type: "action"
    }
  ];
  const actionMenuItems = [
    {
      label: "Edit",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Deleted",
      action: "deleted",
      icon: "block"
    }
  ];
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
      const typeColumn = columns.find((col) => col.key === "type");
      if (typeColumn) {
        typeColumn.filterOptions = Array.from(new Set(mappedData.map((asset) => asset.type))).map((typeValue) => ({
          id: typeValue,
          label: typeValue
        }));
      }
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
            showToast("Sucess", "Asset deleted successfully", "success");
            loadAssets();
          } catch (error) {
            showToast("Error", "Failed to delete asset", "error");
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Assets" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/assets/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: "Create Asset"
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
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets__index
}, Symbol.toStringTag, { value: "Module" }));
const Asset = lazy(() => import("./Asset-Cgjihhoe.js"));
const _layout_assets_$id = UNSAFE_withComponentProps(function AssetEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Asset, {})
  });
});
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_assets_$id
}, Symbol.toStringTag, { value: "Module" }));
const Realtime = lazy(() => import("./Realtime-MLcV1HPN.js"));
const Historical = lazy(() => import("./Historical-DfV9AZfs.js"));
function Queues() {
  const [activeTab, setActiveTab] = useState("realtime");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold text-text-primary mb-6", children: "Queues" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("realtime"),
          className: `px-4 py-2 rounded-md transition-colors ${activeTab === "realtime" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`,
          children: "Real time"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("historical"),
          className: `px-4 py-2 rounded-md transition-colors ${activeTab === "historical" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`,
          children: "Historical"
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
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const columns = [
    {
      key: "name",
      sortKey: "name",
      label: "Name",
      filterable: true,
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
      label: "Edit",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Deleted",
      action: "deleted",
      icon: "block"
    }
  ];
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Roles" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/permissions"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: [
            "Add role ",
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
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_roles
}, Symbol.toStringTag, { value: "Module" }));
const _layout_users = UNSAFE_withComponentProps(function UsersLayoutRoute() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users
}, Symbol.toStringTag, { value: "Module" }));
const User$1 = lazy(() => import("./User-BoZRYOlE.js"));
const _layout_users_create = UNSAFE_withComponentProps(function UserCreateRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(User$1, {})
  });
});
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users_create
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
function Users() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const confirmEnable = useModalStore((state) => state.confirmEnable);
  const showToast = useNotificationStore((state) => state.showToast);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("SortField=id&SortOrder=asc&PageNumber=1&PageSize=100");
  const columns = [
    {
      key: "email",
      sortKey: "User.Email",
      label: "Email",
      filterable: true,
      sortable: true,
      filterType: "text"
    },
    {
      key: "role",
      label: "Role",
      filterable: true,
      sortable: false,
      filterType: "select",
      selectMode: "multiple",
      filterOptions: []
    },
    {
      key: "active",
      label: "Status",
      filterable: true,
      filterType: "select",
      selectMode: "single",
      sortable: true,
      filterOptions: [
        { id: "true", label: "Ativo" },
        { id: "false", label: "Inativo" }
      ]
    },
    {
      key: "actions",
      label: "Actions",
      type: "action"
    }
  ];
  const actionMenuItems = [
    {
      label: "Editar",
      action: "edit",
      icon: "edit"
    },
    {
      label: "Desativar",
      action: "disable",
      icon: "block",
      showCondition: (item) => item.activeValue
    },
    {
      label: "Ativar",
      action: "enable",
      icon: "check_circle",
      showCondition: (item) => !item.activeValue
    }
  ];
  const loadRoles = async () => {
    try {
      const roles = await companyUserService.getRoles();
      const roleColumn = columns.find((col) => col.key === "rolesId");
      if (roleColumn) {
        roleColumn.filterOptions = roles.map((role) => ({
          id: role.id,
          label: role.name
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };
  const loadUsers = async () => {
    try {
      const result = await companyUserService.getAllUsers(queryString);
      console.log(result);
      setTotalItems(result.totalItems);
      setData(result.items.map((x) => ({
        id: x.userId,
        email: x.userEmail,
        role: x.userRoles.map((y) => y).join(", ") || "",
        rolesId: x.userRoles?.map((y) => y).join(", ") || "",
        active: x.userActive ? "Ativo" : "Inativo",
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
            showToast("Success", "User successfully disabled", "success");
            loadUsers();
          } catch (error) {
            showToast("Error", "Failed to disable user", "error");
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
            showToast("Success", "User successfully active", "success");
            loadUsers();
          } catch (error) {
            showToast("Error", "Failed to enable user", "error");
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl font-semibold text-text-primary", children: "Users" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/users/create"),
          className: "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-white bg-orange hover:bg-orange/90 shadow-sm hover:shadow transition-all duration-200",
          children: "Create User"
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
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users__index
}, Symbol.toStringTag, { value: "Module" }));
const User = lazy(() => import("./User-BoZRYOlE.js"));
const _layout_users_$id = UNSAFE_withComponentProps(function UserEditRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(User, {})
  });
});
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout_users_$id
}, Symbol.toStringTag, { value: "Module" }));
const Jobs = lazy(() => import("./Jobs-CBfFeKr_.js"));
const _layout_jobs = UNSAFE_withComponentProps(function JobsRoute() {
  return /* @__PURE__ */ jsx(Suspense, {
    fallback: /* @__PURE__ */ jsx(Loading, {}),
    children: /* @__PURE__ */ jsx(Jobs, {})
  });
});
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
      showToast("Sucess", "Login bem-sucedido", "success");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao realizar login";
      showToast("Falha", message, "error");
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
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Welcome to Beanstalk" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Orchestrate Efficiency" })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 mb-2", children: /* @__PURE__ */ jsx("strong", { children: "Email" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                ...register("email", {
                  required: "Email is required",
                  minLength: { value: 6, message: "Email should be at least 6 characters" }
                }),
                className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm",
                placeholder: "Email address"
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 mb-2", children: /* @__PURE__ */ jsx("strong", { children: "Password" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                type: "password",
                ...register("password", {
                  required: "Password is required"
                }),
                className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm",
                placeholder: "Password"
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
              children: "Sign In"
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
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BbHfA01h.js", "imports": ["/assets/vendor-react-D3RE0R8o.js", "/assets/vendor-router-C5YTkdq4.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-gZIsm-TS.js", "imports": ["/assets/vendor-react-D3RE0R8o.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/notification.service-CvsIel6B.js", "/assets/modal.service-DONi3Oau.js"], "css": ["/assets/root-lPEFNc1j.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout": { "id": "routes/_layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout-BwOYCGl7.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/auth.service-DgGuiwR8.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.job-details.$id": { "id": "routes/_layout.job-details.$id", "parentId": "routes/_layout", "path": "job-details/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.job-details._id-MyPS_jQD.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/job.service-KAjP6H4k.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.permissions": { "id": "routes/_layout.permissions", "parentId": "routes/_layout", "path": "permissions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.permissions-CAl8KFCo.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.permissions.$id": { "id": "routes/_layout.permissions.$id", "parentId": "routes/_layout.permissions", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.permissions._id-CAl8KFCo.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.automation": { "id": "routes/_layout.automation", "parentId": "routes/_layout", "path": "automation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.automation-CC5X8Ot7.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/projects.service-AnNXoBpb.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.dashboard": { "id": "routes/_layout.dashboard", "parentId": "routes/_layout", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.dashboard-Dts1RHFD.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/users.service-CI0k8rR4.js", "/assets/job.service-KAjP6H4k.js", "/assets/schedule.service-DkpaHhKp.js", "/assets/assets.service-D2l1yFxQ.js", "/assets/queues.service-DVY62-w_.js", "/assets/devices.service-BEkRjjz1.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.execution": { "id": "routes/_layout.execution", "parentId": "routes/_layout", "path": "execution", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.execution-DoydIAdb.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/projects.service-AnNXoBpb.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled": { "id": "routes/_layout.scheduled", "parentId": "routes/_layout", "path": "scheduled", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled-CUu_c5gw.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled.create": { "id": "routes/_layout.scheduled.create", "parentId": "routes/_layout.scheduled", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled.create-CFITex6_.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled._index": { "id": "routes/_layout.scheduled._index", "parentId": "routes/_layout.scheduled", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled._index-CqRo_umU.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/schedule.service-DkpaHhKp.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.scheduled.$id": { "id": "routes/_layout.scheduled.$id", "parentId": "routes/_layout.scheduled", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.scheduled._id-CVv59OiQ.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machines": { "id": "routes/_layout.machines", "parentId": "routes/_layout", "path": "machines", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machines-DijuNxfT.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/devices.service-BEkRjjz1.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.packages": { "id": "routes/_layout.packages", "parentId": "routes/_layout", "path": "packages", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.packages-C7kB-u4S.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/packagesVersions.service-Di9Xz39b.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.packages.upload": { "id": "routes/_layout.packages.upload", "parentId": "routes/_layout.packages", "path": "upload", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.packages.upload-vRQBxLtx.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine": { "id": "routes/_layout.machine", "parentId": "routes/_layout", "path": "machine", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine-_vvzX1B_.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine.create": { "id": "routes/_layout.machine.create", "parentId": "routes/_layout.machine", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine.create-Br1lcaAb.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.machine.$id": { "id": "routes/_layout.machine.$id", "parentId": "routes/_layout.machine", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.machine._id-UfTvnAYe.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.project": { "id": "routes/_layout.project", "parentId": "routes/_layout", "path": "project", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.project-mcct6-mj.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.project.$id": { "id": "routes/_layout.project.$id", "parentId": "routes/_layout.project", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.project._id-mcct6-mj.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets": { "id": "routes/_layout.assets", "parentId": "routes/_layout", "path": "assets", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets-tZDFb5eD.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets.create": { "id": "routes/_layout.assets.create", "parentId": "routes/_layout.assets", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets.create-Bdtecl_Z.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets._index": { "id": "routes/_layout.assets._index", "parentId": "routes/_layout.assets", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets._index-CUmKEpcK.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/assets.service-D2l1yFxQ.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.assets.$id": { "id": "routes/_layout.assets.$id", "parentId": "routes/_layout.assets", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.assets._id-Bdtecl_Z.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.queues": { "id": "routes/_layout.queues", "parentId": "routes/_layout", "path": "queues", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.queues-BBUZjuz_.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.roles": { "id": "routes/_layout.roles", "parentId": "routes/_layout", "path": "roles", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.roles-CVAhMF-R.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/roles.service-CRlzX88Y.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users": { "id": "routes/_layout.users", "parentId": "routes/_layout", "path": "users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users-BN7OaCMo.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users.create": { "id": "routes/_layout.users.create", "parentId": "routes/_layout.users", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users.create-DM8I8IK8.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users._index": { "id": "routes/_layout.users._index", "parentId": "routes/_layout.users", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users._index-99yb4OZ4.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/companyUser.service-BerwkOpn.js", "/assets/users.service-CI0k8rR4.js", "/assets/modal.service-DONi3Oau.js", "/assets/notification.service-CvsIel6B.js", "/assets/DynamicTable-BPyWbqtX.js", "/assets/api-BB9j10S9.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.users.$id": { "id": "routes/_layout.users.$id", "parentId": "routes/_layout.users", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.users._id-KcHg8ba6.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout.jobs": { "id": "routes/_layout.jobs", "parentId": "routes/_layout", "path": "jobs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout.jobs-cMw290Xo.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/Loading-Cgm95zmF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-BA34bb19.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-Cj3AaDCA.js", "imports": ["/assets/vendor-router-C5YTkdq4.js", "/assets/vendor-react-D3RE0R8o.js", "/assets/api-BB9j10S9.js", "/assets/auth.service-DgGuiwR8.js", "/assets/notification.service-CvsIel6B.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-b57c6330.js", "version": "b57c6330", "sri": void 0 };
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
  "routes/_layout.machine": {
    id: "routes/_layout.machine",
    parentId: "routes/_layout",
    path: "machine",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_layout.machine.create": {
    id: "routes/_layout.machine.create",
    parentId: "routes/_layout.machine",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_layout.machine.$id": {
    id: "routes/_layout.machine.$id",
    parentId: "routes/_layout.machine",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/_layout.project": {
    id: "routes/_layout.project",
    parentId: "routes/_layout",
    path: "project",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/_layout.project.$id": {
    id: "routes/_layout.project.$id",
    parentId: "routes/_layout.project",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/_layout.assets": {
    id: "routes/_layout.assets",
    parentId: "routes/_layout",
    path: "assets",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/_layout.assets.create": {
    id: "routes/_layout.assets.create",
    parentId: "routes/_layout.assets",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/_layout.assets._index": {
    id: "routes/_layout.assets._index",
    parentId: "routes/_layout.assets",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route22
  },
  "routes/_layout.assets.$id": {
    id: "routes/_layout.assets.$id",
    parentId: "routes/_layout.assets",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/_layout.queues": {
    id: "routes/_layout.queues",
    parentId: "routes/_layout",
    path: "queues",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/_layout.roles": {
    id: "routes/_layout.roles",
    parentId: "routes/_layout",
    path: "roles",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/_layout.users": {
    id: "routes/_layout.users",
    parentId: "routes/_layout",
    path: "users",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/_layout.users.create": {
    id: "routes/_layout.users.create",
    parentId: "routes/_layout.users",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/_layout.users._index": {
    id: "routes/_layout.users._index",
    parentId: "routes/_layout.users",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route28
  },
  "routes/_layout.users.$id": {
    id: "routes/_layout.users.$id",
    parentId: "routes/_layout.users",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/_layout.jobs": {
    id: "routes/_layout.jobs",
    parentId: "routes/_layout",
    path: "jobs",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route31
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  }
};
const allowedActionOrigins = false;
export {
  DynamicTable as D,
  Loading as L,
  api as a,
  packagesService as b,
  packagesVersionsService as c,
  devicesService as d,
  assetsService as e,
  usersService as f,
  companyUserService as g,
  assetsBuildDirectory as h,
  basename as i,
  jobService as j,
  future as k,
  ssr as l,
  isSpaMode as m,
  prerender as n,
  routeDiscovery as o,
  projectsService as p,
  queuesService as q,
  rolesService as r,
  scheduleService as s,
  publicPath as t,
  useNotificationStore as u,
  entry as v,
  routes as w,
  allowedActionOrigins as x,
  serverManifest as y
};
