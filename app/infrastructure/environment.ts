/**
 * URL base da API. Requisições vão para /api e o Vite faz proxy para o backend (VITE_API_URL ou localhost:5143).
 * Problemas de upload de zip grande são resolvidos no backend (MaxRequestBodySize + FormOptions), não no proxy.
 */
export const environment = {
  environment: 'development',
  apiUrl: '/api',
};
