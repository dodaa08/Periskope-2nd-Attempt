"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function Hero() {
  const router = useRouter();
  const session = useSession();
  
  return (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center relative px-4">
      {/* Grid SVG as background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg width="600" height="600" className="w-[600px] h-[600px] opacity-10">
          <defs>
            <pattern id="grid" width="125" height="125" patternUnits="userSpaceOnUse">
              <path d="M 125 0 L 0 0 0 125" fill="none" stroke="#2e4732" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center px-4 m-0 p-0">
        {/* Badge */}
        
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight max-w-4xl">
          Manage <span className="text-green-500">WhatsApp Groups</span><br />
          <span className="text-green-500">and Chats</span> at scale
        </h1>
        {/* Subheadline */}
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl">
          Connect multiple numbers, create tasks & tickets, integrate with your systems, and automate your workflows on WhatsApp
        </p>
        {/* Buttons */}
        {
          session ? (
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
              <Link href="/chats">
              <button onClick={() => router.push("/chats")}  className="bg-green-800 border-2 border-gray-800  cursor-pointer hover:bg-green-900 text-white font-semibold px-8 py-3 rounded-xl transition duration-300">Chats</button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
            <Link href="/signup">
              <button className=" bg-green-800 border-2 border-gray-800  cursor-pointer hover:bg-green-900 text-white font-semibold px-8 py-3 rounded-xl transition duration-300">Sign Up for Free</button>
            </Link>
            <Link href="/signin">
              <button className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded transition text-lg">Book a Demo</button>
            </Link>
          </div>
          ) 
        }
      
        {/* Small note */}
        <p className="text-xs text-gray-400 mt-2">Connect any WhatsApp Number. No WhatsApp Business API Required.</p>
      </div>
    </section>
  );
} 