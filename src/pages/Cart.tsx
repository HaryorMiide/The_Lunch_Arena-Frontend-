import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useCart();

  // Debug: Log cart contents
  console.log("Cart contents:", cart);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const message = cart
      .map((item) => {
        const priceDisplay =
          item.type === "rental" ? `$${item.price}/day` : `$${item.price}`;
        return `${item.name} x${item.quantity} - ${priceDisplay}`;
      })
      .join("\n");

    const fullMessage = `I'd like to ${
      cart.some((item) => item.type === "rental") ? "rent" : "order"
    } the following items:\n\n${message}\n\nPlease confirm availability and ${
      cart.some((item) => item.type === "rental") ? "rental" : "order"
    } terms.`;
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(
      fullMessage
    )}`;
    window.open(url, "_blank");
  };

  // Check item types with fallback for undefined type
  const hasOnlyFood = cart.every((item) => item.type === "food" || !item.type);
  const hasOnlyRentals = cart.every((item) => item.type === "rental");
  const hasMixedItems =
    cart.some((item) => item.type === "food" || !item.type) &&
    cart.some((item) => item.type === "rental");

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <div>
          {hasOnlyFood && (
            <Link to="/menu">
              <Button variant="outline" className="mr-2">
                ← Back to Menu
              </Button>
            </Link>
          )}
          {hasOnlyRentals && (
            <Link to="/rentals">
              <Button variant="outline">← Back to Rentals</Button>
            </Link>
          )}
          {hasMixedItems && (
            <>
              <Link to="/menu">
                <Button variant="outline" className="mr-2">
                  ← Back to Menu
                </Button>
              </Link>
              <Link to="/rentals">
                <Button variant="outline">← Back to Rentals</Button>
              </Link>
            </>
          )}
          {/* Fallback: Show both if type is undefined or logic fails */}
          {!hasOnlyFood &&
            !hasOnlyRentals &&
            !hasMixedItems &&
            cart.length > 0 && (
              <>
                <Link to="/menu">
                  <Button variant="outline" className="mr-2">
                    ← Back to Menu
                  </Button>
                </Link>
                <Link to="/rentals">
                  <Button variant="outline">← Back to Rentals</Button>
                </Link>
              </>
            )}
        </div>
      </div>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price}
                    {item.type === "rental" && "/day"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => decreaseQty(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => increaseQty(item.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button onClick={handleCheckout}>Checkout via WhatsApp</Button>
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
