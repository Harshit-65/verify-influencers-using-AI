// src\app\research\page.jsx
import Header from "@/components/Header";
import ResearchForm from "@/components/ResearchForm";

export const metadata = {
  title: "Analyze Influencer Claims | VerifyInfluencers",
  description:
    "Research and verify health influencer claims using AI-powered analysis and scientific sources",
};

export default function ResearchPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-[#0a192f]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            Research Analysis
          </h1>
          <p className="text-gray-300 mb-8">
            Enter an influencer's name to analyze their health and wellness
            claims using AI-powered verification against scientific sources.
          </p>
          <ResearchForm className="animate-fade-in" />
        </div>
      </main>
    </div>
  );
}
