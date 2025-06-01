export const menuCategories = [
  { id: "cafetaria", name: "Cafetaria", description: "Cafés, chás e bebidas quentes" },
  { id: "pastelaria", name: "Pastelaria", description: "Croissants, pastéis e doces frescos" },
  { id: "breakfast", name: "Breakfast Americano", description: "Pequenos-almoços completos" },
  { id: "torradas", name: "Torradas", description: "Pão torrado com ingredientes frescos" },
  { id: "tostas", name: "Tostas", description: "Tostas quentes e saborosas" },
  { id: "sandes", name: "Sandes", description: "Sanduíches variadas" },
  { id: "baguetes", name: "Baguetes", description: "Baguetes recheadas" },
  { id: "snacks", name: "Snacks | Salgados", description: "Petiscos e salgados" },
  { id: "omeletes", name: "Omeletes", description: "Omeletes com batata frita e salada" },
  { id: "saladas", name: "Saladas", description: "Saladas frescas e nutritivas" }
];

export const formatPrice = (price: number): string => {
  return `${(price / 100).toFixed(2)} Mts`;
};

export const searchMenuItems = (items: any[], searchTerm: string) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
};
