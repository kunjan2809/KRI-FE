import { useAuthContext } from "./use-auth-context";

   

// Helper hook to get the current token
export const useAuthToken = () => {
  const { user } = useAuthContext();
  return user?.accessToken;
};
