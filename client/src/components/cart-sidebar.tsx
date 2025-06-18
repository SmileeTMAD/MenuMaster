import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/menu-data";
import type { InsertOrder } from "@shared/schema";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderType: "",
    deliveryAddress: "",
    notes: ""
  });

  const orderMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Entraremos em contacto consigo em breve para confirmar.",
      });
      clearCart();
      setShowOrderForm(false);
      setOrderData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        orderType: "",
        deliveryAddress: "",
        notes: ""
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: () => {
      toast({
        title: "Erro ao realizar pedido",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderData.customerName || !orderData.customerPhone || !orderData.orderType) {
      toast({
        title: "Campos obrigatórios em falta",
        description: "Por favor, preencha nome, telefone e tipo de pedido.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de fazer o pedido.",
        variant: "destructive",
      });
      return;
    }

    orderMutation.mutate({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail || null,
      items: JSON.stringify(items),
      totalAmount: getTotalPrice(),
      orderType: orderData.orderType,
      deliveryAddress: orderData.deliveryAddress || null,
      notes: orderData.notes || null,
    });
  };

  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl text-coffee-800">
            Seu Carrinho
          </SheetTitle>
          <SheetDescription>
            Revise seus itens e finalize o pedido
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-coffee-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-coffee-600 text-lg mb-2">Seu carrinho está vazio</p>
            <p className="text-coffee-500 text-sm">Adicione itens do menu para começar</p>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-coffee-800 text-sm leading-5">
                          {item.name}
                        </h4>
                        <Badge variant="outline" className="text-xs mt-1 text-coffee-600 border-coffee-200">
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium text-coffee-800 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-coffee-800">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total */}
            <Card className="bg-coffee-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-coffee-800">Total:</span>
                  <span className="text-xl font-bold text-coffee-800">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!showOrderForm ? (
              <div className="space-y-2">
                <Button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-coffee-500 hover:bg-coffee-600 text-white"
                  size="lg"
                >
                  Fazer Pedido
                </Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full text-coffee-700 border-coffee-300 hover:bg-coffee-50"
                >
                  Limpar Carrinho
                </Button>
              </div>
            ) : (
              /* Order Form */
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-coffee-800">Finalizar Pedido</h3>
                    <Button
                      onClick={() => setShowOrderForm(false)}
                      variant="ghost"
                      size="sm"
                      className="text-coffee-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-coffee-700 font-medium mb-1 text-sm">Nome *</label>
                      <Input
                        type="text"
                        value={orderData.customerName}
                        onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-coffee-700 font-medium mb-1 text-sm">Telefone *</label>
                      <Input
                        type="tel"
                        value={orderData.customerPhone}
                        onChange={(e) => setOrderData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-coffee-700 font-medium mb-1 text-sm">Email</label>
                      <Input
                        type="email"
                        value={orderData.customerEmail}
                        onChange={(e) => setOrderData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
                      />
                    </div>

                    <div>
                      <label className="block text-coffee-700 font-medium mb-1 text-sm">Tipo de Pedido *</label>
                      <Select value={orderData.orderType} onValueChange={(value) => setOrderData(prev => ({ ...prev, orderType: value }))}>
                        <SelectTrigger className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Levantar no Restaurante</SelectItem>
                          <SelectItem value="delivery">Entrega em Casa</SelectItem>
                          <SelectItem value="dine_in">Comer no Restaurante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {orderData.orderType === "delivery" && (
                      <div>
                        <label className="block text-coffee-700 font-medium mb-1 text-sm">Endereço de Entrega *</label>
                        <Textarea
                          value={orderData.deliveryAddress}
                          onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                          className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
                          rows={2}
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-coffee-700 font-medium mb-1 text-sm">Observações</label>
                      <Textarea
                        value={orderData.notes}
                        onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                        className="border-coffee-200 focus:ring-coffee-500 focus:border-coffee-500"
                        rows={2}
                        placeholder="Instruções especiais..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        type="submit"
                        disabled={orderMutation.isPending}
                        className="w-full bg-coffee-500 hover:bg-coffee-600 text-white"
                        size="lg"
                      >
                        {orderMutation.isPending ? "Enviando..." : `Confirmar Pedido - ${formatPrice(totalPrice)}`}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowOrderForm(false)}
                        variant="outline"
                        className="w-full text-coffee-700 border-coffee-300 hover:bg-coffee-50"
                      >
                        Voltar ao Carrinho
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}