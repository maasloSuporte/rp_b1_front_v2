import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const Permissions = lazy(() => import("../domain/pages/Permissions"));

export default function PermissionsEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <Permissions />
    </Suspense>
  );
}
