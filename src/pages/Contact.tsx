import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "256px",
};

const center = {
  lat: 6.617234, // Replace with your restaurant's latitude
  lng: 3.35445, // Replace with your restaurant's longitude
};

const Contact = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: "08026008230",
      subtext: "Call us for reservations or inquiries",
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: "theluncharena@gmail.com",
      subtext: "Send us your questions or feedback",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      details: "Old RADLAG Water Building 1, Lateef Jakande Road",
      subtext: "Agidingbi, Ikeja",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Hours",
      details: "Mon-Sun: 8:00 AM - 6:00 PM",
      subtext: "Kitchen closes 30 minutes before",
    },
  ];

  const handleWhatsAppContact = () => {
    const message = "Hi, I have a question about your services";
    const whatsappUrl = `https://wa.me/+2348026008230?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you! Get in touch for reservations, event
            planning, or any questions about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {info.title}
                        </h3>
                        <p className="text-foreground font-medium">
                          {info.details}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {info.subtext}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* WhatsApp Section */}
            <Card className="p-6 bg-gradient-to-br from-restaurant-warm/10 to-restaurant-gold/10 border-restaurant-warm/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-restaurant-warm" />
                  <span>Quick Contact via WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Need immediate assistance? Contact us directly through
                  WhatsApp for quick responses to your inquiries.
                </p>
                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Us
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-8">
            {/* Google Map */}
            <Card className="overflow-hidden">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Why Choose The Lunch Arena?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    Affordable and delicious meals in a relaxing atmosphere
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    Perfect for solo lunches, group gatherings, or office
                    catering
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    Full-service event planning for memorable occasions
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    Commitment to quality food and exceptional hospitality
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours Details */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground">Monday - Friday</span>
                    <span className="text-muted-foreground">
                      8:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Kitchen closes 30 minutes before restaurant closing time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
