import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Clock } from "lucide-react";
import type { InsertReservation } from "@shared/schema";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reservationMutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      const response = await apiRequest("POST", "/api/reservations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reserva criada com sucesso!",
        description: "Entraremos em contacto consigo em breve para confirmar.",
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        guests: "",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
    },
    onError: () => {
      toast({
        title: "Erro ao criar reserva",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.guests) {
      toast({
        title: "Campos obrigatórios em falta",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    reservationMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      notes: formData.notes || null,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
                Visite-nos
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-coffee-500 to-transparent mx-auto mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="La Buena Restaurant exterior" 
                  className="rounded-xl shadow-lg w-full" 
                />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Localização</h3>
                  <p className="text-coffee-600 text-lg flex items-center">
                    <MapPin className="text-coffee-500 mr-3 h-5 w-5" />
                    Avª Julius Nyere n. 442, Maputo
                  </p>
                </div>
                
                <div>
                  <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Contactos</h3>
                  <div className="space-y-3 text-lg text-coffee-600">
                    <p className="flex items-center">
                      <Phone className="text-coffee-500 mr-3 h-5 w-5" />
                      +258 84 207 6607
                    </p>
                    <p className="flex items-center">
                      <Phone className="text-coffee-500 mr-3 h-5 w-5" />
                      +258 82 971 5574
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-playfair text-2xl font-semibold text-coffee-800 mb-4">Horário de Funcionamento</h3>
                  <div className="space-y-2 text-coffee-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Clock className="text-coffee-500 mr-3 h-5 w-5" />
                        Segunda - Sexta:
                      </span>
                      <span>06:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between items-center pl-8">
                      <span>Sábado:</span>
                      <span>07:00 - 23:00</span>
                    </div>
                    <div className="flex justify-between items-center pl-8">
                      <span>Domingo:</span>
                      <span>08:00 - 21:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-coffee-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
                Reserve Sua Mesa
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-coffee-500 to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-coffee-600">
                Entre em contacto connosco para reservas ou encomendas
              </p>
            </div>
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Nome *</label>
                      <Input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Telefone *</label>
                      <Input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Data *</label>
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Hora *</label>
                      <Input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Número de Pessoas *</label>
                      <Select value={formData.guests} onValueChange={(value) => handleInputChange("guests", value)}>
                        <SelectTrigger className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 pessoa</SelectItem>
                          <SelectItem value="2">2 pessoas</SelectItem>
                          <SelectItem value="3">3 pessoas</SelectItem>
                          <SelectItem value="4">4 pessoas</SelectItem>
                          <SelectItem value="5">5+ pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-coffee-700 font-medium mb-2">Email</label>
                      <Input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-coffee-700 font-medium mb-2">Observações</label>
                    <Textarea 
                      rows={4} 
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500" 
                      placeholder="Alguma preferência especial ou pedido..." 
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      disabled={reservationMutation.isPending}
                      className="bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-4 text-lg font-medium"
                      size="lg"
                    >
                      {reservationMutation.isPending ? "Enviando..." : "Enviar Reserva"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
