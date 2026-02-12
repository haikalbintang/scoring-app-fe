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

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  /* -----------------------------
     3️⃣ React Hook Form Setup
  ------------------------------ */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  /* -----------------------------
     4️⃣ Mutation (Async Handling)
  ------------------------------ */

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post(`${BASE_URL}/auth/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });

      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      router.replace("/competitions");
    },
  });

  /* -----------------------------
     5️⃣ Submit Handler
  ------------------------------ */

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 min-w-full">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <main className="bg-white p-6 rounded-lg w-full max-w-md shadow-md dark:bg-gray-800">
        <TypographyH4>Login to Your Account</TypographyH4>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-6 gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                placeholder="peterparker"
                {...register("username")}
              />
              {errors.username && (
                <FieldDescription className="text-red-500">
                  {errors.username.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>{" "}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field orientation="horizontal" className="justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </Field>
            {/* Server Error */}
            {loginMutation.isError && (
              <FieldDescription className="text-red-500 text-center">
                Invalid credentials. Please try again.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
