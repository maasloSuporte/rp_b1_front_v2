import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction } from "react-router";
import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import "./app.css";
import Notification from "./components/Notification";
import ModalProvider from "./components/modals/ModalProvider";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/assets/images/svgs/login/image 83.svg" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ErrorBoundary>
      <Notification />
      <ModalProvider />
      <Outlet />
    </ErrorBoundary>
  );
}
