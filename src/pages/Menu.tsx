import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Utensils,
  Clock,
  Star,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import showcaseImg from "../assets/image80.jpg";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  prepTime?: string;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cart } = useCart();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching menu items at:", new Date().toISOString());
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods`,
        {
          mode: "cors",
        }
      );
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data && Array.isArray(data.data)) {
        const validItems = data.data
          .filter(
            (item) =>
              typeof item.name === "string" && item.name.trim().length > 0
          )
          .map((item) => ({
            id: item.id || "",
            name: item.name,
            description: item.description || "",
            price: Number(item.price) || 0,
            category: item.category || "uncategorized",
            image: item.image
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`
              : "/api/placeholder/400/300",
            prepTime: item.prep_time || "",
          }));
        console.log("Valid items after filtering:", validItems);
        setMenuItems(validItems);
        if (validItems.length === 0) {
          setError("No valid menu items available.");
        }
      } else {
        console.error("API returned invalid data structure:", data);
        setMenuItems([]);
        setError("Invalid data received from server.");
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      setMenuItems([]);
      setError(`Failed to load menu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    const interval = setInterval(fetchMenuItems, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get unique categories from menu items
  const categories = [
    { id: "all", name: "All Items" },
    ...Array.from(new Set(menuItems.map((item) => item.category))).map(
      (cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
      })
    ),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: FoodItem) => {
    addToCart({ ...item, type: "food" });
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-restaurant rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Menu
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMenuItems}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-restaurant-secondary to-background">
      <section
        className="bg-cover bg-center text-white py-20"
        style={{ backgroundImage: `url(${showcaseImg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Utensils className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the finest
            ingredients
          </p>
        </div>
      </section>

      <section className="py-8 bg-background/80 backdrop-blur-sm sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "event" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className="min-w-24"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-primary hover:text-event" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-warm transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-foreground"
                      >
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-restaurant">
                        ₦{item.price}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {item.prepTime && (
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.prepTime}
                      </div>
                    )}

                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 font-medium transition-all duration-200 bg-gradient-to-r from-purple-700 to-blue-600 text-white hover:from-purple-800 hover:to-blue-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
              <Button className="mt-4" onClick={fetchMenuItems}>
                Retry
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
