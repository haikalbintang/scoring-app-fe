"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { BASE_URL } from "@/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(`${BASE_URL}/auth/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.access_token);

      router.push("/competitions");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 min-w-full">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <main className="bg-white p-6 rounded-lg w-full max-w-md shadow-md dark:bg-gray-800">
        <TypographyH4>Login to Your Account</TypographyH4>

        <form onSubmit={handleLogin} className="flex flex-col mt-6 gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                placeholder="Peter Parker"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>{" "}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* <FieldDescription>
                Make sure your password is secure.
              </FieldDescription> */}
            </Field>
            <Field orientation="horizontal" className="justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
              <Button type="submit">Login</Button>
            </Field>
          </FieldGroup>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
