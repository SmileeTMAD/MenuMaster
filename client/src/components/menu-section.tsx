import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { menuCategories, formatPrice, searchMenuItems } from "@/lib/menu-data";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const filteredItems = useMemo(() => {
    let filtered = menuItems;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = searchMenuItems(filtered, searchTerm);
    }
    
    return filtered;
  }, [menuItems, selectedCategory, searchTerm]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category
    });
    
    toast({
      title: "Item adicionado ao carrinho!",
      description: `${item.name} foi adicionado ao seu carrinho.`,
    });
  };

  const getCategoryImage = (category: string) => {
    const images: Record<string, string> = {
      cafetaria: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      pastelaria: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      breakfast: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      baguetes: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      saladas: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      omeletes: "https://pixabay.com/get/g262553fe0c2e34a690a7e6517db079e48febf20628e170ccd77fd0a40337933498bd62afa109e164e24cdd461af563d413bdacf17faffc7de0d872f3fc5506c5_1280.jpg",
      torradas: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      tostas: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      sandes: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      snacks: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300"
    };
    return images[category] || images.cafetaria;
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <section id="menu" className="py-20 bg-coffee-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-coffee-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-coffee-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-coffee-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
            Nosso Menu
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-coffee-500 to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
            Descubra nossa seleção cuidadosa de pratos, bebidas e petiscos
          </p>
        </div>

        {/* Menu Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Pesquisar no menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 py-3 border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
            />
          </div>
        </div>

        {/* Menu Categories Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button
            onClick={() => setSelectedCategory("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-coffee-500 text-white hover:bg-coffee-600"
                : "bg-white text-coffee-700 hover:bg-coffee-100"
            }`}
          >
            Todos
          </Button>
          {menuCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-coffee-500 text-white hover:bg-coffee-600"
                  : "bg-white text-coffee-700 hover:bg-coffee-100"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto">
          {selectedCategory === "all" ? (
            <div className="space-y-16">
              {menuCategories.map((category) => {
                const categoryItems = groupedItems[category.id] || [];
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id}>
                    <div className="text-center mb-8">
                      <h3 className="font-playfair text-3xl font-bold text-coffee-800 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-coffee-600">{category.description}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="relative">
                          <img 
                            src={getCategoryImage(category.id)} 
                            alt={category.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h4 className="font-playfair text-2xl font-bold text-white text-center">
                              {category.name}
                            </h4>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {categoryItems.slice(0, 4).map((item) => (
                              <div key={item.id} className="flex justify-between items-center group">
                                <div className="flex-1">
                                  <span className="text-coffee-700 text-sm">{item.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="bg-coffee-100 text-coffee-800 font-semibold">
                                    {formatPrice(item.price)}
                                  </Badge>
                                  <Button
                                    onClick={() => handleAddToCart(item)}
                                    size="sm"
                                    variant="outline"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 border-coffee-300 hover:bg-coffee-500 hover:text-white"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {categoryItems.length > 4 && (
                              <div className="text-center pt-2">
                                <span className="text-coffee-500 text-sm">
                                  +{categoryItems.length - 4} mais itens
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-coffee-800 group-hover:text-coffee-600 transition-colors">
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <p className="text-coffee-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-coffee-500 text-white hover:bg-coffee-600 font-semibold">
                        {formatPrice(item.price)}
                      </Badge>
                      <Badge variant="outline" className="text-coffee-600 border-coffee-200">
                        {menuCategories.find(cat => cat.id === item.category)?.name || item.category}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-coffee-500 hover:bg-coffee-600 text-white transition-colors duration-200"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-coffee-600 text-lg">
              Nenhum item encontrado para "{searchTerm}" ou categoria selecionada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
