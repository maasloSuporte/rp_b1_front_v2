import { Suspense, lazy } from "react";
import Loading from "../components/Loading";

const User = lazy(() => import("../domain/pages/User"));

export default function UserEditRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <User />
    </Suspense>
  );
}
