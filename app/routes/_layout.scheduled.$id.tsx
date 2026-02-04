import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Schedule = lazy(() => import("../domain/pages/Schedule"));

export default function ScheduleEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Schedule />
    </Suspense>
  );
}
