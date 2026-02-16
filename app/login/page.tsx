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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  remember: z.boolean().optional(),
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
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  /* -----------------------------
     4️⃣ Mutation (Async Handling)
  ------------------------------ */

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);
      if (data.remember) {
        formData.append("remember", "true");
      }
      const response = await api.post("/auth/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Login response:", response.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Login successful 🎉");
      router.replace("/competitions");
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });

  /* -----------------------------
     5️⃣ Submit Handler
  ------------------------------ */

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-xl shadow-md rounded-2xl">
        <CardContent className="px-6">
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
              {/* Remember Me */}
              <Field
                orientation="horizontal"
                className="justify-between items-center"
              >
                {/* Remember Me - left side */}
                <div className="flex items-center gap-2">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4"
                      />
                    )}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>

                {/* Buttons - right side */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                  <Button
                    className="bg-linear-to-br from-[#A3162E] to-[#1B3691] 
           text-white 
           shadow-md 
           hover:shadow-lg 
           hover:opacity-95 
           transition-all duration-200"
                    type="submit"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Field>

              {/* Server Error */}
              {loginMutation.isError && (
                <FieldDescription className="text-red-500 text-center">
                  Server error occurred. Please try again later.
                </FieldDescription>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
