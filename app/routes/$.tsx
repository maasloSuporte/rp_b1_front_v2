import type { LoaderFunctionArgs } from 'react-router';

/**
 * Rota catch-all: captura URLs que não batem com nenhuma outra rota
 * (ex.: /.well-known/appspecific/com.chrome.devtools.json enviado pelo Chrome).
 * Retorna 404 para não disparar "No route matches URL" no servidor.
 */
export async function loader(_args: LoaderFunctionArgs) {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

export default function CatchAll() {
  return null;
}
