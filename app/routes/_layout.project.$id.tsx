import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Project = lazy(() => import("../domain/pages/Project"));

export default function ProjectEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Project />
    </Suspense>
  );
}
