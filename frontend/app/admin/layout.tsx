"use client";

import { useState } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="flex flex-col h-screen overflow-hidden">
      {/* Header: spans full width, stays on top */}
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content: scrollable */}
        <main
          className={`flex-1 p-2 bg-white overflow-y-auto mt-2 transition-all duration-300 ${
            isSidebarOpen
              ? "hidden md:block"
              : "block"
          }`}
        >
          {children}
        </main>
      </div>
    </section>
  );
}
