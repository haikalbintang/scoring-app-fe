"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

/* -----------------------------
   1️⃣ Schema
------------------------------ */

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  /* -----------------------------
     2️⃣ React Hook Form
  ------------------------------ */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  /* -----------------------------
     3️⃣ Mutation
  ------------------------------ */

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await api.post("/auth/register", {
        username: data.username,
        email: Math.random().toString(36).substring(2, 11) + "@example.com", // Generate random email
        password: data.password,
        role: "admin",
      });
      console.log("Registration response:", response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registration successful 🎉");
      router.replace("/competitions");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });

  /* -----------------------------
     4️⃣ Submit Handler
  ------------------------------ */

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-xl shadow-md rounded-2xl">
        <CardContent className="px-6">
          <TypographyH4>Create Your Account</TypographyH4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col mt-6 gap-4"
          >
            <FieldGroup>
              {/* Username */}
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

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
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

              {/* Buttons */}
              <Field
                orientation="horizontal"
                className="justify-between items-center"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>

                <Button
                  className="bg-linear-to-br from-[#A3162E] to-[#1B3691] 
           text-white 
           shadow-md 
           hover:shadow-lg 
           hover:opacity-95 
           transition-all duration-200"
                  type="submit"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Registering..." : "Register"}
                </Button>
              </Field>

              {/* Server Error */}
              {registerMutation.isError && (
                <FieldDescription className="text-red-500 text-center">
                  Registration failed. Please try again.
                </FieldDescription>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default RegisterPage;
