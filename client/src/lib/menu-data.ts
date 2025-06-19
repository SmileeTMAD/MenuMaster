export const menuCategories = [
  { id: "cafes", name: "Cafés & Bebidas Quentes", description: "Cafés, chás e bebidas quentes preparados com dedicação" },
  { id: "pastelaria", name: "Pastelaria", description: "Croissants, pastéis e doces frescos feitos diariamente" },
  { id: "torradas", name: "Torradas & Tostas", description: "Pão torrado e tostas quentes com ingredientes frescos" },
  { id: "sandes", name: "Sandes", description: "Sanduíches variadas em pão fresco" },
  { id: "breakfast", name: "Breakfast Americano", description: "Pequenos-almoços completos ao estilo americano" },
  { id: "baguetes", name: "Baguetes", description: "Baguetes recheadas com ingredientes selecionados" },
  { id: "snacks", name: "Snacks & Salgados", description: "Petiscos, salgados e hambúrgueres" },
  { id: "omeletes", name: "Omeletes", description: "Omeletes servidas com batata frita e salada mista" },
  { id: "saladas", name: "Saladas", description: "Saladas frescas e nutritivas" },
  { id: "entradas", name: "Entradas & Petiscos", description: "Aperitivos e petiscos para compartilhar" },
  { id: "sopas", name: "Sopas", description: "Sopas caseiras e reconfortantes" },
  { id: "pizzas", name: "Pizzas", description: "Pizzas artesanais com base de tomate e mozzarella" },
  { id: "massas", name: "Massas & WOK", description: "Massas italianas e pratos orientais" },
  { id: "carnes", name: "Pratos de Carne", description: "Carnes grelhadas e pratos tradicionais" },
  { id: "peixes", name: "Pratos de Peixe", description: "Peixes frescos e mariscos grelhados" },
  { id: "extras", name: "Extras", description: "Acompanhamentos e complementos" },
  { id: "bebidas", name: "Bebidas", description: "Águas, refrigerantes e sumos naturais" },
  { id: "cervejas", name: "Cervejas", description: "Seleção de cervejas nacionais e importadas" },
  { id: "sobremesas", name: "Sobremesas", description: "Doces e sobremesas para finalizar a refeição" }
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
