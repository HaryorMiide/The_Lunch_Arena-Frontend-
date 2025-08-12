import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Users,
  MessageSquare,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface FoodItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  prepTime?: string;
  image: string;
  category?: string;
}
interface RentalItem {
  id: number;
  title: string;
  description?: string;
  price: number;
  price_type: string;
  category?: string;
  image: string;
  available: boolean;
}
interface ActivityLog {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [viewingRental, setViewingRental] = useState(false);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalRentals: 0,
    availableRentals: 0,
    activities: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<FoodItem | RentalItem | null>(null);
  const [foodForm, setFoodForm] = useState({
    food_name: "",
    description: "",
    price: "",
    image: "",
    prep_time: "",
    category: "general",
    customCategory: "",
  });
  const [rentalForm, setRentalForm] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "per_night",
    category: "general",
    customCategory: "",
    image: "",
    available: true,
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const categories = [
    "appetizers",
    "main_course",
    "desserts",
    "beverages",
    "other",
  ];

  // Update form state when editing
  const handleEdit = (item: FoodItem | RentalItem) => {
    setEditing(item);
    if ("name" in item) {
      setFoodForm({
        food_name: item.name || "",
        description: item.description || "",
        price: item.price.toString() || "",
        prep_time: item.prepTime || "",
        image: "",
        category: categories.includes(item.category || "")
          ? item.category || "general"
          : "other",
        customCategory: categories.includes(item.category || "")
          ? ""
          : item.category || "",
      });
      setShowCustomCategory(!categories.includes(item.category || ""));
    } else {
      setRentalForm({
        title: item.title || "",
        description: item.description || "",
        price: item.price.toString() || "",
        price_type: item.price_type || "per_night",
        category: categories.includes(item.category || "")
          ? item.category || "general"
          : "other",
        customCategory: categories.includes(item.category || "")
          ? ""
          : item.category || "",
        image: "",
        available: item.available,
      });
      setShowCustomCategory(!categories.includes(item.category || ""));
    }
    setIsAdding(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          foodResponse,
          rentalResponse,
          logResponse,
          foodCountResponse,
          rentalCountResponse,
          availableRentalCountResponse,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/foods`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/activity/logs`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/count`),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals/count`
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/v1/rentals/count/available`
          ),
        ]);

        setMenuItems(
          foodResponse.data.data.map((item: FoodItem) => ({
            ...item,
            price: Number(item.price) || 0,
            category: item.category || "general",
          }))
        );
        setRentalItems(
          rentalResponse.data.data.map((item: RentalItem) => ({
            ...item,
            price: Number(item.price) || 0,
            image: `${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`,
            available: Boolean(item.available),
          }))
        );
        setRecentActivities(
          Array.isArray(logResponse.data.logs) ? logResponse.data.logs : []
        );
        setStats({
          totalFoods: Number(foodCountResponse.data.total) || 0,
          totalRentals: Number(rentalCountResponse.data.total) || 0,
          availableRentals:
            Number(availableRentalCountResponse.data.available) || 0,
          activities: Array.isArray(logResponse.data.logs)
            ? logResponse.data.logs.length
            : 0,
        });
      } catch (error) {
        console.error("Fetch error:", error.message);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/admin";
        }
      }
    };
    fetchData();
  }, []);

  const handleFoodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (foodForm.category === "other") {
      fd.set("category", foodForm.customCategory);
    }
    try {
      if (editing) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/${
            (editing as FoodItem).id
          }`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedItems = menuItems.map((item) =>
          item.id === (editing as FoodItem).id
            ? {
                ...item,
                name: fd.get("food_name") as string,
                description: fd.get("description") as string,
                price: parseFloat(fd.get("price") as string) || 0,
                prepTime: fd.get("prep_time") as string,
                category:
                  foodForm.category === "other"
                    ? foodForm.customCategory
                    : (fd.get("category") as string),
                image: response.data.image
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                      response.data.image
                    }`
                  : item.image,
              }
            : item
        );
        setMenuItems(updatedItems);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const newItem: FoodItem = {
          id: response.data.id || Date.now(),
          name: fd.get("food_name") as string,
          description: fd.get("description") as string,
          price: parseFloat(fd.get("price") as string) || 0,
          image: response.data.image
            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                response.data.image
              }`
            : "",
          prepTime: fd.get("prep_time") as string,
          category:
            foodForm.category === "other"
              ? foodForm.customCategory
              : (fd.get("category") as string),
        };
        setMenuItems([...menuItems, newItem]);
      }
      resetFoodForm();
      setIsAdding(false);
      setEditing(null);
    } catch (error) {
      console.error("Error handling food:", error);
      alert(error.response?.data?.message || "Failed to handle food item.");
    }
  };

