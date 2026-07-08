"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  return (
    <section className="w-full bg-white py-16 mt-8" id="about">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* IMAGE SECTION */}
          <div className="relative">
            <Image
              src="/images/abt.jpg" // put image in public/
              alt="Electrician at work"
              width={600}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>

          {/* CONTENT SECTION */}
          <div>
            <span className="text-sm font-semibold text-[#006BAA] uppercase tracking-wide">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              We Make Home Services Reliable, and Affordable
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              We are a trusted home services platform committed to making
              everyday home maintenance simple and hassle-free. From skilled
              professionals to transparent pricing, we focus on delivering
              reliable solutions you can count on.
            </p>

            <button
              onClick={() => router.push("/register")}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-[#006BAA] hover:bg-[#01508d] px-6 py-3 text-white font-semibold  transition"
            >
              Discover more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
