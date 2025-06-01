import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import MenuSection from "@/components/menu-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-coffee-50">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
