import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/98 backdrop-blur-sm shadow-lg" : "bg-white/95 backdrop-blur-sm shadow-lg"
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="font-playfair text-2xl font-bold text-coffee-800">
            <span className="text-coffee-500">La</span> Buena
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="text-coffee-700 hover:text-coffee-500 transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection("menu")}
              className="text-coffee-700 hover:text-coffee-500 transition-colors"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-coffee-700 hover:text-coffee-500 transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-coffee-700 hover:text-coffee-500 transition-colors"
            >
              Contacto
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-coffee-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-coffee-200">
            <div className="flex flex-col space-y-3 pt-4">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-coffee-700 hover:text-coffee-500 transition-colors text-left"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection("menu")}
                className="text-coffee-700 hover:text-coffee-500 transition-colors text-left"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="text-coffee-700 hover:text-coffee-500 transition-colors text-left"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-coffee-700 hover:text-coffee-500 transition-colors text-left"
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
