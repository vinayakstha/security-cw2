"use client";
import Image from "next/image";
import { Clock, Wallet, ShieldCheck, Award } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-white" id="home">
      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full">
        {/* Background Image */}
        <Image
          src="/images/hero.jpg" // put image in public/
          alt="Electrician working"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Fast, Reliable Home Services at Your Doorstep
              </h1>
              <button
                onClick={() => router.push("/register")}
                className="mt-6 bg-[#006BAA] hover:bg-[#01508d] transition text-white px-6 py-3 rounded-md font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="-mt-20 relative z-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-[#006BAA]" />}
              title="24/7 Availability"
              description="We’re always here, whenever you need help."
            />
            <FeatureCard
              icon={<Wallet className="h-8 w-8 text-[#006BAA]" />}
              title="Affordable Price"
              description="Quality services at prices that fit your budget."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-[#006BAA]" />}
              title="Trusted Professionals"
              description="Skilled and verified experts you can rely on."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-[#006BAA]" />}
              title="Quality Service"
              description="High-quality work with attention to every detail."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

/* FEATURE CARD COMPONENT */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2 text-black">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
