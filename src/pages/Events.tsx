import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  CheckCircle,
  Users,
  Music,
  Camera,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import eventPlanningImage from "@/assets/event-planning.jpg";

const Events = () => {
  const [formData, setFormData] = useState({
    eventType: "",
    customEventType: "",
    guests: "",
    date: undefined as Date | undefined,
    name: "",
    phone: "",
    details: "",
  });

  const [showCustomEventType, setShowCustomEventType] = useState(false);

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Anniversary",
    "Baby Shower",
    "Graduation",
    "Holiday Party",
    "Others",
  ];

  const services = [
    {
      icon: <Utensils className="h-8 w-8 text-primary" />,
      title: "Catering Services",
      description:
        "Full-service catering with customizable menus for any event size",
      features: [
        "Custom menu planning",
        "Professional service staff",
        "Setup and cleanup",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Event Coordination",
      description:
        "Complete event planning and coordination from start to finish",
      features: [
        "Timeline management",
        "Vendor coordination",
        "Day-of coordination",
      ],
    },
    {
      icon: <Music className="h-8 w-8 text-primary" />,
      title: "Entertainment & Audio",
      description: "Professional sound systems and entertainment options",
      features: [
        "Sound system rental",
        "DJ services",
        "Live music arrangements",
      ],
    },
    // {
    //   icon: <Camera className="h-8 w-8 text-primary" />,
    //   title: "Photography & Videography",
    //   description: "Capture your special moments with professional photography",
    //   features: ["Professional photographers", "Event videography", "Photo editing services"]
    // }
  ];

  const handleEventTypeChange = (value: string) => {
    setFormData({ ...formData, eventType: value });
    setShowCustomEventType(value === "Others");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventTypeText =
      formData.eventType === "Others"
        ? formData.customEventType
        : formData.eventType;
    const dateText = formData.date
      ? format(formData.date, "PPP")
      : "Not specified";

    const message = `Hi, I would like to plan an event with the following details:

Event Type: ${eventTypeText}
Number of Guests: ${formData.guests}
Event Date: ${dateText}
Name: ${formData.name}
Phone: ${formData.phone}
Additional Details: ${formData.details || "None"}

Please contact me to discuss further details.`;

    const whatsappUrl = `https://wa.me/5551234567?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Event Catering & Rentals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let us help you create unforgettable moments. From intimate
            gatherings to grand celebrations, we provide comprehensive event
            planning and rental services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Planning Form */}
          <div className="space-y-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl">Plan Your Event</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll contact you to discuss your
                  event details.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Type */}
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select onValueChange={handleEventTypeChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Event Type */}
                  {showCustomEventType && (
                    <div className="space-y-2">
                      <Label htmlFor="customEventType">Custom Event Type</Label>
                      <Input
                        id="customEventType"
                        value={formData.customEventType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customEventType: e.target.value,
                          })
                        }
                        placeholder="Please specify your event type"
                        required
                      />
                    </div>
                  )}

                  {/* Number of Guests */}
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      placeholder="Expected number of guests"
                      min="1"
                      required
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date
                            ? format(formData.date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) =>
                            setFormData({ ...formData, date })
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  {/* Phone Number
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Your phone number"
                      required
                    />
                  </div> */}

                  {/* Additional Details */}
                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                      placeholder="Any special requests, dietary restrictions, or additional information..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Submit Event Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div className="space-y-8">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={eventPlanningImage}
                alt="Event Planning Services"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Professional Event Services
                  </h3>
                  <p className="text-sm opacity-90">
                    Making your special day perfect
                  </p>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">
                Our Event Services
              </h3>
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{service.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {service.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        {service.description}
                      </p>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-muted-foreground"
                          >
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Contact Card */}
            <Card className="p-6 bg-gradient-to-br from-restaurant-warm/10 to-restaurant-gold/10 border-restaurant-warm/20">
              <CardHeader>
                <CardTitle>Need More Information?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Have questions about our services or need a custom quote? Our
                  event planning team is here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1">
                    Call (555) 123-4567
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const message =
                        "Hi, I have questions about your event planning services";
                      window.open(
                        `https://wa.me/5551234567?text=${encodeURIComponent(
                          message
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    WhatsApp Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
