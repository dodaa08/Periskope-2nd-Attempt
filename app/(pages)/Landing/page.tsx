import Navbar from "@/app/components/Landing/Navbar";
import Hero from "@/app/components/Landing/Hero";
import Brands from "@/app/components/Landing/Brands";
import SupabaseContext from "@/app/wrapers/supabaseContext";
import ToasterClient from "@/app/components/ToasterClient";

export default function LandingPage() {
  return (
    <SupabaseContext>
      <ToasterClient />
      <div className="bg-[#0d2614] min-h-screen w-full flex flex-col relative overflow-hidden">
        <Navbar />
        
        <main className="flex-1 flex flex-col items-center pt-16 md:pt-24 relative z-10">
          <Hero />
        </main>
        <div className="relative z-10">
          <Brands />
        </div>
      </div>
    </SupabaseContext>
  );
}