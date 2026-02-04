import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Machine = lazy(() => import("../domain/pages/Machine"));

export default function MachineCreateRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Machine />
    </Suspense>
  );
}
