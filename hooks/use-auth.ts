import { useAuth } from "@/context/auth-context";

/**
 * Access the client-side user session, auth status, login and logout helpers.
 */
export const useAuthUser = () => {
  return useAuth();
};
