import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Permissions = lazy(() => import("../domain/pages/Permissions"));

export default function PermissionsRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Permissions />
    </Suspense>
  );
}
