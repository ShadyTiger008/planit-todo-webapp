"use client";

import React from "react";
import Link from "next/link";
import { CircleUser, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "~/app/providers/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = () => {
  const router = useRouter();
  const { isAuthenticated, user, userLogout } = useAuthStore();

  if (!isAuthenticated || !user) return null;

  const firstName = user?.fullName?.split(" ")[0];
  const lastName = user?.fullName?.split(" ")[1];

  const handleLogout = async () => {
    try {
      await userLogout();
      router.push("/");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user.profileImage?.length > 0 ? (
          <Avatar>
            <AvatarImage src={user.profileImage} alt={user.fullName} />
            <AvatarFallback>
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="rounded-full border p-2 text-xs">
            {`${firstName.charAt(0)}${lastName.charAt(0)}`}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/dashboard/settings" className="flex items-center gap-3">
            <CircleUser className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
