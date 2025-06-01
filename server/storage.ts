import { 
  users, 
  menuItems, 
  reservations,
  type User, 
  type InsertUser, 
  type MenuItem, 
  type InsertMenuItem,
  type Reservation,
  type InsertReservation 
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private reservations: Map<number, Reservation>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentReservationId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentReservationId = 1;
    
    // Initialize with menu data
    this.initializeMenuData();
  }

  private initializeMenuData() {
    const menuData = [
      // Cafetaria
      { name: "Banheira de Café", price: 11000, category: "cafetaria", description: "", available: true },
      { name: "Banheira de Descafeinado", price: 12000, category: "cafetaria", description: "", available: true },
      { name: "Café", price: 9000, category: "cafetaria", description: "", available: true },
      { name: "Café com Leite | Meia de Leite", price: 13000, category: "cafetaria", description: "", available: true },
      { name: "Café Duplo", price: 18000, category: "cafetaria", description: "", available: true },
      { name: "Café Pingado", price: 10000, category: "cafetaria", description: "", available: true },
      { name: "Capuccino", price: 14000, category: "cafetaria", description: "", available: true },
      { name: "Carioca de Café", price: 8000, category: "cafetaria", description: "", available: true },
      { name: "Carioca de Limão", price: 8000, category: "cafetaria", description: "", available: true },
      { name: "Chá (1 Folha)", price: 9000, category: "cafetaria", description: "", available: true },
      { name: "Chá c/ Leite | Chá Gengibre c/ mel e limão", price: 15000, category: "cafetaria", description: "", available: true },
      { name: "Chocolate Quente", price: 15000, category: "cafetaria", description: "", available: true },
      { name: "Copo de Leite", price: 13000, category: "cafetaria", description: "", available: true },
      { name: "Descafeínado", price: 10000, category: "cafetaria", description: "", available: true },
      { name: "Galão", price: 14000, category: "cafetaria", description: "", available: true },
      { name: "Galão Descafeínado", price: 15000, category: "cafetaria", description: "", available: true },
      { name: "Garoto", price: 11000, category: "cafetaria", description: "", available: true },
      { name: "Leite Ucal (Garrafa 0,33)", price: 17500, category: "cafetaria", description: "", available: true },
      
      // Pastelaria
      { name: "Bolo de Arroz", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Croissant com Manteiga", price: 14000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Fiambre | Queijo", price: 16500, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Nutella", price: 20000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Ovo Mexido", price: 21000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Ovo mexido e Queijo", price: 26000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Presunto", price: 25000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Queijo e Tomate", price: 23000, category: "pastelaria", description: "", available: true },
      { name: "Croissant de Queijo, fiambre e Tomate", price: 24000, category: "pastelaria", description: "", available: true },
      { name: "Croissant Misto (Quejo e Fiambre)", price: 23000, category: "pastelaria", description: "", available: true },
      { name: "Croissant Simples", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Palmier Simples", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Pastel de Feijão", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Pastel de Nata", price: 10000, category: "pastelaria", description: "", available: true },
      { name: "Queque", price: 10000, category: "pastelaria", description: "", available: true },
      
      // Torradas
      { name: "1/2 Torrada com manteiga", price: 8000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "1/2 Torrada de Fiambre ou Queijo", price: 13000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "1/2 Torrada Mista (Quejo e Fiambre)", price: 15000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada com manteiga", price: 11000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada de Fiambre | Queijo", price: 19000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Torrada Mista (Quejo e Fiambre)", price: 22000, category: "torradas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      
      // Tostas
      { name: "Tosta de Fiambre | Queijo", price: 20000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta La Buena (Queijo, Tomate e Oregãos)", price: 23000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Mista (Quejo e Fiambre)", price: 25000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Ovo mexido e Chouriço", price: 34000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Ovo mexido e Queijo", price: 26000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Paté de Atum |de Frutos do Mar | de Frango (Alface e Tomate)", price: 26000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Presunto", price: 32000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Tosta Presunto e Queijo", price: 36000, category: "tostas", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      
      // Sandes
      { name: "Sandes de Chourição | Chouriço", price: 21000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Fiambre", price: 17500, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Manteiga", price: 11000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Ovo Mexido", price: 19000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Presunto", price: 26000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Presunto e Queijo", price: 30000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes de Queijo", price: 17500, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes Mista (Fiambre e Queijo)", price: 20000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      { name: "Sandes Paté de Atum |de Frutos do Mar | de Frango (Alface e Tomate)", price: 25000, category: "sandes", description: "Pão de forma Branco ou Integral | Pão de água | Pão Português", available: true },
      
      // Breakfast Americano
      { name: "Chicago", price: 35000, category: "breakfast", description: "1/2 Torrada+2 ovos +1 galão+1 fatia de presunto", available: true },
      { name: "Los Angeles", price: 54000, category: "breakfast", description: "1 Torrada + 2 ovos + 3 salsichas +2 fatias de presunto + 1 sumo natural de Laranja + café", available: true },
      { name: "Nova Iorque", price: 40000, category: "breakfast", description: "1 Torrada+2ovos+3 salsichas+2 fatias Bacon+Banheira café", available: true },
      
      // Baguetes
      { name: "Baguete 'Á Trincheiras' (Bifana,cebola frita e Colorau)", price: 39500, category: "baguetes", description: "", available: true },
      { name: "Baguete com bifana | Prego (batata Frita)", price: 44500, category: "baguetes", description: "", available: true },
      { name: "Baguete com Bifana | Prego Especial (2 ovos, queijo e batata Frita)", price: 50000, category: "baguetes", description: "", available: true },
      { name: "Baguete com Manteiga", price: 16000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Bacon Frito", price: 30000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Chourição e Queijo", price: 36000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Fiambre", price: 20000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Fiambre, Queijo e Tomate", price: 30000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Ovo Mexido", price: 27500, category: "baguetes", description: "", available: true },
      { name: "Baguete de Ovo Mexido especial (Ovo,Alface,Tomate,Fiambre,Bacon frito e Queijo)", price: 43000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Paté de Atum | de frutos do Mar |de Frango (Alface e Tomate)", price: 32000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Picanha (batata Frita)", price: 49500, category: "baguetes", description: "", available: true },
      { name: "Baguete de Presunto", price: 35000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Presunto e Ovo", price: 38000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Presunto, Ovo e Tomate", price: 41000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Queijo", price: 20000, category: "baguetes", description: "", available: true },
      { name: "Baguete de Queijo e Tomate", price: 25000, category: "baguetes", description: "", available: true },
      { name: "Baguete Mista (Fiambre e Queijo)", price: 28000, category: "baguetes", description: "", available: true },
      { name: "Baguete Simples", price: 14000, category: "baguetes", description: "", available: true },
      { name: "Baguete Torrada", price: 16000, category: "baguetes", description: "", available: true },
      
      // Snacks | Salgados
      { name: "Bifana no pão de água (batata frita)", price: 30000, category: "snacks", description: "", available: true },
      { name: "Chamussas de Vaca (2 Unidades)", price: 13000, category: "snacks", description: "", available: true },
      { name: "Empada de frango (1 Unidade)", price: 8000, category: "snacks", description: "", available: true },
      { name: "Hamburguer Completo (Alface, tomate, ovo estrelado, queijo e batata frita)", price: 31000, category: "snacks", description: "", available: true },
      { name: "Hamburguer La Buena (Alface, tomate, ovo estrelado, queijo, cebola frita, bacon frito e batata frita)", price: 36000, category: "snacks", description: "", available: true },
      { name: "Hamburguer Queijo (Alface, tomate e queijo)", price: 25000, category: "snacks", description: "", available: true },
      { name: "Hamburguer Simples (Alface e tomate)", price: 19500, category: "snacks", description: "", available: true },
      { name: "Pastéis de Bacalhau (2 Unidades)", price: 17500, category: "snacks", description: "", available: true },
      { name: "Prego de Picanha no pão de água (batata frita)", price: 39500, category: "snacks", description: "", available: true },
      { name: "Prego de Vaca ou Frango no pão de água (batata frita)", price: 30000, category: "snacks", description: "", available: true },
      { name: "Rissóis de Camarão (2 Unidades)", price: 13000, category: "snacks", description: "", available: true },
      
      // Omeletes
      { name: "Omelete de Atum", price: 39000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Camarão", price: 42000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Chourição | de Chouriço | de Vegetais", price: 38000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Presunto", price: 45000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Presunto e Queijo", price: 49500, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Queijo | Fiambre", price: 32000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Queijo e Cogumelos", price: 38000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete de Tomate picado", price: 32000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete Mista (Queijo e Fiambre)", price: 38000, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      { name: "Omelete Simples", price: 29500, category: "omeletes", description: "Todas as omeletes são confecionadas com salsa,cebola picada e são servidas com batata frita e salada mista", available: true },
      
      // Saladas
      { name: "Salada do Mar (Alface,Frutos do mar,Camarão, Tomate, Cenoura e Milho)", price: 48000, category: "saladas", description: "", available: true },
      { name: "Salada Fit (Tomate, Cenoura, Quinoa, Espinafres Salteados, Ananás, e Sementes de sesamo)", price: 45000, category: "saladas", description: "", available: true },
      { name: "Salada Grega (Alface, Tomate, Azeitonas, Queijo feta e Oregãos)", price: 41000, category: "saladas", description: "", available: true },
      { name: "Salada Havaiana (Atum, Alface,Tomate,Cenoura,Milho, Cebola picada e Ovo cozido)", price: 42000, category: "saladas", description: "", available: true },
      { name: "Salada Mista (Alface, tomate, cebola, Pepino, e Cenoura)", price: 28000, category: "saladas", description: "", available: true },
      { name: "Salada Tropical (Alface,Cenoura, Milho, peito de Frango grelhado aos cubos+Massa fusilli e Ananás)", price: 43000, category: "saladas", description: "", available: true }
    ];

    menuData.forEach(item => {
      const menuItem: MenuItem = {
        id: this.currentMenuItemId++,
        ...item
      };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
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
      (item) => item.category === category,
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
}

export const storage = new MemStorage();
