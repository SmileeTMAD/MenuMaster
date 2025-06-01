import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
      }}
    >
      <div className="text-center text-white px-4 max-w-4xl">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6">
          <span className="text-coffee-300">La</span> Buena
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Autêntica experiência gastronómica no coração de Maputo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection("menu")}
            className="bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-4 text-lg font-medium"
            size="lg"
          >
            Ver Menu
          </Button>
          <Button 
            onClick={() => scrollToSection("contact")}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-coffee-800 px-8 py-4 text-lg font-medium bg-transparent"
            size="lg"
          >
            Reservar Mesa
          </Button>
        </div>
      </div>
    </section>
  );
}