  const handleFoodDelete = async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting food:", error);
      alert(error.response?.data?.message || "Failed to delete food item.");
    }
  };

  const handleRentalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("available", rentalForm.available.toString());
    if (rentalForm.category === "other") {
      fd.set("category", rentalForm.customCategory);
    }
    try {
      if (editing) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals/${
            (editing as RentalItem).id
          }`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedItems = rentalItems.map((item) =>
          item.id === (editing as RentalItem).id
            ? {
                ...item,
                title: fd.get("title") as string,
                description: fd.get("description") as string,
                price: parseFloat(fd.get("price") as string) || 0,
                price_type: fd.get("price_type") as string,
                category:
                  rentalForm.category === "other"
                    ? rentalForm.customCategory
                    : (fd.get("category") as string),
                image: response.data.image
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                      response.data.image
                    }`
                  : item.image,
                available: rentalForm.available,
              }
            : item
        );
        setRentalItems(updatedItems);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const newItem: RentalItem = {
          id: response.data.id || Date.now(),
          title: fd.get("title") as string,
          description: fd.get("description") as string,
          price: parseFloat(fd.get("price") as string) || 0,
          price_type: fd.get("price_type") as string,
          category:
            rentalForm.category === "other"
              ? rentalForm.customCategory
              : (fd.get("category") as string),
          image: response.data.image
            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                response.data.image
              }`
            : "",
          available: rentalForm.available,
        };
        setRentalItems([...rentalItems, newItem]);
      }
      resetRentalForm();
      setIsAdding(false);
      setEditing(null);
    } catch (error) {
      console.error("Error handling rental:", error);
      alert(error.response?.data?.message || "Failed to handle rental item.");
    }
  };

  const handleRentalDelete = async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rentals/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRentalItems(rentalItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting rental:", error);
      alert(error.response?.data?.message || "Failed to delete rental item.");
    }
  };

  const resetFoodForm = () =>
    setFoodForm({
      food_name: "",
      description: "",
      price: "",
      image: "",
      prep_time: "",
      category: "general",
      customCategory: "",
    });

  const resetRentalForm = () =>
    setRentalForm({
      title: "",
      description: "",
      price: "",
      price_type: "per_night",
      category: "general",
      customCategory: "",
      image: "",
      available: true,
    });

  const handleFoodFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleRentalFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRentalForm({ ...rentalForm, [e.target.name]: e.target.value });
  };

  const handleRentalAvailableChange = (checked: boolean) => {
    setRentalForm({ ...rentalForm, available: checked });
  };

  const currentItems = viewingRental ? rentalItems : menuItems;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/admin";
          }}
        >
          Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Foods",
            value: stats.totalFoods,
            icon: Package,
            color: "text-green-600",
          },
          {
            title: "Total Rentals",
            value: stats.totalRentals,
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Available Rentals",
            value: stats.availableRentals,
            icon: Users,
            color: "text-purple-600",
          },
          {
            title: "Activities",
            value: stats.activities,
            icon: MessageSquare,
            color: "text-orange-600",
          },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.title}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
              <s.icon className={`${s.color} h-6 w-6`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:flex lg:gap-8 space-y-6 lg:space-y-0">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={viewingRental ? "outline" : "default"}
                className={`w-full justify-start ${
                  !viewingRental ? "bg-primary text-white" : ""
                }`}
                onClick={() => {
                  setViewingRental(false);
                  setIsAdding(false);
                  setEditing(null);
                  resetFoodForm();
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Menu Management
              </Button>
              <Button
                variant={viewingRental ? "default" : "outline"}
                className={`w-full justify-start ${
                  viewingRental ? "bg-primary text-white" : ""
                }`}
                onClick={() => {
                  setViewingRental(true);
                  setIsAdding(false);
                  setEditing(null);
                  resetRentalForm();
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Rental Management
              </Button>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold">
            {viewingRental ? "Rental Management" : "Menu Management"}
          </h2>

          <Dialog
            open={isAdding}
            onOpenChange={(open) => {
              setIsAdding(open);
              if (!open) {
                setEditing(null);
                resetFoodForm();
                resetRentalForm();
                setShowCustomCategory(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null);
                  resetFoodForm();
                  resetRentalForm();
                  setShowCustomCategory(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {viewingRental ? "Rental Item" : "Food Item"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editing
                    ? `Edit ${viewingRental ? "Rental" : "Food"}`
                    : `Add ${viewingRental ? "Rental" : "Food"}`}
                </DialogTitle>
                <DialogDescription>
                  {editing
                    ? `Update details for the ${
                        viewingRental ? "rental" : "food"
                      } item.`
                    : `Enter details for a new ${
                        viewingRental ? "rental" : "food"
                      } item.`}
                </DialogDescription>
              </DialogHeader>
              {viewingRental ? (
                <form onSubmit={handleRentalSubmit} className="space-y-4">
                  <Input
                    name="title"
                    placeholder="Title"
                    value={rentalForm.title}
                    onChange={handleRentalFormChange}
                    required
                  />
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={rentalForm.description}
                    onChange={handleRentalFormChange}
                  />
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={rentalForm.price}
                    onChange={handleRentalFormChange}
                    required
                  />
                  <Input
                    name="price_type"
                    placeholder="per_night"
                    value={rentalForm.price_type}
                    onChange={handleRentalFormChange}
                    required
                  />
                  <Select
                    name="category"
                    value={rentalForm.category}
                    onValueChange={(value) => {
                      setRentalForm({ ...rentalForm, category: value });
                      setShowCustomCategory(value === "other");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showCustomCategory && (
                    <Input
                      name="customCategory"
                      placeholder="Enter custom category"
                      value={rentalForm.customCategory}
                      onChange={handleRentalFormChange}
                      required
                    />
                  )}
                  <Input name="image" type="file" accept="image/*" />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      name="available"
                      checked={rentalForm.available}
                      onCheckedChange={handleRentalAvailableChange}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editing ? "Update Rental" : "Create Rental"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleFoodSubmit} className="space-y-4">
                  <Input
                    name="food_name"
                    placeholder="Food Name"
                    value={foodForm.food_name}
                    onChange={handleFoodFormChange}
                    required
                  />
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={foodForm.description}
                    onChange={handleFoodFormChange}
                  />
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={foodForm.price}
                    onChange={handleFoodFormChange}
                    required
                  />
                  <Input
                    name="prep_time"
                    placeholder="e.g. 30 mins"
                    value={foodForm.prep_time}
                    onChange={handleFoodFormChange}
                    required
                  />
                  <Select
                    name="category"
                    value={foodForm.category}
                    onValueChange={(value) => {
                      setFoodForm({ ...foodForm, category: value });
                      setShowCustomCategory(value === "other");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showCustomCategory && (
                    <Input
                      name="customCategory"
                      placeholder="Enter custom category"
                      value={foodForm.customCategory}
                      onChange={handleFoodFormChange}
                      required
                    />
                  )}
                  <Input name="image" type="file" accept="image/*" />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editing ? "Update Food" : "Create Food"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <div className="space-y-4">
            {currentItems.map((item) => {
              const key = (
                viewingRental ? (item as RentalItem).id : (item as FoodItem).id
              ) as number;
              return (
                <Card key={key}>
                  <CardContent className="p-6 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <img
                          src={
                            viewingRental
                              ? (item as RentalItem).image
                              : `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                                  (item as FoodItem).image
                                }`
                          }
                          alt={
                            viewingRental
                              ? (item as RentalItem).title
                              : (item as FoodItem).name
                          }
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/80";
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {viewingRental
                              ? (item as RentalItem).title
                              : (item as FoodItem).name}
                          </h3>
                          <p className="text-primary font-bold">
                            ₦
                            {(viewingRental
                              ? Number((item as RentalItem).price)
                              : Number((item as FoodItem).price)
                            ).toFixed(2)}
                            {viewingRental &&
                              ` / ${(item as RentalItem).price_type}`}
                          </p>
                          {!viewingRental && (item as FoodItem).prepTime && (
                            <p className="text-sm text-muted-foreground">
                              Prep Time: {(item as FoodItem).prepTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {viewingRental
                          ? (item as RentalItem).description
                          : (item as FoodItem).description}
                      </p>
                      {viewingRental && !(item as RentalItem).available && (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (viewingRental) {
                            handleRentalDelete((item as RentalItem).id);
                          } else {
                            handleFoodDelete((item as FoodItem).id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {currentItems.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>No {viewingRental ? "rental" : "food"} items yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-3"
                    >
                      {activity.description}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activities.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
