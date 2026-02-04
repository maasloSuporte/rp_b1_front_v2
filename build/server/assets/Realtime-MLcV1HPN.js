import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { q as queuesService, L as Loading, D as DynamicTable } from "./server-build-BQl7k4Fv.js";
import "stream";
import "react-router";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "zustand";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "lucide-react";
import "axios";
import "react-hook-form";
function Realtime() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      key: "name",
      label: "Name",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "status",
      label: "Status",
      filterable: true,
      sortable: false,
      filterType: "text"
    },
    {
      key: "items",
      label: "Items",
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
      label: "View",
      action: "view",
      icon: "eye"
    }
  ];
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
    return /* @__PURE__ */ jsx(Loading, { text: "Carregando queues em tempo real..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-text-primary mb-8", children: "Real Time Queues" }),
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
