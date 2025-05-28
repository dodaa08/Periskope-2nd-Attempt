"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="cursor-pointer">
          <Link href="/">
            <img src="https://imgs.search.brave.com/FlzrRILBIuiiDFd1jFraOYckKiAEUO4xl1FeDe4pB9E/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvOWI1ZjAzN2I3/ODM0ZTY0ZTFmNjZj/ZTg3MmE3YjNlMTI3/Y2RmM2E5MDYyMjNl/MmZmMjBhZTdkN2E4/NTMzOGM1YS9wZXJp/c2tvcGUuYXBwLw" alt="Periskope Logo" className="w-12 mb-6 text-center text-green-700" />
          </Link>
        </div>
        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Sign in to Periskope</h2>
        {/* Google Button */}
        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2 mb-6 font-medium text-gray-700 hover:bg-gray-100 transition">
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 44c6.1 0 11.2-2 14.9-5.4l-7-5.7C29.7 34.9 27 36 24 36c-6.1 0-11.3-4.1-13.2-9.7l-7.1 5.5C6.6 41.1 14.7 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/></g></svg>
          Continue with Google
        </button>
        {/* Divider */}
        <div className="w-full border-t border-gray-200 my-4"></div>
        {/* Email Input */}
        <form className="w-full flex flex-col gap-2" onSubmit={handleEmailSignIn}>
          <input
            type="email"
            placeholder="Enter your official email address"
            className="w-full border border-gray-200 rounded-md py-2 px-3 mb-3 focus:outline-none text-black"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-200 rounded-md py-2 px-3 mb-3 focus:outline-none text-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 font-medium rounded-md py-2 mb-2 transition" disabled={loading}>
            Continue with Email
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {/* Terms */}
        <div className="flex flex-row justify-between">
          <p className="text-xs text-gray-400 text-center mt-4 text-center text-gray-700">
            Don't have an account? <Link href="/signup" className="underline">Sign up</Link>
          </p>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          By signing up, you agree to Periskope's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
} 