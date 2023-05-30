import { FC, PropsWithChildren, createContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import jwtDecode from "jwt-decode";

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
  authUserEmail(): string {
    throw new Error("User not logged in");
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
        authUserEmail() {
          if (!token) {
            throw new Error("User not logged in");
          }
          const decoded = jwtDecode<{ email: string }>(token);
          if (typeof decoded.email !== "string")
            throw new Error("Invalid login");
          return decoded.email;
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
