"use client";

import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[#006BAA]"
        >
          <Image
            src="/images/home-repair.png"
            alt="GharSewa Logo"
            width={32}
            height={32}
            priority
          />
          <span>Gharsewa</span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="cursor-pointer text-gray-700 hover:text-[#006BAA]"
          >
            Home
          </ScrollLink>

          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            className="cursor-pointer text-gray-700 hover:text-[#006BAA]"
          >
            About Us
          </ScrollLink>

          <ScrollLink
            to="services"
            smooth={true}
            duration={500}
            className="cursor-pointer text-gray-700 hover:text-[#006BAA]"
          >
            Our Services
          </ScrollLink>
        </div>

        {/* LOGIN BUTTON (right) */}
        <div className="hidden md:flex">
          <Link
            href="/login"
            className="ml-4 px-5 py-2 rounded-lg bg-[#006BAA] text-white hover:bg-[#01508d] transition"
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col px-6 py-4 gap-4">
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Home
            </ScrollLink>

            <ScrollLink
              to="about"
              smooth={true}
              duration={500}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              About Us
            </ScrollLink>

            <ScrollLink
              to="services"
              smooth={true}
              duration={500}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Our Services
            </ScrollLink>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 text-center px-4 py-2 rounded-lg bg-[#006BAA] text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
