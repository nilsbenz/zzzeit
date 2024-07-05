import Auth from "@/components/auth/Auth";
import SplashScreen from "@/components/layout/SplashScreen";
import { User } from "firebase/auth";
import { ReactNode, createContext, useContext } from "react";
import useUser from "../hooks/useUser";

type AuthContext = {
  user: User;
};

const Context = createContext<AuthContext>({
  user: null as unknown as User,
});

function AuthContextProvider({ children }: { children?: ReactNode }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Auth />;
  }

  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
}

function useAuthContext() {
  return useContext(Context);
}

export { AuthContextProvider, useAuthContext };
