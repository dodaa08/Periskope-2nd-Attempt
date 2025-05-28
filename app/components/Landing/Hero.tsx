"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-0 md:gap-0 relative px-72">
      {/* Grid SVG on the left (hidden on small screens) */}
      <div className="hidden md:flex items-center justify-center -mr-6 -translate-x-6">
        <svg width="300" height="300" className="w-[300px] h-[300px]">
          <defs>
            <pattern id="grid" width="125" height="125" patternUnits="userSpaceOnUse">
              <path d="M 125 0 L 0 0 0 125" fill="none" stroke="#2e4732" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Hero Content */}
      <div className="max-w-4xl mx-auto flex flex-col items-center md:items-start text-center md:text-left px-4 m-0 p-0">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-block bg-[#162c1a] text-green-300 text-xs font-semibold px-4 py-1 rounded-full">Periskope Launch Week 8 Is Here!</span>
        </div>
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight max-w-4xl">
          Manage <span className="text-green-500">WhatsApp Groups<br />and Chats</span> at scale
        </h1>
        {/* Subheadline */}
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl">
          Connect multiple numbers, create tasks & tickets, integrate with your systems, and automate your workflows on WhatsApp
        </p>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Link href="/signup">
            <button className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded transition text-lg">Sign Up for Free</button>
          </Link>
          <button className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded transition text-lg">Book a Demo</button>
        </div>
        {/* Small note */}
        <p className="text-xs text-gray-400 mt-2">Connect any WhatsApp Number. No WhatsApp Business API Required.</p>
      </div>
    </section>
  );
} 