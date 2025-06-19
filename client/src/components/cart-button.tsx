import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/cart-sidebar";

export function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems, getTotalPrice } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      <Button
        onClick={() => setIsCartOpen(true)}
        variant="outline"
        className="relative bg-coffee-500 text-white hover:bg-coffee-600 border-coffee-500"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Carrinho
        {totalItems > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 bg-white text-coffee-800 font-bold"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}