import { 
  users, 
  menuItems, 
  reservations,
  orders,
  type User, 
  type InsertUser, 
  type MenuItem, 
  type InsertMenuItem,
  type Reservation,
  type InsertReservation,
  type Order,
  type InsertOrder 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Menu methods
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Reservation methods
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getAllReservations(): Promise<Reservation[]>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentReservationId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentReservationId = 1;
    this.currentOrderId = 1;
    
    // Initialize with complete La Buena menu data
    this.initializeMenuData();
  }

  private initializeMenuData() {
    const menuData = [
      // Cafés & Bebidas Quentes
      { name: "Banheira de Café", price: 11000, category: "cafes", description: "", available: true },
      { name: "Banheira de Descafeinado", price: 12000, category: "cafes", description: "", available: true },
      { name: "Café", price: 9000, category: "cafes", description: "", available: true },
      { name: "Café com Leite | Meia de Leite", price: 13000, category: "cafes", description: "", available: true },
      { name: "Café Duplo", price: 18000, category: "cafes", description: "", available: true },
      { name: "Café Pingado", price: 10000, category: "cafes", description: "", available: true },
      { name: "Capuccino", price: 14000, category: "cafes", description: "", available: true },
      { name: "Carioca de Café", price: 8000, category: "cafes", description: "", available: true },
      { name: "Carioca de Limão", price: 8000, category: "cafes", description: "", available: true },
      { name: "Chá (1 Folha)", price: 9000, category: "cafes", description: "", available: true },
      { name: "Chá c/ Leite | Chá Gengibre c/ mel e limão", price: 15000, category: "cafes", description: "", available: true },
      { name: "Chocolate Quente", price: 15000, category: "cafes", description: "", available: true },
      { name: "Copo de Leite", price: 13000, category: "cafes", description: "", available: true },
      { name: "Descafeínado", price: 10000, category: "cafes", description: "", available: true },
      { name: "Galão", price: 14000, category: "cafes", description: "", available: true },
      { name: "Galão Descafeínado", price: 15000, category: "cafes", description: "", available: true },
      { name: "Garoto", price: 11000, category: "cafes", description: "", available: true },
      { name: "Leite Ucal (Garrafa 0,33)", price: 17500, category: "cafes", description: "", available: true },
      
      // Pastelaria
      { name: "Bolo de Arroz", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Queque", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Palmier Simples", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Pastel de Nata", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Pastel de Feijão", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Croissant Simples", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Croissant com Manteiga", price: 14000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Fiambre | Queijo", price: 16500, category: "pastelaria", description: "", available: true },
      { name: "Croissant com Nutella", price: 20000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Ovo Mexido", price: 21000, category: "pastelaria", description: "", available: true },
      { name: "Croissant Misto (Queijo e Fiambre)", price: 23000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Queijo e Tomate", price: 23000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Queijo, fiambre e Tomate", price: 24000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Presunto", price: 25000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Ovo mexido e Queijo", price: 26000, category: "pastelaria", description: "", available: true },
      
      // Torradas & Tostas
      { name: "1/2 Torrada com manteiga", price: 8000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada com manteiga", price: 11000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "1/2 Torrada de Fiambre ou Queijo", price: 13000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "1/2 Torrada Mista", price: 15000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada de Fiambre ou Queijo", price: 19000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta de Fiambre ou Queijo", price: 20000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada Mista", price: 22000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta La Buena", price: 23000, category: "torradas", description: "Queijo, Tomate e Oregãos", available: true },
      { name: "Tosta Mista", price: 25000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta de Paté (Atum | Frutos do Mar | Frango)", price: 26000, category: "torradas", description: "Com Alface e Tomate", available: true },
      { name: "Tosta Ovo mexido e Queijo", price: 26000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Presunto", price: 32000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Ovo mexido e Chouriço", price: 34000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Presunto e Queijo", price: 36000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      
      // Sandes
      { name: "Sandes de Manteiga", price: 11000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Fiambre", price: 17500, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Queijo", price: 17500, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Ovo Mexido", price: 19000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes Mista (Fiambre e Queijo)", price: 20000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Chourição | Chouriço", price: 21000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes Paté (Atum | Frutos do Mar | Frango)", price: 25000, category: "sandes", description: "Com Alface e Tomate", available: true },
      { name: "Sandes de Presunto", price: 26000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Presunto e Queijo", price: 30000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      
      // Breakfast Americano
      { name: "Chicago", price: 35000, category: "breakfast", description: "1/2 Torrada+2 ovos +1 galão+1 fatia de presunto", available: true },
      { name: "Nova Iorque", price: 40000, category: "breakfast", description: "1 Torrada+2ovos+3 salsichas+2 fatias Bacon+Banheira café", available: true },
      { name: "Los Angeles", price: 54000, category: "breakfast", description: "1 Torrada + 2 ovos + 3 salsichas +2 fatias de presunto + 1 sumo natural de Laranja + café", available: true },
      
      // Baguetes
      { name: "Baguete Simples", price: 14000, category: "baguetes", description: "", available: true },
      { name: "Baguete com Manteiga", price: 16000, category: "baguetes", description: "", available: true },
      { name: "Baguete Torrada", price: 16000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Fiambre", price: 20000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Queijo", price: 20000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Queijo e Tomate", price: 25000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Ovo Mexido", price: 27500, category: "baguetes", description: "", available: true },
      { name: "Baguete Mista (Fiambre e Queijo)", price: 28000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Bacon Frito", price: 30000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Fiambre, Queijo e Tomate", price: 30000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Paté (Atum | Frutos do Mar | Frango)", price: 32000, category: "baguetes", description: "Com Alface e Tomate", available: true },
      { name: "Baguete de Presunto", price: 35000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Chourição e Queijo", price: 36000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Presunto e Ovo", price: 38000, category: "baguetes", description: "", available: true },
      { name: "Baguete 'Á Trincheiras'", price: 39500, category: "baguetes", description: "Bifana, cebola frita e Colorau", available: true },
      { name: "Baguete de Presunto, Ovo e Tomate", price: 41000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Ovo Mexido especial", price: 43000, category: "baguetes", description: "Ovo, Alface, Tomate, Fiambre, Bacon frito e Queijo", available: true },
      { name: "Baguete com bifana | Prego", price: 44500, category: "baguetes", description: "Com batata Frita", available: true },
      { name: "Baguete de Picanha", price: 49500, category: "baguetes", description: "Com batata Frita", available: true },
      { name: "Baguete com Bifana | Prego Especial", price: 50000, category: "baguetes", description: "2 ovos, queijo e batata Frita", available: true },
      
      // Snacks | Salgados
      { name: "Empada de frango (1 Unidade)", price: 8000, category: "snacks", description: "", available: true },
      { name: "Chamussas de Vaca (2 Unidades)", price: 13000, category: "snacks", description: "", available: true },
      { name: "Rissóis de Camarão (2 Unidades)", price: 13000, category: "snacks", description: "", available: true },
      { name: "Pastéis de Bacalhau (2 Unidades)", price: 17500, category: "snacks", description: "", available: true },
      { name: "Hamburguer Simples", price: 19500, category: "snacks", description: "Alface e tomate", available: true },
      { name: "Hamburguer Queijo", price: 25000, category: "snacks", description: "Alface, tomate e queijo", available: true },
      { name: "Bifana no pão de água", price: 30000, category: "snacks", description: "Com batata frita", available: true },
      { name: "Prego de Vaca ou Frango no pão de água", price: 30000, category: "snacks", description: "Com batata frita", available: true },
      { name: "Hamburguer Completo", price: 31000, category: "snacks", description: "Alface, tomate, ovo estrelado, queijo e batata frita", available: true },
      { name: "Hamburguer La Buena", price: 36000, category: "snacks", description: "Alface, tomate, ovo estrelado, queijo, cebola frita, bacon frito e batata frita", available: true },
      { name: "Prego de Picanha no pão de água", price: 39500, category: "snacks", description: "Com batata frita", available: true },
      
      // Omeletes
      { name: "Omelete Simples", price: 29500, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Queijo | Fiambre", price: 32000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Tomate picado", price: 32000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete Mista (Queijo e Fiambre)", price: 38000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Chourição | de Chouriço | de Vegetais", price: 38000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Queijo e Cogumelos", price: 38000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Atum", price: 39000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Camarão", price: 42000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Presunto", price: 45000, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      { name: "Omelete de Presunto e Queijo", price: 49500, category: "omeletes", description: "Servida com batata frita e salada mista", available: true },
      
      // Saladas
      { name: "Salada Mista", price: 28000, category: "saladas", description: "Alface, tomate, cebola, Pepino, e Cenoura", available: true },
      { name: "Salada Grega", price: 41000, category: "saladas", description: "Alface, Tomate, Azeitonas, Queijo feta e Oregãos", available: true },
      { name: "Salada Havaiana", price: 42000, category: "saladas", description: "Atum, Alface, Tomate, Cenoura, Milho, Cebola picada e Ovo cozido", available: true },
      { name: "Salada Tropical", price: 43000, category: "saladas", description: "Alface, Cenoura, Milho, peito de Frango grelhado aos cubos, Massa fusilli e Ananás", available: true },
      { name: "Salada Fit", price: 45000, category: "saladas", description: "Tomate, Cenoura, Quinoa, Espinafres Salteados, Ananás, e Sementes de sesamo", available: true },
      { name: "Salada do Mar", price: 48000, category: "saladas", description: "Alface, Frutos do mar, Camarão, Tomate, Cenoura e Milho", available: true },
      
      // Entradas & Petiscos
      { name: "Pão de água", price: 4000, category: "entradas", description: "", available: true },
      { name: "Manteiga 8g", price: 5000, category: "entradas", description: "", available: true },
      { name: "Azeitonas", price: 12000, category: "entradas", description: "", available: true },
      { name: "Bruchettas de Tomate e Mozarella", price: 25000, category: "entradas", description: "", available: true },
      { name: "Baguete de Alho", price: 29500, category: "entradas", description: "", available: true },
      { name: "Prato Pequeno Misto", price: 30000, category: "entradas", description: "queijo cabra, ovelha e chouriço", available: true },
      { name: "Prato Médio Misto", price: 39000, category: "entradas", description: "queijo cabra, ovelha e chouriço", available: true },
      { name: "Pica Pau", price: 39500, category: "entradas", description: "", available: true },
      { name: "Moelas", price: 39500, category: "entradas", description: "", available: true },
      { name: "Chouriço Assado", price: 41000, category: "entradas", description: "", available: true },
      { name: "Frango à Passarinho", price: 45000, category: "entradas", description: "Frango trinchado frito", available: true },
      { name: "Camarão à Alhinho", price: 48000, category: "entradas", description: "", available: true },
      { name: "Caracóis e cesto de Pão Torrado com Manteiga", price: 65000, category: "entradas", description: "", available: true },
      
      // Sopas
      { name: "Sopa do dia", price: 15000, category: "sopas", description: "", available: true },
      { name: "Sopa de Caldo Verde", price: 19500, category: "sopas", description: "", available: true },
      { name: "Sopa de Peixe", price: 25000, category: "sopas", description: "", available: true },
      { name: "Sopa do Cozido", price: 32000, category: "sopas", description: "Disponível sempre no dia a seguir ao cozido a Portuguesa", available: true },
      
      // Pizzas
      { name: "Pizza Margarita", price: 54000, category: "pizzas", description: "Base com tomate, queijo mozzarella, oregano e manjericão fresco", available: true },
      { name: "Pizza Vegetariana", price: 55000, category: "pizzas", description: "Espinafres, alho e queijo Feta", available: true },
      { name: "Pizza 3 Queijos", price: 59000, category: "pizzas", description: "Feta, Gouda, Mozzarella e Manjericão fresco", available: true },
      { name: "Pizza Regina", price: 59000, category: "pizzas", description: "Fiambre de aves, cogumelos e ovo", available: true },
      { name: "Pizza Atum", price: 69000, category: "pizzas", description: "Atum, cebola, Pimentos e azeitonas", available: true },
      { name: "Pizza Chouriço", price: 69000, category: "pizzas", description: "Chouriço às rodelas, cogumelos e Azeitonas", available: true },
      { name: "Pizza Frango", price: 69000, category: "pizzas", description: "Frango desfiado, cebola, ananás, milho, cogumelos e Azeitonas", available: true },
      { name: "Pizza La buena", price: 69000, category: "pizzas", description: "Alheira de Mirandela, espinafre e ovo", available: true },
      { name: "Pizza Mexicana", price: 69000, category: "pizzas", description: "Carne de vaca moída, cebola, pimento, piri-piri e azeitonas", available: true },
      { name: "Pizza Cajó", price: 76000, category: "pizzas", description: "Peito de frango e camarão", available: true },
      { name: "Pizza 4 estações", price: 79000, category: "pizzas", description: "2 fatias de frango, 2 mexicana, 2 atum e 2 margarita", available: true },
      { name: "Pizza Camarão", price: 85000, category: "pizzas", description: "Miolo de camarão salteado, delícias do mar e cebola picada", available: true },
      { name: "Pizza Carnívora", price: 99000, category: "pizzas", description: "Carne vaca, porco e frango, chouriço e azeitonas", available: true },
      { name: "Pizza Mariscada", price: 110000, category: "pizzas", description: "Camarão, delícias do mar, lulas, ameijoas, cebola em rodelas e coentros", available: true },
      
      // Massas & WOK
      { name: "Esparguete Carbonara", price: 59000, category: "massas", description: "Fiambre de porco aos cubos, natas e cogumelos", available: true },
      { name: "Fussilli c/ Alheira e espinafres", price: 59000, category: "massas", description: "", available: true },
      { name: "Noodles de ovo c/ peito de frango e ananás", price: 61000, category: "massas", description: "ovo, cebola, repolho e cenoura salteada e molho de soja", available: true },
      { name: "Esparguete à Bolonhesa", price: 61000, category: "massas", description: "", available: true },
      { name: "Lasanha de Vaca ou Frango", price: 61000, category: "massas", description: "", available: true },
      { name: "Lasanha Vegetariana", price: 61000, category: "massas", description: "", available: true },
      { name: "Penne c/ strogonoff de vaca ou de Frango", price: 61000, category: "massas", description: "", available: true },
      { name: "Noodles de ovo c/ vitela", price: 65000, category: "massas", description: "ovo, cebola, repolho e cenoura salteada e pimentos e soja", available: true },
      { name: "Noodles de Arroz c/ Bróculos e cogumelos Shitake", price: 66000, category: "massas", description: "ovo, cebola, repolho e cenoura salteada e molho de soja", available: true },
      { name: "Arroz preto c/ frutos do mar", price: 69000, category: "massas", description: "Lulas, Camarão e delícias do mar ovo, cebola, repolho e cenoura salteada", available: true },
      { name: "Noodles de Arroz c/ camarão", price: 69000, category: "massas", description: "ovo, cebola, repolho e cenoura salteada e molho de soja", available: true },
      
      // Pratos de Carne
      { name: "Hamburguer no Prato", price: 39500, category: "carnes", description: "Vaca, Ovo Estrelado, Salada Mista e Batata Frita", available: true },
      { name: "Bifana no Prato", price: 50000, category: "carnes", description: "Bife de Porco, Batata Frita e Ovo Estrelado", available: true },
      { name: "Prego no Prato", price: 50000, category: "carnes", description: "Bife de vaca ou Frango, Ovo Estrelado, Batata Frita", available: true },
      { name: "Febras Grelhadas", price: 52000, category: "carnes", description: "Bife de Porco, Salada Mista e Batata Frita", available: true },
      { name: "Alheira de Mirandela", price: 54000, category: "carnes", description: "Batata Frita e Ovo Estrelado", available: true },
      { name: "Bife à Buena", price: 54000, category: "carnes", description: "Bife de Vaca c/ molho especial de café, ovo estrelado e Batata Frita", available: true },
      { name: "Bife ao molho de Mostarda", price: 54000, category: "carnes", description: "Bife de Vaca c/ molho especial de Mostarda, ovo estrelado e Batata Frita", available: true },
      { name: "Bitoque", price: 54000, category: "carnes", description: "Bife de vaca ou Frango, Arroz branco, Ovo Estrelado, Salada Mista e Batata Frita", available: true },
      { name: "Prato do Dia", price: 54000, category: "carnes", description: "", available: true },
      { name: "1/2 Frango Grelhado", price: 55000, category: "carnes", description: "Batata Frita e salada Mista", available: true },
      { name: "Bife ao molho de Natas e Cogumelos", price: 57000, category: "carnes", description: "Bife de Vaca ou frango, Arroz e Batata Frita", available: true },
      { name: "Bife Grelhado", price: 59500, category: "carnes", description: "Bife de Vaca ou Frango, Batata e Salada Mista", available: true },
      { name: "Costeleta de Novilho Grelhada", price: 69000, category: "carnes", description: "Batata Frita e legumes salteados", available: true },
      { name: "Picanha no prato", price: 69000, category: "carnes", description: "3 fatias de Picanha, Feijão Preto, Ananás Grelhado, Arroz Branco e Batata Frita", available: true },
      { name: "Frango Grelhado", price: 79000, category: "carnes", description: "Batata Frita e salada Mista", available: true },
      { name: "Leitão à Moda da Bairrada", price: 780000, category: "carnes", description: "Por encomenda", available: true },
      
      // Pratos de Peixe
      { name: "Serra Grelhado", price: 69000, category: "peixes", description: "1 posta, Batata Frita, Salada repolho", available: true },
      { name: "Lulas Grelhadas", price: 69000, category: "peixes", description: "Batata cozida, Salada Mista e Molho de Manteiga e Limão", available: true },
      { name: "Bacalhau com Natas", price: 69500, category: "peixes", description: "", available: true },
      { name: "Camarões Fritos", price: 72000, category: "peixes", description: "5 Camarões T.K e Batata Frita", available: true },
      { name: "Dourada | Robalo Grelhado", price: 75000, category: "peixes", description: "Batata cozida e Salada Mista", available: true },
      { name: "Espetadas de Lulas e Camarão Grelhada", price: 75000, category: "peixes", description: "Batata Frita, Salada de Repolho", available: true },
      { name: "Salmão Grelhado", price: 75000, category: "peixes", description: "1 Posta, Batata Cozida e Legumes Salteados", available: true },
      { name: "Bacalhau Cozido", price: 79000, category: "peixes", description: "1 posta, Batata cozida, Grão, Couve, Ovo Cozido e alho picado", available: true },
      
      // Extras
      { name: "Ovo (Estrelado | Cozido | Mexido)", price: 11000, category: "extras", description: "", available: true },
      { name: "Ingrediente Extra", price: 12000, category: "extras", description: "", available: true },
      { name: "Dose de Arroz", price: 12500, category: "extras", description: "", available: true },
      { name: "Dose de Batata Frita", price: 14000, category: "extras", description: "", available: true },
      { name: "Dose de Legumes Cozidos", price: 25000, category: "extras", description: "Cenoura, Couve, repolho, feijão verde, bróculos (30 a 40 min a confeccionar)", available: true },
      
      // Bebidas
      { name: "Vumba 0,5l", price: 6000, category: "bebidas", description: "", available: true },
      { name: "Vumba 1,5l", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Soda", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Tónica", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Cappy Exótico, Manga ou Laranja", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Coca-Cola", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Cola-Zero", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Compal 200ml", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Dry Lemon", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Fanta Laranja, Ananás e Uva", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Giger Ale", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Sprite", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Sumol Laranja e Ananás", price: 10000, category: "bebidas", description: "", available: true },
      { name: "Pedras", price: 14000, category: "bebidas", description: "", available: true },
      { name: "Pedras Limão", price: 14000, category: "bebidas", description: "", available: true },
      { name: "Monster", price: 15000, category: "bebidas", description: "", available: true },
      { name: "Red Bull", price: 18000, category: "bebidas", description: "", available: true },
      { name: "Laranja (Sumo Natural)", price: 22000, category: "bebidas", description: "Frutas disponíveis dependendo da época", available: true },
      { name: "Limonada", price: 22000, category: "bebidas", description: "Frutas disponíveis dependendo da época", available: true },
      { name: "Sumos Naturais (Ananás, Maracujá, Melancia, Morango, etc.)", price: 22000, category: "bebidas", description: "Frutas disponíveis dependendo da época", available: true },
      { name: "Mix (Sumo Natural)", price: 28000, category: "bebidas", description: "Frutas disponíveis dependendo da época", available: true },
      
      // Cervejas
      { name: "Txilar Garrafa txoti", price: 8000, category: "cervejas", description: "", available: true },
      { name: "Heineken Retornável 250ml", price: 10000, category: "cervejas", description: "", available: true },
      { name: "Txilar Lata 330ml", price: 10000, category: "cervejas", description: "", available: true },
      { name: "Txilar Pressão 250ml", price: 10000, category: "cervejas", description: "", available: true },
      { name: "2M Txoti", price: 11000, category: "cervejas", description: "", available: true },
      { name: "Castle Lite", price: 12000, category: "cervejas", description: "", available: true },
      { name: "Flying Fish", price: 12000, category: "cervejas", description: "", available: true },
      { name: "Laurentina Preta", price: 12000, category: "cervejas", description: "", available: true },
      { name: "Coronita", price: 13000, category: "cervejas", description: "", available: true },
      { name: "Heineken Pressão 250ml", price: 13000, category: "cervejas", description: "", available: true },
      { name: "Savana", price: 14000, category: "cervejas", description: "", available: true },
      { name: "Heineken Pure Malt Lager Free Alcool 330ml", price: 14000, category: "cervejas", description: "", available: true },
      { name: "Corona", price: 15000, category: "cervejas", description: "", available: true },
      { name: "Stela Artois", price: 15000, category: "cervejas", description: "", available: true },
      { name: "Strongbow | Brutal Cidras", price: 15000, category: "cervejas", description: "", available: true },
      { name: "Heineken 210ml", price: 16000, category: "cervejas", description: "", available: true },
      { name: "Heineken Lata 330ml", price: 16000, category: "cervejas", description: "", available: true },
      { name: "Txilar Pressão 500ml", price: 16000, category: "cervejas", description: "", available: true },
      { name: "Heineken Pressão 350ml", price: 21000, category: "cervejas", description: "", available: true },
      
      // Sobremesas
      { name: "Gelados", price: 12000, category: "sobremesas", description: "", available: true },
      { name: "Salada de Frutas", price: 18000, category: "sobremesas", description: "", available: true },
      { name: "Petit Gateau", price: 25000, category: "sobremesas", description: "", available: true },
      { name: "Semi-Frio", price: 34000, category: "sobremesas", description: "", available: true },
    ];

    menuData.forEach((item) => {
      const menuItem: MenuItem = { ...item, id: this.currentMenuItemId++ };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.category === category
    );
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const reservation: Reservation = { 
      ...insertReservation, 
      id,
      status: "pending"
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (reservation) {
      reservation.status = status;
      this.reservations.set(id, reservation);
      return reservation;
    }
    return undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, order);
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }
}

export const storage = new MemStorage();