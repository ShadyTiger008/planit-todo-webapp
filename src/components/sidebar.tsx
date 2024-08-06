"use client";

import { usePathname } from "next/navigation";
import { Montserrat_Alternates } from "next/font/google";
import Link from "next/link";
import React from "react";
import { LayoutList, ListChecks, ListTodo, UserSquare2 } from "lucide-react";
import ProfileCounter from "./profile-counter";
import { cn } from "~/lib/utils";

const monsterrat = Montserrat_Alternates({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "To-Do's",
    icon: ListTodo,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Completed Tasks",
    icon: ListChecks,
    href: "/completed-tasks",
    color: "text-emerald-500",
  },
  {
    label: "Incomplete Tasks",
    icon: LayoutList,
    href: "/incomplete-tasks",
    color: "text-violet-500",
  },
  {
    label: "Profile",
    icon: UserSquare2,
    href: "/profile",
    color: "text-pink-700",
  },
];

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <main className="flex h-full flex-col space-y-4 bg-[#111827] py-4 text-white">
      <div className="flex-1 px-3 py-2">
        <Link href="/dashboard" className="mb-14 flex items-center pl-3">
          <div className="relative mr-4 flex h-8 w-8 items-center justify-center rounded-full border">
            <span>NT</span>
          </div>
          <h1 className={cn("text-2xl font-bold", monsterrat.className)}>
            NexTask
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            return (
              <Link
                href={route.href}
                key={route.label}
                className={cn(
                  "group flex w-full cursor-pointer justify-start rounded-lg p-3 text-sm font-medium transition hover:bg-white/10 hover:text-white",
                  pathName === route.href
                    ? "bg-white/20 text-white"
                    : "text-zinc-400",
                )}
              >
                <div className="flex flex-1 items-center">
                  <route.icon className={cn("mr-3 h-5 w-5", route.color)} />
                  <span>{route.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <ProfileCounter />
    </main>
  );
};

export default Sidebar;
