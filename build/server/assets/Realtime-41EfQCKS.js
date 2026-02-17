import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { q as queuesService, L as Loading, D as DynamicTable } from "./server-build-CRVtuzGx.js";
import "stream";
import "react-router";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "i18next";
import "zustand";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "lucide-react";
import "axios";
import "react-hook-form";
function Realtime() {
  const { t } = useTranslation("translation");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => [
    { key: "name", label: t("pages.queues.name"), filterable: true, sortable: false, filterType: "text" },
    { key: "status", label: t("pages.queues.status"), filterable: true, sortable: false, filterType: "text" },
    { key: "items", label: t("pages.queues.items"), filterable: false, sortable: false, filterType: "text" },
    { key: "actions", label: t("pages.queues.actions"), type: "action" }
  ], [t]);
  const actionMenuItems = useMemo(() => [
    { label: t("pages.queues.view"), action: "view", icon: "eye" }
  ], [t]);
  useEffect(() => {
    loadQueues();
  }, [queryString]);
  const loadQueues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(queryString);
      const pageNumber = parseInt(params.get("pageNumber") || "1");
      const pageSize = parseInt(params.get("pageSize") || "10");
      const result = await queuesService.getAllQueues({ pageNumber, pageSize });
      setTotalItems(result?.totalItems || 0);
      setData((result?.items || []).map((x) => ({
        id: x.id,
        name: x.name || "-",
        items: x.itemsCount || 0
      })));
    } catch (error) {
      console.error("Erro ao carregar queues:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleActionClick = (event) => {
    switch (event.action) {
      case "view":
        console.log("View queue:", event.item);
        break;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(Loading, { text: t("pages.queues.loadingRealtime") });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-text-primary mb-8", children: t("pages.queues.titleRealtime") }),
    /* @__PURE__ */ jsx("section", { className: "mt-6", children: /* @__PURE__ */ jsx(
      DynamicTable,
      {
        columns,
        data,
        totalItems,
        pageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
        showFirstLastButtons: true,
        actionMenuItems,
        onActionClick: handleActionClick,
        onQueryParamsChange: setQueryString
      }
    ) })
  ] });
}
export {
  Realtime as default
};
