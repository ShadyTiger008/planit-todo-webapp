import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useAuthStore from "~/app/providers/store/authStore";
import { useRouter } from "next/navigation";

type RegistrationFormValues = {
  fullName: string;
  email: string;
  userName: string;
  password: string;
};

const RegistrationForm = () => {
  const router = useRouter();
  const { userRegistration, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>();

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      const response: any = await userRegistration(data);
      if (response?.success) {
        console.log("Registration Response: ", response);
        //   router.push("/tasks");
        toast.success("Registration successful!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <div className="w-full rounded-lg bg-white dark:bg-gray-800">
      <div className="space-y-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="John Doe"
              className="w-full"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <span className="text-sm text-red-600">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              type="text"
              id="userName"
              placeholder="john_doe"
              className="w-full"
              {...register("userName", { required: "Username is required" })}
            />
            {errors.userName && (
              <span className="text-sm text-red-600">
                {errors.userName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Your email</Label>
            <Input
              type="email"
              id="email"
              placeholder="name@company.com"
              className="w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary py-3 text-white transition-all hover:bg-primary/90"
          >
            {isLoading ? "Registering..." : "Sign up"}
          </Button>

          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
