// src\app\page.jsx
import Link from "next/link";
// import { Stats } from "@/components/Stats"; // New component to show platform stats

export const metadata = {
  title: "VerifyInfluencers | AI-Powered Health Claim Analysis",
  description:
    "Verify health and wellness influencer claims using AI analysis and scientific research",
};

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#0a192f]">
      <main className="flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-roboto">
            Verify Influencers
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Use AI-powered analysis to verify health and wellness claims against
            scientific research and trusted sources.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link
              href="/research"
              className="bg-[#22c55e] text-white px-8 py-4 rounded-lg text-xl 
                hover:bg-[#1ea34b] transition-colors font-medium"
            >
              Start Analysis
            </Link>
            <Link
              href="/leaderboard"
              className="border-2 border-[#22c55e] text-[#22c55e] px-8 py-4 
                rounded-lg text-xl hover:bg-[#22c55e]/10 transition-colors font-medium"
            >
              View Leaderboard
            </Link>
          </div>

          {/* <Stats /> New component showing platform statistics */}

          <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#112240] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Scientific Analysis
              </h3>
              <p className="text-gray-300">
                Claims are verified against peer-reviewed research and trusted
                scientific journals.
              </p>
            </div>
            <div className="bg-[#112240] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered</h3>
              <p className="text-gray-300">
                Advanced AI analyzes claims across multiple categories including
                nutrition, exercise, and mental health.
              </p>
            </div>
            <div className="bg-[#112240] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">
                Trust Scores
              </h3>
              <p className="text-gray-300">
                Get detailed trust scores based on scientific accuracy and
                evidence-based analysis.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
