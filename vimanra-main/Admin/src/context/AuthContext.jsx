import { createContext, useContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = sessionStorage.getItem("vimanra_admin");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    try {
      const adminData = await loginRequest(username.trim(), password);
      const session = {
        name: adminData.username,
        role: "Hotel Admin",
        username: adminData.username,
        email: adminData.email,
      };
      sessionStorage.setItem("vimanra_admin", JSON.stringify(session));
      setAdmin(session);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || "Incorrect username or password." };
    }
  };

  const logout = () => {
    logoutRequest();
    sessionStorage.removeItem("vimanra_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
