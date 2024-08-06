"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Button } from "./ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useForm, type FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

const ProfileCounter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const getUser = () => {
    if (typeof window !== "undefined") {
      const initialUser = localStorage.getItem("User");
      if (initialUser) {
        return JSON.parse(initialUser);
      }
    }
    return null;
  };
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const router = useRouter();

  const splitName = (str: string) => str.slice(0, 12);
  const splitEmail = (str: string) => str.slice(0, 20);

  // const loginSchema = z.object({
  //   email: z.string().email(),
  //   password: z.string().min(2, {
  //     message: "Password must be at least 2 characters."
  //   })
  // });

  // type LoginSchema = z.infer<typeof loginSchema>;

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email: data.email,
        password: data.password,
      });

      const user = response?.data?.user;

      localStorage.setItem("User", JSON.stringify(user));

      toast.success("User successfully logged in!");
      setUser(user);
      reset();
    } catch (error) {
      toast.error("Failed to login!");
    }
  };

  return (
    <main className="px-3">
      <Card className="border-0 bg-white/10">
        {user ? (
          <CardContent className="py-6">
            <div className="mb-4 flex flex-row items-center justify-center gap-2 space-y-2 text-sm text-white">
              <Avatar>
                <AvatarImage
                  src={user?.picturePath || "https://github.com/shadcn.png"}
                  className="object-cover"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">
                  {splitName(user?.fullName)}....
                </span>
                <span className="text-sm">{splitEmail(user?.email)}....</span>
              </div>
            </div>
            <Link href="/profile">
              <Button className="group w-full" variant="premium">
                Go to Profile
                <MoveRight className="ml-2 h-4 w-4 fill-white group-hover:animate-bounce" />
              </Button>
            </Link>
          </CardContent>
        ) : (
          <CardContent className="flex flex-col items-center justify-center py-3">
            <div className="mb-4 flex flex-row items-center justify-center gap-2 space-y-2 text-sm text-white">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">User</span>
                <span className="text-sm">
                  {splitEmail("userexample@gmail.com")}....
                </span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="group w-full" variant="premium">
                  Sign In
                  <MoveRight className="ml-2 h-4 w-4 fill-white group-hover:animate-bounce" />
                </Button>
              </DialogTrigger>
              <DialogContent className="flex w-full flex-col justify-center">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && <p>{`${errors.email.message}`}</p>}
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                  />
                  {errors.password && <p>{`${errors.password.message}`}</p>}
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-8 w-full bg-black text-white hover:bg-black/70"
                  >
                    Submit
                  </Button>
                </form>
                <DialogFooter className="flex flex-row items-center">
                  <span>Don't have an account?</span>
                  <Button
                    variant="link"
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        )}
      </Card>
    </main>
  );
};

export default ProfileCounter;
