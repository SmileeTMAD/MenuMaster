import { MapPin, Phone, Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-coffee-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="font-playfair text-3xl font-bold mb-4">
                <span className="text-coffee-300">La</span> Buena
              </div>
              <p className="text-coffee-200 mb-4">
                Autêntica experiência gastronómica no coração de Maputo, combinando tradição portuguesa com sabores moçambicanos.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-coffee-300 hover:text-white transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-coffee-300 hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-coffee-300 hover:text-white transition-colors">
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-xl font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-coffee-200">
                <p className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5" />
                  Avª Julius Nyere n. 442, Maputo
                </p>
                <p className="flex items-center">
                  <Phone className="mr-3 h-5 w-5" />
                  +258 84 207 6607
                </p>
                <p className="flex items-center">
                  <Phone className="mr-3 h-5 w-5" />
                  +258 82 971 5574
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-xl font-semibold mb-4">Horários</h3>
              <div className="space-y-2 text-coffee-200">
                <div className="flex justify-between">
                  <span>Segunda - Sexta:</span>
                  <span>06:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span>07:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span>08:00 - 21:00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-coffee-700 mt-8 pt-8 text-center text-coffee-300">
            <p>&copy; 2024 La Buena. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
