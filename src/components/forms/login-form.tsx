import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import useAuthStore from "~/app/providers/store/authStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

type LoginFormValues = {
  userNameOrEmail: string;
  password: string;
};

const LoginForm = (props: Props) => {
  const { userLogin, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const isEmail = validateEmail(data.userNameOrEmail);

      const loginData = isEmail
        ? { email: data.userNameOrEmail, password: data.password }
        : { userName: data.userNameOrEmail, password: data.password };

      const response: any = await userLogin(loginData);

      if (response && response.success) {
        toast.success("Login successful!");
      } else {
        toast.error("User not found or password is incorrect!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed!");
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <div className="w-full rounded-lg bg-white dark:bg-gray-800">
      <div className="space-y-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="userNameOrEmail">Username / Email</Label>
            <Input
              type="text"
              id="userNameOrEmail"
              placeholder="john_doe or name@company.com"
              className="w-full"
              {...register("userNameOrEmail", {
                required: "Username or Email is required",
              })}
            />
            {errors.userNameOrEmail && (
              <span className="text-sm text-red-600">
                {errors.userNameOrEmail.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
              />
              <Label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 dark:text-gray-300"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary py-3 text-white transition-all hover:bg-primary/90"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-sm text-gray-500">
            Don’t have an account yet?{" "}
            <Link href="/sign-up" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
