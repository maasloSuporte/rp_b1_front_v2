import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function LayoutRoute() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}
