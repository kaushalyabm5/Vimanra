import bcrypt from "bcryptjs";
import { initTables } from "../config/db.js";
import dbQuery from "../config/db.js";

const seedDatabase = async () => {
  console.log("🌱 Starting Database Seeding...");
  await initTables();

  // 1. Seed Admin
  const existingAdmin = await dbQuery.get("ADMINS", (a) => a.username === "admin");
  let adminId = 1;

  if (!existingAdmin) {
    const password_hash = await bcrypt.hash("admin123", 10);
    const newAdmin = await dbQuery.insert(
      "ADMINS",
      {
        username: "admin",
        password_hash,
        email: "admin@vimanra.com",
      },
      "admin_id"
    );
    adminId = newAdmin.admin_id;
    console.log("✅ Admin account created: username='admin', password='admin123'");
  } else {
    adminId = existingAdmin.admin_id;
    console.log("ℹ️ Admin account already exists.");
  }

  // 2. Seed Services (powers the public "Amenities & Facilities" section)
  const services = await dbQuery.all("SERVICES");
  if (services.length === 0) {
    const sampleServices = [
      {
        admin_id: adminId,
        service_name: "Infinity Swimming Pool",
        description: "Relax beside our scenic outdoor infinity pool featuring panoramic nature views.",
        icon: "Waves",
        status: "Active",
        category: "Relaxation",
        highlights: ["Scenic outdoor setting", "Sun deck lounger seating", "Refreshing ambiance"],
        image_url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Riverside Garden",
        description: "Unwind in lush tropical gardens along the serene riverbank, ideal for quiet strolls.",
        icon: "Trees",
        status: "Active",
        category: "Environment",
        highlights: ["Lush garden pathways", "Serene riverfront views", "Tranquil atmosphere"],
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "On-Site Restaurant",
        description: "Savor fresh local Sri Lankan specialties and popular international favorites.",
        icon: "Utensils",
        status: "Active",
        category: "Dining",
        highlights: ["Authentic regional dishes", "Fresh local ingredients", "All-day dining"],
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Free High-Speed WiFi",
        description: "Stay seamlessly connected with complimentary high-speed internet throughout the property.",
        icon: "Wifi",
        status: "Active",
        category: "Connectivity",
        highlights: ["Property-wide coverage", "High-speed connection", "Complimentary access"],
        image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Free On-Site Parking",
        description: "Hassle-free, secure self-parking facilities reserved exclusively for resort guests.",
        icon: "Car",
        status: "Active",
        category: "Convenience",
        highlights: ["Secure parking zone", "Direct property access", "Complimentary for guests"],
        image_url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Safari Arrangements",
        description: "Book customized wildlife safari tours with experienced local guides to explore Nearby National Parks.",
        icon: "Compass",
        status: "Active",
        category: "Excursions",
        highlights: ["Guided safari tours", "Seamless bookings", "Prime wildlife access"],
        image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Airport Transfers",
        description: "Convenient private airport shuttle service available upon request for stress-free travel.",
        icon: "PlaneTakeoff",
        status: "Active",
        category: "Transport",
        highlights: ["Direct pickup & drop-off", "Comfortable vehicles", "24/7 coordination"],
        image_url: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "In-Room Service",
        description: "Enjoy delicious meals, snacks, and beverages served directly to the privacy of your room.",
        icon: "ConciergeBell",
        status: "Active",
        category: "Service",
        highlights: ["Private room delivery", "Diverse menu choices", "Attentive staff"],
        image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Laundry Service",
        description: "Keep your wardrobe fresh throughout your vacation with our fast laundry services.",
        icon: "Shirt",
        status: "Active",
        category: "Service",
        highlights: ["Same-day availability", "Washing & pressing", "Hassle-free service"],
        image_url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Outdoor Dining Experience",
        description: "Dine under open skies surrounded by nature for a magical culinary experience.",
        icon: "Sun",
        status: "Active",
        category: "Gastronomy",
        highlights: ["Al fresco setup", "Scenic river views", "Romantic ambiance"],
        image_url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Family-Friendly Environment",
        description: "Spacious accommodation options and welcoming amenities designed for guests of all ages.",
        icon: "Users",
        status: "Active",
        category: "Stay",
        highlights: ["Spacious family rooms", "Child-friendly spaces", "Safe environment"],
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Wheelchair Accessible Rooms",
        description: "Thoughtfully designed rooms and accessible pathways ensuring comfort for every guest.",
        icon: "Accessibility",
        status: "Active",
        category: "Accessibility",
        highlights: ["Step-free access", "Accessible bathrooms", "Wide doorways"],
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Electric Vehicle Charging",
        description: "Modern EV charging stations available on-site for eco-friendly vehicle power.",
        icon: "Zap",
        status: "Active",
        category: "Convenience",
        highlights: ["Fast charging ports", "On-site availability", "Eco-friendly amenity"],
        image_url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        service_name: "Spa & Massage Services",
        description: "Rejuvenate your body and mind with soothing massages and wellness treatments.",
        icon: "Sparkles",
        status: "Active",
        category: "Wellness",
        highlights: ["Relaxing treatments", "Professional therapists", "Peaceful sanctuary"],
        image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      },
    ];

    for (const s of sampleServices) {
      await dbQuery.insert("SERVICES", s, "service_id");
    }
    console.log("✅ Seeded initial Services.");
  }

  // 3. Seed Gallery (powers the public "Resort Photo Gallery" section, grouped by category)
  const gallery = await dbQuery.all("GALLERY");
  if (gallery.length === 0) {
    const galleryByCategory = {
      Safari: [
        ["Udawalawe Wildlife Safari", "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"],
        ["Wild Elephants in Savanna", "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80"],
        ["4x4 Jungle Excursion", "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80"],
        ["Leopard Spotting Expedition", "https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1000&q=80"],
        ["Exotic Birds Watch", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"],
        ["Golden Hour Safari Trails", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80"],
        ["National Park Wilderness", "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80"],
        ["Safari Camp Sunset", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"],
        ["Deer Herd at Lakeside", "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1000&q=80"],
        ["Safari Guide Tracking", "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&w=1000&q=80"],
        ["Misty Jungle Morning Drive", "https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1000&q=80"],
        ["Wild River Banks Crossing", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"],
      ],
      Hotel: [
        ["Grand Entrance Lounge", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
        ["Architectural Courtyard", "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"],
        ["Luxury Reception Hall", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
        ["Resort Night Lights", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"],
        ["Main Villa Exterior", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80"],
        ["Veranda Pathway", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
        ["Open-Air Lobby Lounge", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"],
        ["Private Estate Pavilion", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"],
        ["Heritage Villa Facade", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80"],
        ["Sunset Deck Corridor", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"],
        ["Modern Luxury Atrium", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80"],
        ["Scenic Resort Walkway", "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80"],
      ],
      Rooms: [
        ["Master Lakeside Suite", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"],
        ["Panoramic Ocean Bedroom", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
        ["Luxury Canopy Bed", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80"],
        ["Minimalist Resort Bedroom", "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80"],
        ["Garden View Deluxe Suite", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"],
        ["En-Suite Marble Bathroom", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"],
        ["Private Villa Balcony", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"],
        ["Executive Suite Lounge", "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"],
        ["Wooden Chalet Interior", "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80"],
        ["Cozy Morning Bed Setup", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"],
        ["Open-Air Villa Bathroom", "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80"],
        ["Presidential Suite King Bed", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80"],
      ],
      Pool: [
        ["Infinity Lake View Pool", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"],
        ["Sunset Pool Deck", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"],
        ["Tropical Palm Poolside", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80"],
        ["Private Villa Plunge Pool", "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80"],
        ["Luxury Cabanas by Pool", "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80"],
        ["Evening Illuminated Pool", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"],
        ["Secluded Jungle Pool", "https://images.unsplash.com/photo-1561501813-e70e71d24282?auto=format&fit=crop&w=1000&q=80"],
        ["Resort Pool Loungers", "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1000&q=80"],
        ["Crystal Clear Water", "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1000&q=80"],
        ["Overhead Pool Vista", "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1000&q=80"],
        ["Rooftop Infinity Edge", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"],
        ["Relaxing Poolside Bar", "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80"],
      ],
      Restaurant: [
        ["Candlelight Lake Dining", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"],
        ["Fine Dining Main Hall", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"],
        ["Open-Air Terrace Restaurant", "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"],
        ["Sunset Cocktails Bar", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80"],
        ["Rustic Wine Cellar", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80"],
        ["Beachside Romantic Table", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"],
        ["Chef Cooking Station", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"],
        ["Garden Breakfast Setup", "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"],
        ["Luxury Buffet Layout", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80"],
        ["Lakeside Pavilion Dining", "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1000&q=80"],
        ["Elegantly Set Dinner Table", "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80"],
        ["Artisanal Coffee Lounge", "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80"],
      ],
      Nature: [
        ["Golden Hour Reservoir Pier", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"],
        ["Lakeside Kayaking Adventure", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"],
        ["Paddy Field Cycling Trail", "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&q=80"],
        ["Misty Mountain Horizon", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"],
        ["Lush Rainforest Canopy", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"],
        ["Scenic Lake Waters", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"],
        ["Tropical Sunrise Views", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80"],
        ["Hidden Waterfall Oasis", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80"],
        ["Emerald Tea Plantation", "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1000&q=80"],
        ["Calm River Reflection", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80"],
        ["Pine Forest Walking Path", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80"],
        ["Dramatic Sunset Sky", "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1000&q=80"],
      ],
      Food: [
        ["Tranquil Morning Breakfast", "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"],
        ["Fresh Gourmet Seafood", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80"],
        ["Authentic Sri Lankan Curry Platter", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80"],
        ["Fresh Tropical Fruit Bowl", "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1000&q=80"],
        ["Artisanal Dessert Creation", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80"],
        ["Handcrafted Sunset Cocktail", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80"],
        ["Wood-fired Artisanal Pizza", "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"],
        ["Organic Farm-to-Table Salad", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"],
        ["Grilled Lakeside Lobster", "https://images.unsplash.com/photo-1553240799-36bbf332a5c3?auto=format&fit=crop&w=1000&q=80"],
        ["Pristine Afternoon High Tea", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80"],
        ["Fresh Coconut Water Drinks", "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1000&q=80"],
        ["Chef Special Main Course", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"],
      ],
      Gardens: [
        ["Lush Estate Botanical Walk", "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80"],
        ["Zen Water Lily Pond", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80"],
        ["Tropical Palm Sanctuary", "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80"],
        ["Manicured Lawn & Pavilions", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"],
        ["Blooming Exotic Orchids", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80"],
        ["Shadowed Pathway Greens", "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1000&q=80"],
        ["Courtyard Spice Garden", "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1000&q=80"],
        ["Evening Garden Lighting", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"],
        ["Jungle Canopy Reflection", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"],
        ["Tranquil Bamboo Grove", "https://images.unsplash.com/photo-1503435931410-692534766324?auto=format&fit=crop&w=1000&q=80"],
        ["Secluded Hammock Spot", "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80"],
        ["Lush Estate Grounds", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"],
      ],
    };

    for (const [category, items] of Object.entries(galleryByCategory)) {
      for (const [title, image_url] of items) {
        await dbQuery.insert("GALLERY", { admin_id: adminId, title, category, section: "gallery", image_url }, "image_id");
      }
    }
    console.log("✅ Seeded initial Gallery items (96 photos across 8 categories).");
  }

  // 4. Seed Reviews
  const reviews = await dbQuery.all("REVIEWS");
  if (reviews.length === 0) {
    const sampleReviews = [
      {
        admin_id: adminId,
        guest_name: "Samantha & David Miller",
        rating: 5,
        review: "Unforgettable stay at Vimanra! The lakeside views and safari guidance were beyond world-class.",
      },
      {
        admin_id: adminId,
        guest_name: "Dr. Aris Thorne",
        rating: 5,
        review: "Exceptional hospitality, peaceful Kumbuk garden ambiance, and top tier dining.",
      },
    ];

    for (const r of sampleReviews) {
      await dbQuery.insert("REVIEWS", r, "review_id");
    }
    console.log("✅ Seeded initial Reviews.");
  }

  // 5. Seed Rooms (powers the public "Accommodation" section)
  const rooms = await dbQuery.all("ROOMS");
  if (rooms.length === 0) {
    const sampleRooms = [
      {
        room_type: "Superior Double Room",
        subtitle: "Garden View",
        price: 85,
        capacity: 2,
        description: "Perfect for couples seeking comfort and relaxation.",
        image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        status: "Available",
        features: ["Queen Bed", "Air Conditioning", "Free WiFi", "Private Bathroom", "Garden Views", "Terrace", "Complimentary Breakfast"],
      },
      {
        room_type: "Deluxe Double Room",
        subtitle: "Private Balcony",
        price: 115,
        capacity: 2,
        description: "Enjoy spacious comfort with elegant interiors and private outdoor space.",
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        status: "Available",
        features: ["Queen Bed", "Balcony", "Air Conditioning", "Modern Bathroom", "Seating Area", "Free WiFi"],
      },
      {
        room_type: "Deluxe Triple Room",
        subtitle: "Garden Access",
        price: 130,
        capacity: 3,
        description: "Ideal for small families or friends exploring Udawalawe.",
        image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        status: "Available",
        features: ["One Queen Bed", "One Single Bed", "Spacious Layout", "Private Bathroom", "Garden Access", "Free Breakfast"],
      },
      {
        room_type: "Family Room",
        subtitle: "Garden Views",
        price: 175,
        capacity: 5,
        description: "Designed for larger families with generous space and modern conveniences.",
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        status: "Available",
        features: ["Multiple Beds", "Air Conditioning", "Family-Friendly Layout", "Large Bathroom", "Free WiFi", "Garden Views"],
      },
    ];

    for (const rm of sampleRooms) {
      await dbQuery.insert("ROOMS", rm, "room_id");
    }
    console.log("✅ Seeded initial Rooms.");
  }

  // 6. Seed Things To Do
  const thingsToDo = await dbQuery.all("THINGS_TO_DO");
  if (thingsToDo.length === 0) {
    const sampleThingsToDo = [
      {
        admin_id: adminId,
        title: "Udawalawe Reservoir & Dam",
        category: "Sightseeing",
        icon: "Eye",
        distance: "7 km",
        time: "14 mins",
        description: "Enjoy sweeping panoramic lake views, breathtaking golden sunsets, and peaceful strolls along the iconic reservoir embankment.",
        image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Udawalawe National Park Safari",
        category: "Wildlife Safari",
        icon: "Binoculars",
        distance: "12 km",
        time: "20 mins",
        description: "Embark on an exciting 4x4 Jeep safari through famous grasslands home to hundreds of wild Sri Lankan elephants and exotic bird species.",
        image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Elephant Transit Home (ETH)",
        category: "Conservation",
        icon: "HeartHandshake",
        distance: "10 km",
        time: "16 mins",
        description: "Witness orphaned elephant calves being fed and cared for in a natural sanctuary prior to their release back into the wild.",
        image_url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Lakeside Kayaking & Boating",
        category: "Water Activity",
        icon: "Waves",
        distance: "0 km",
        time: "Direct Access",
        description: "Glide across calm lake waters in a private kayak or enjoy a tranquil boat excursion straight from the resort grounds.",
        image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Maduwanwela Walawwa Manor",
        category: "Heritage",
        icon: "Landmark",
        distance: "24 km",
        time: "35 mins",
        description: "Explore a historical 17th-century aristocratic manor famous for its 121 rooms, intricate wood carvings, and courtyard design.",
        image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Sankapala Raja Maha Viharaya",
        category: "Culture",
        icon: "Sparkles",
        distance: "18 km",
        time: "25 mins",
        description: "Visit an ancient rock cave temple dating back to the 2nd century BC, surrounded by lush hill ranges and historical legends.",
        image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Scenic Paddy Field Biking",
        category: "Adventure",
        icon: "Bike",
        distance: "2 km",
        time: "5 mins",
        description: "Rent a resort bicycle and ride along peaceful rural village trails, verdant paddy fields, and local fruit orchards.",
        image_url: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",
      },
      {
        admin_id: adminId,
        title: "Chandrika Lake Viewpoint",
        category: "Nature",
        icon: "Trees",
        distance: "15 km",
        time: "22 mins",
        description: "A serene nature spot ideal for afternoon picnics, birdwatching, and enjoying unspoiled countryside vistas.",
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
    ];

    for (const t of sampleThingsToDo) {
      await dbQuery.insert("THINGS_TO_DO", t, "thing_id");
    }
    console.log("✅ Seeded initial Things To Do.");
  }

  console.log("🎉 Database seeding completed successfully!");
};

seedDatabase().catch((err) => {
  console.error("❌ Error seeding database:", err);
});
