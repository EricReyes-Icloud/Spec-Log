import MacHeader from "@/components/landing/MacHeader";
import Hero from "@/components/landing/Hero";
import WhatYouGet from "@/components/landing/WhatYouGet";
import WhySpecLog from "@/components/landing/WhySpecLog";
import AboutSection from "@/components/landing/AboutSection";
import TechnicalLog from "@/components/landing/TechnicalLog";
import EndLog from "@/components/landing/EndLog";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MacHeader />
      <Hero />
      <WhatYouGet />
      <WhySpecLog />
      <AboutSection />
      <TechnicalLog />
      <EndLog />
      <Footer />
    </div>
  );
}
