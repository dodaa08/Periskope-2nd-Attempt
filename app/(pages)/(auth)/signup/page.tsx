"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import SupabaseContext from "@/app/wrapers/supabaseContext";
import ToasterClient from "@/app/components/ToasterClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/chats` }
    });
    if (error) {
      toast.error(error.message || "Google sign in failed");
    } else {
      toast.success("Redirecting to Google sign in...");
    }
    setLoading(false);
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message || "Sign up failed");
    } else if (data.user && !data.session) {
      toast.success("Check your email to complete sign up.");
    } else if (data.session) {
      toast.success("Signed up successfully!");
      router.push("/chats");
    }
    setLoading(false);
  }

  return (
    <SupabaseContext>
      <ToasterClient />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-900 via-green-950 to-black px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 mt-10 text-center drop-shadow-lg">Create Your Account</h1>
        <div className="w-full max-w-sm bg-white border-2 border-gray-200 rounded-xl shadow p-8 flex flex-col items-center">
          {/* Logo */}
          <div className="cursor-pointer">
            <Link href="/">
              <img src="https://imgs.search.brave.com/FlzrRILBIuiiDFd1jFraOYckKiAEUO4xl1FeDe4pB9E/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvOWI1ZjAzN2I3/ODM0ZTY0ZTFmNjZj/ZTg3MmE3YjNlMTI3/Y2RmM2E5MDYyMjNl/MmZmMjBhZTdkN2E4/NTMzOGM1YS9wZXJp/c2tvcGUuYXBwLw" alt="Periskope Logo" className="w-12 mb-6 text-center text-green-700" />
            </Link>
          </div>
          {/* Heading */}
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Sign up to Periskope</h2>
          {/* Google Button */}
          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full cursor-pointer flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2 mb-6 font-medium text-gray-700 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 44c6.1 0 11.2-2 14.9-5.4l-7-5.7C29.7 34.9 27 36 24 36c-6.1 0-11.3-4.1-13.2-9.7l-7.1 5.5C6.6 41.1 14.7 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.6 0 5 .8 7 2.2l6.4-6.4C33.5 5.1 28.9 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/></g></svg>
            Continue with Google
          </button>
          {/* Divider */}
          <div className="w-full border-t border-gray-200 my-4"></div>
          {/* Email Input */}
          <form className="w-full flex flex-col gap-2" onSubmit={handleEmailSignUp}>
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
          {/* Terms */}
          <div className="flex flex-row justify-between">
            <p className="text-xs text-gray-400 text-center mt-4 text-center text-gray-700">
              Already have an account? <Link href="/signin" className="underline">Sign in</Link>
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to Periskope's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </SupabaseContext>
  );
} 