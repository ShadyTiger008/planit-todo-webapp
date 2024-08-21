"use client"
import React from "react";
import { Button } from "./ui/button";
import useAuthStore from "~/app/providers/store/authStore";

type Props = {};

const Header = (props: Props) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="bg-[#0d0329] py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <h1 className="text-3xl font-bold text-[#4f2fee]">PlanIt</h1>
        <nav>
          {isAuthenticated ? (
            <Button className="rounded-md bg-[#4f2fee]/80 px-4 py-2 text-white hover:bg-[#382599]">
              Go to boards
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200">
                Login
              </Button>
              <Button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
                Register
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
