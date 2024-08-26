"use client";
import React from "react";
import { Button } from "./ui/button";
import useAuthStore from "~/app/providers/store/authStore";
import RegistrationModal from "./registration-modal";
import LoginModal from "./login-modal";
import Link from "next/link";

const Header = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="bg-[#0d0329] py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <h1 className="text-4xl font-bold text-white">PlanIt</h1>
        <nav>
          {isAuthenticated ? (
            <Link href={`tasks`} className="rounded-md bg-indigo-500 px-6 py-3 text-white transition-all hover:bg-indigo-600">
              Go to boards
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <LoginModal />
              <RegistrationModal />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
