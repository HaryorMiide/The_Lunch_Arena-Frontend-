import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import showcaseImg from "../assets/image6.jpg";
import {
  Package,
  CheckCircle,
  XCircle,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface RentalItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  availability: "available" | "unavailable";
}

const Rentals = () => {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, cart } = useCart();

  const fetchRentalItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals?t=${Date.now()}`,
        { mode: "cors" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched rental data:", data);

      if (data && Array.isArray(data.data)) {
        const validItems = data.data.map((item) => ({
          id: item.id || "",
          name: item.title || item.name || "Unnamed Item",
          description: item.description || "",
          price: Number(item.price) || 0,
          category: item.category || "uncategorized",
          image: item.image
            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`
            : "/api/placeholder/400/300",
          availability: item.available ? "available" : "unavailable",
        }));
        setRentalItems(validItems);
      } else {
        setRentalItems([]);
        setError("Invalid data received from server.");
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      setRentalItems([]);
      setError(`Failed to load rentals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalItems();
    const interval = setInterval(fetchRentalItems, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Get unique categories from rental items
  const categories = [
    { id: "all", name: "All Items" },
    ...Array.from(new Set(rentalItems.map((item) => item.category))).map(
      (cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
      })
    ),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? rentalItems
      : rentalItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: RentalItem) => {
    addToCart({ ...item, type: "rental" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-event rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rental inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Rentals
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchRentalItems}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-event-secondary to-background">
      {/* Header */}
      <section
        className="bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `url(${showcaseImg})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Rentals</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Everything you need to create the perfect event atmosphere
          </p>
        </div>
      </section>

      {/* Category Filter + Cart Icon */}
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

      {/* Rental Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:scale-105"
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
                        variant={
                          item.availability === "available"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          item.availability === "available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {item.availability === "available" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {item.availability === "available"
                          ? "Available"
                          : "Unavailable"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-event">
                        ₦{item.price}/day
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.availability === "unavailable"}
                      className={`w-full flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
                        item.availability === "available"
                          ? "bg-gradient-to-r from-purple-700 to-blue-600 text-white hover:from-purple-800 hover:to-blue-700"
                          : "border border-muted text-muted-foreground cursor-not-allowed bg-muted"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      {item.availability === "available"
                        ? "Add to Cart"
                        : "Currently Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rentals;
