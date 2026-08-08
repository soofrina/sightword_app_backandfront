import { Navigate } from "react-router-dom";
import { Role } from "@base/type/user";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";

interface ProtectedRouteProps {
  allowedRoles: Array<Role>;
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const user = useRecoilValue(userAtom);

  const isAuthenticated = () => {
    return user.id !== "";
  };

  const isAuthorised = () => {
    return (
      allowedRoles.filter((role) => user.roleNames.some((e) => e.role === role))
        .length > 0
    );
  };

  if (!isAuthenticated()) {
    console.log("Not Authenticated");
    return <Navigate to='/login' replace />;
  }

  if (!isAuthorised()) {
    console.log("Not Authorised");
    // TODO replace with 404 page
    return <Navigate to='/error' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
