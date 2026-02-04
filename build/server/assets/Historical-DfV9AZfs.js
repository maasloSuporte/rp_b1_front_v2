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
function Historical() {
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
      key: "processedItems",
      label: "Processed Items",
      filterable: false,
      sortable: false,
      filterType: "text"
    },
    {
      key: "lastProcessed",
      label: "Last Processed",
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
      label: "View Details",
      action: "view",
      icon: "eye"
    }
  ];
  useEffect(() => {
    loadHistoricalQueues();
  }, [queryString]);
  const loadHistoricalQueues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(queryString);
      const pageNumber = parseInt(params.get("pageNumber") || "1");
      const pageSize = parseInt(params.get("pageSize") || "10");
      const result = await queuesService.getAllQueues({ pageNumber, pageSize });
      const data2 = result || [];
      setTotalItems(data2?.totalItems || 0);
      setData((data2?.items || []).map((x) => ({
        id: x.id,
        name: x.name || "-",
        processedItems: x.processedItems || 0,
        lastProcessed: x.lastProcessed ? new Date(x.lastProcessed).toLocaleString() : "-"
      })));
    } catch (error) {
      console.error("Erro ao carregar histórico de queues:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleActionClick = (event) => {
    switch (event.action) {
      case "view":
        console.log("View historical queue:", event.item);
        break;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(Loading, { text: "Carregando histórico de queues..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-semibold text-text-primary mb-8", children: "Historical Queues" }),
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
  Historical as default
};
