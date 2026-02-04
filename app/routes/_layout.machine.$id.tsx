import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Machine = lazy(() => import("../domain/pages/Machine"));

export default function MachineEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Machine />
    </Suspense>
  );
}
