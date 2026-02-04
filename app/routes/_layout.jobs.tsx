import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Jobs = lazy(() => import("../domain/pages/Jobs"));

export default function JobsRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Jobs />
    </Suspense>
  );
}
