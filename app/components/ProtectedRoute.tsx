// import { Navigate } from 'react-router';
// import { authService } from '../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporariamente desabilitado para debug - remover depois
  // const isLoggedIn = authService.isLoggedIn();
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
}
