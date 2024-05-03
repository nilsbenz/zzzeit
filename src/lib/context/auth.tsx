import { User } from "firebase/auth";
import { ReactNode, createContext, useContext } from "react";

type AuthContext = {
  user: User;
};

const Context = createContext<AuthContext>({
  user: null as unknown as User,
});

function AuthContextProvider({
  value,
  children,
}: {
  value: AuthContext;
  children: ReactNode;
}) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function useAuthContext() {
  return useContext(Context);
}

export { AuthContextProvider, useAuthContext };
