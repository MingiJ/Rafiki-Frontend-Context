import { FC, PropsWithChildren, createContext } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const AuthContext = createContext({
  getToken(): string {
    throw new Error("User not logged in");
  },
  logIn(token: string): void {
    throw new Error("User not logged in");
  },
  logOut(): void {
    throw new Error("User not logged in");
  },
  isAuthenticated(): boolean {
    return false;
  },
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useLocalStorage<null | string>("token", null);
  return (
    <AuthContext.Provider
      value={{
        getToken() {
          if (!token) {
            throw new Error("User not logged in");
          }
          return token;
        },
        logIn(token: string) {
          setToken(token);
        },
        logOut() {
          setToken(null);
        },
        isAuthenticated() {
          return token !== null;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
