"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Navbar() {
 

  return (
    <nav className="w-full bg-[#08160b] text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl select-none">
          <div className="cursor-pointer">
            <img src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512" alt="Periskope Logo" className="w-40" />
          </div>
          {/* <span className="text-white">peris</span><span className="text-green-400">kope</span> */}
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex gap-8 text-white font-medium">
          <a href="#features" className="hover:text-green-400 transition">Features</a>
          <a href="#integrations" className="hover:text-green-400 transition">Integrations</a>
          <a href="#case-studies" className="hover:text-green-400 transition">Case Studies</a>
          <a href="#resources" className="hover:text-green-400 transition">Resources</a>
          <a href="#affiliates" className="hover:text-green-400 transition">Affiliates</a>
          <a href="#pricing" className="hover:text-green-400 transition">Pricing</a>
        </div>
        {/* Login Button */}
        <div className="hidden md:block">
          <Link href="/signin">
            <button className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded transition">Login</button>
          </Link>
        </div>
        {/* Mobile Hamburger (optional, not implemented for brevity) */}
      </div>
    </nav>
  );
} 