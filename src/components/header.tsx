"use client";
import React from "react";
import { Button } from "./ui/button";
import useAuthStore from "~/app/providers/store/authStore";
import RegistrationModal from "./registration-modal";
import LoginModal from "./login-modal";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="bg-[#0d0329] py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/logo/logo.png"
              alt="PlanIt Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">PlanIt</h1>
        </div>

        {/* Navigation */}
        <nav>
          {isAuthenticated ? (
            <Link
              href="/tasks"
              className="rounded-md bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
            >
              Go to Boards
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
