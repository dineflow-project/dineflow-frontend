"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { UserInterface } from "../../Interfaces/UserInterface";
import { addHoursToDate } from "../../utils/AppUtils";

// export interface AuthContextInterface {
//   isAuthenticated?: boolean;
//   user?: UserInterface;
//   loading?: boolean;
// }

// interface AuthContextType {
//   isLoggedIn: boolean;
//   setLoggedIn: (loggedIn: boolean) => void;
// }
export interface AuthContextInterface {
  isAuthenticated?: boolean;
  user?: UserInterface;
  loading?: boolean;
}

const authContext = createContext<AuthContextInterface>({});
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface | undefined>();
  const router = useRouter();
  // let interval: NodeJS.Timeout | undefined; // Define interval here

  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const setLoggedIn = (loggedIn: boolean) => {
  //   setIsLoggedIn(loggedIn);
  // };

  useEffect(() => {
    setLoading(true);
    let interval: string | number | NodeJS.Timeout | undefined;
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken == null) {
      router.push("/signin");
      clearInterval(interval);
      Swal.fire("Error", "Please log in", "error");
      return;
    } else {
      setUser({ id: "test" } as UserInterface);
    }

    interval = setInterval(() => {
      const expiredAt = new Date(
        sessionStorage.getItem("token_expires") ??
          addHoursToDate(new Date(), -1)
      );
      const now = new Date();
      if (now > expiredAt) {
        ForceLogout();
      }
    }, 1000);

    function ForceLogout() {
      clearInterval(interval);
      sessionStorage.clear();
      // sessionStorage.removeItem("accessToken");
      // sessionStorage.removeItem("token_expires");
      router.push("/signin");

      Swal.fire("Error", "Please log in", "error");
    }
    setLoading(false);
    return () => clearInterval(interval);
  }, []);

  return (
    <authContext.Provider value={{ isAuthenticated: !!user, user, loading }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
