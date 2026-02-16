"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return null;
}
