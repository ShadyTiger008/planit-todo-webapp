import React from "react";
import Navbar from "~/components/navbar";
import Sidebar from "~/components/sidebar";

const Dashboardlayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative h-full">
      {/* Sidebar Component */}
      <section className="hidden h-full bg-zinc-900 md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <Sidebar />
      </section>
      {/* Main Screen */}
      <section className="md:pl-72">
        <Navbar />
        {children}
      </section>
    </main>
  );
};

export default Dashboardlayout;
