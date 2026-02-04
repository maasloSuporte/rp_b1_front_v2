import { a as api } from "./server-build-BQl7k4Fv.js";
const priorityService = {
  getPriority: async () => {
    const response = await api.get("/priorities");
    return response.data;
  }
};
export {
  priorityService as p
};
