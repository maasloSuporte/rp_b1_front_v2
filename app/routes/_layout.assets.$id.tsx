import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Asset = lazy(() => import("../domain/pages/Asset"));

export default function AssetEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Asset />
    </Suspense>
  );
}
