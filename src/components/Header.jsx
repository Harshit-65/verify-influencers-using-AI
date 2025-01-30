"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#0a192f] px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <i className="fas fa-shield-alt text-white text-2xl mr-2"></i>
            <span className="text-white text-xl font-bold font-roboto">
              VerifyInfluencers
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/leaderboard"
              className="text-white hover:text-gray-300 font-roboto"
            >
              Leaderboard
            </Link>
            <Link
              href="/research"
              className="text-white hover:text-gray-300 font-roboto"
            >
              Research
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-gray-300 font-roboto"
            >
              About
            </Link>
          </nav>
          <button className="md:hidden text-white">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
