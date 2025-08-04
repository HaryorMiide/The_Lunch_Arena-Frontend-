import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChefHat, Calendar, Utensils, Heart } from "lucide-react";
import restaurantHero from "@/assets/image60.jpg";
import showcaseImg from "../assets/image4.jpg";

const Home = () => {
  const features = [
    {
      icon: <Utensils className="h-8 w-8 text-primary" />,
      title: "Exquisite Dining",
      description:
        "Fresh ingredients crafted into memorable culinary experiences",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Event Planning",
      description:
        "From intimate gatherings to grand celebrations, we make it perfect",
    },
    {
      icon: <ChefHat className="h-8 w-8 text-primary" />,
      title: "Expert Chefs",
      description: "Award-winning culinary team dedicated to excellence",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Made with Love",
      description:
        "Every dish and event is crafted with passion and attention to detail",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 25, 35, 0.6), rgba(25, 95, 53, 0.4)), url(${restaurantHero})`,
        }}
      >
        <div className="text-center text-white z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-green-500">The Lunch Arena</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Where exceptional cuisine meets unforgettable experience . Creating
            memories one meal at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg"
            >
              <Link to="/menu">Explore Our Menu</Link>
            </Button>
            <Link to="/events">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-restaurant-earth bg-white hover:bg-transparent hover:text-white px-8 py-4 text-lg"
              >
                Plan Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            About The Lunch Arena
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to The Lunch Arena, where affordability meets deliciousness
            in a relaxing atmosphere! We're more than just a dining spot,we're
            your go-to destination for memorable meals and delightful
            experiences. Whether you're sneaking away for a solo lunch break,
            hosting a lively gathering with friends, or ordering office lunch
            packs for your hardworking team, we’ve got you covered with fresh,
            flavorful dishes that satisfy every craving. Our passion for quality
            food and warm hospitality ensures every visit feels like a treat.
            Join us and discover why The Lunch Arena is the perfect place to
            dine, connect, and unwind!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Our Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Restaurant Dining
              </h3>
              <p className="text-muted-foreground mb-6">
                Experience our carefully curated menu featuring fresh,
                locally-sourced ingredients prepared by our expert culinary
                team. From casual dining to special occasions.
              </p>
              <Button asChild>
                <Link to="/menu">View Menu</Link>
              </Button>
            </Card>
            <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Event Planning
              </h3>
              <p className="text-muted-foreground mb-6">
                From intimate gatherings to grand celebrations, we provide
                comprehensive event planning services including catering, venue
                setup, and coordination.
              </p>
              <Button asChild>
                <Link to="/events">Plan Event</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Section */}
      {/* <section
        style={{
          backgroundImage: `url(${showcaseImg})`,
        }}
        className="w-full h-[500px] bg-cover bg-center bg-fixed flex items-center justify-center relative"
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-4">
            Experience Elegance and Taste
          </h2>
          <p className="text-lg max-w-xl mx-auto">
            Whether it's a cozy dinner or a grand celebration, we set the scene
            and serve the flavor.
          </p>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
