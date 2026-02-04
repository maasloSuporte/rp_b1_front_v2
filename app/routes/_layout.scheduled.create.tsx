import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Schedule = lazy(() => import("../domain/pages/Schedule"));

export default function ScheduleCreateRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Schedule />
    </Suspense>
  );
}
