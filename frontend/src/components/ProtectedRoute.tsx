import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
