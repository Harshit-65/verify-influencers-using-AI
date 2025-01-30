import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Verify Influencers",
  description: "Health Influencer Verification Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a192f] min-h-screen">
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
