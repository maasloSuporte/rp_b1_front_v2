import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const PackagesUpload = lazy(() => import("../domain/pages/PackagesUpload"));

export default function PackagesUploadRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <PackagesUpload />
    </Suspense>
  );
}
