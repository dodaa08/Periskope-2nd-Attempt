"use client";
import Link from "next/link";
// import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import {supabase} from "@/lib/supabaseClient";

import { ImBlogger2 } from "react-icons/im";
import { FiYoutube } from "react-icons/fi";

import { FaGithub } from "react-icons/fa";


export default function Navbar() {
    const  session = useSession();
    const router = useRouter();

    const signOut = () => {
      supabase.auth.signOut();
    }


  return (  
    <nav className="w-full bg-[#0d2614] text-white">
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

          <Link href="https://medium.com/@kartikdoda86/periskope-sde-1-assignment-how-i-built-a-full-chat-app-using-ai-assistance-d81690040d22/" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center gap-3 hover:text-green-400 transition">
          <ImBlogger2 className="text-blue-400 text-xl" />
          <div className="text-xl">I wrote a blog</div>
          </div>
          </Link>

          <Link href="https://www.loom.com/share/5b8998ae5ca54c98bbd625249c5edfa6?sid=e6b2e245-84f9-4f63-b5c4-1549231d369c" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center gap-3 hover:text-green-400 transitio">
          <FiYoutube className="text-red-500 text-xl" />
          <div className="text-xl">Watch Demo</div>
          </div>
          </Link>

          <Link href="https://github.com/dodaa08/Periskope-2nd-Attempt" target="_blank" rel="noopener noreferrer">
          <div className="flex items-center gap-3 hover:text-green-400 transitio">
          <FaGithub className="text-white text-xl" /> 
          <div className="text-xl">Github</div>
          </div>
          </Link>
          
        </div>
        {/* Login Button */}
        {
          session ? (
            <div className="hidden md:block">
              <button onClick={() => signOut()} className=" bg-green-800 border-2 border-gray-800  cursor-pointer hover:bg-green-900 text-white font-semibold px-6 py-2 rounded-xl transition duration-300">Logout</button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Link href="/signin">
            <button className=" bg-green-800 border-2 border-gray-800  cursor-pointer hover:bg-green-900 text-white font-semibold px-6 py-2 rounded-xl transition duration-300">Login</button>
          </Link>
          </div>
        )}
        {/* Mobile Hamburger (optional, not implemented for brevity) */}
      </div>
    </nav>
  );
} 