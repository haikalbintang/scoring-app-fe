"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await api.post("/auth/logout");

      // If you store in cookie (optional cleanup)
      document.cookie = "access_token=; Max-Age=0; path=/";

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogOut
      onClick={handleLogout}
      className={`w-5 h-5 cursor-pointer text-white transition-opacity ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    />
  );
};

export default LogoutButton;
