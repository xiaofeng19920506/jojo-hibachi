export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  preparationTime?: number; // in minutes
  isBaseProtein?: boolean; // indicates if this is a base protein for hibachi
}

export const menuItems: MenuItem[] = [
  // Base Proteins
  {
    id: "chicken",
    name: "Chicken",
    description: "Grilled chicken with vegetables, fried rice, and noodles",
    price: 0,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    isPopular: true,
    preparationTime: 20,
    isBaseProtein: true,
  },
  {
    id: "beef",
    name: "Beef",
    description: "Tender beef strips with vegetables, fried rice, and noodles",
    price: 0,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    isPopular: true,
    preparationTime: 18,
    isBaseProtein: true,
  },
  {
    id: "shrimp",
    name: "Shrimp",
    description: "Grilled shrimp with vegetables, fried rice, and noodles",
    price: 0,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    isPopular: true,
    preparationTime: 22,
    isBaseProtein: true,
  },
  {
    id: "salmon",
    name: "Salmon",
    description: "Grilled salmon with vegetables, fried rice, and noodles",
    price: 0,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Fish", "Soy"],
    preparationTime: 20,
    isBaseProtein: true,
  },
  {
    id: "scallops",
    name: "Scallops",
    description: "Sea scallops with vegetables, fried rice, and noodles",
    price: 15,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    preparationTime: 25,
    isBaseProtein: true,
  },
  {
    id: "lobster",
    name: "Lobster",
    description: "Fresh lobster with vegetables, fried rice, and noodles",
    price: 25,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    preparationTime: 30,
    isBaseProtein: true,
  },
  {
    id: "filet-mignon",
    name: "Filet Mignon",
    description:
      "Premium filet mignon with vegetables, fried rice, and noodles",
    price: 20,
    category: "Base Protein",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    preparationTime: 25,
    isBaseProtein: true,
  },

  // Additional Proteins (for adding to base)
  {
    id: "add-chicken",
    name: "Chicken",
    description: "Additional grilled chicken protein",
    price: 0,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    preparationTime: 15,
  },
  {
    id: "add-beef",
    name: "Beef",
    description: "Additional tender beef strips",
    price: 0,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    preparationTime: 12,
  },
  {
    id: "add-shrimp",
    name: "Shrimp",
    description: "Additional grilled shrimp",
    price: 0,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    preparationTime: 15,
  },
  {
    id: "add-salmon",
    name: "Salmon",
    description: "Additional grilled salmon",
    price: 0,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Fish", "Soy"],
    preparationTime: 15,
  },
  {
    id: "add-scallops",
    name: "Scallops",
    description: "Additional sea scallops",
    price: 15,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    preparationTime: 18,
  },
  {
    id: "add-lobster",
    name: "Lobster",
    description: "Additional fresh lobster",
    price: 25,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy", "Shellfish"],
    preparationTime: 20,
  },
  {
    id: "add-filet-mignon",
    name: "Filet Mignon",
    description: "Additional premium filet mignon",
    price: 20,
    category: "Additional Protein",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    preparationTime: 18,
  },

  // Appetizers
  {
    id: "edamame",
    name: "Edamame",
    description: "Steamed soybeans with sea salt",
    price: 6.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    isVegetarian: true,
    allergens: ["Soy"],
    preparationTime: 5,
  },
  {
    id: "gyoza",
    name: "Gyoza (Dumplings)",
    description: "Pan-fried dumplings filled with pork and vegetables",
    price: 8.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    allergens: ["Soy", "Gluten"],
    isPopular: true,
    preparationTime: 8,
  },
  {
    id: "shrimp-tempura",
    name: "Shrimp Tempura",
    description: "Crispy shrimp tempura with dipping sauce",
    price: 12.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Gluten", "Shellfish"],
    isPopular: true,
    preparationTime: 10,
  },
  {
    id: "vegetable-tempura",
    name: "Vegetable Tempura",
    description: "Assorted vegetables lightly battered and fried to perfection",
    price: 9.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    isVegetarian: true,
    allergens: ["Gluten"],
    preparationTime: 12,
  },
  {
    id: "miso-soup",
    name: "Miso Soup",
    description: "Traditional miso soup with tofu and seaweed",
    price: 4.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    isVegetarian: true,
    preparationTime: 5,
  },
  {
    id: "seaweed-salad",
    name: "Seaweed Salad",
    description: "Fresh seaweed salad with sesame dressing",
    price: 7.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    isVegetarian: true,
    preparationTime: 3,
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "Crispy chicken wings with teriyaki sauce",
    price: 11.99,
    category: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    allergens: ["Soy"],
    isPopular: true,
    preparationTime: 15,
  },
];

export const categories = [
  "All",
  "Base Protein",
  "Additional Protein",
  "Appetizer",
];

export const getMenuItemsByCategory = (category: string) => {
  if (category === "All") {
    return menuItems;
  }
  return menuItems.filter((item) => item.category === category);
};

export const getBaseProteins = () => {
  return menuItems.filter((item) => item.isBaseProtein);
};

export const getAdditionalProteins = () => {
  return menuItems.filter((item) => item.category === "Additional Protein");
};

export const getPopularItems = () => {
  return menuItems.filter((item) => item.isPopular);
};

export const getVegetarianItems = () => {
  return menuItems.filter((item) => item.isVegetarian);
};

export const getSpicyItems = () => {
  return menuItems.filter((item) => item.isSpicy);
};
