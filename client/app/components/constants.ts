import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import TimelineIcon from "@mui/icons-material/Timeline";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PersonIcon from "@mui/icons-material/Person";

// --- ANIMATIONS ---
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { scale: 0.8, opacity: 0 },
};

export const faqContentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0 },
};

// --- SIDEBAR CONFIG ---
export interface SidebarItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

export const sidebarItems: SidebarItem[] = [
  { name: "Overview", icon: DashboardIcon, path: "/dashboard" },
  { name: "Soil Analysis", icon: ScienceIcon, path: "/dashboard/soil" },
  { name: "Crop Advisor", icon: AgricultureIcon, path: "/dashboard/recommend" },
  { name: "Market Trends", icon: TimelineIcon, path: "/dashboard/market" },
  { name: "Field Mapping", icon: TravelExploreIcon, path: "/dashboard/fields" },
  { name: "My Profile", icon: PersonIcon, path: "/dashboard/profile" },
];

// --- PRICING PLANS ---
export interface PricingPlan {
  name: string;
  price: string;
  tagline: string;
  credits: string;
  isPopular: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Hobbyist",
    price: "₹0",
    tagline: "Perfect for small home gardens and experimental farming.",
    credits: "5 AI Analyses per month",
    isPopular: false,
    features: [
      "Basic N-P-K Soil Analysis",
      "Standard Crop Recommendations",
      "Local Weather Forecasting",
      "Single Field Tracking",
    ],
  },
  {
    name: "Professional",
    price: "₹999",
    tagline: "Comprehensive tools for commercial farmers maximizing yield.",
    credits: "50 AI Analyses per month",
    isPopular: true,
    features: [
      "Advanced Nutrient Mapping",
      "Satellite Growth Monitoring",
      "Global Market Price Alerts",
      "Up to 10 Fields Tracking",
      "Export Data for Govt. Subsidy",
    ],
  },
  {
    name: "Industrial",
    price: "Contact Us",
    tagline: "Enterprise solutions for large-scale agricultural estates.",
    credits: "Unlimited AI Analyses",
    isPopular: false,
    features: [
      "Full API Access",
      "IoT Sensor Integration",
      "Custom Sustainability Reports",
      "Dedicated Agronomist Support",
      "Multi-Region Management",
    ],
  },
];

// --- FAQ ---
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "How does the AI predict the best crop?",
    answer: "Our neural networks analyze your soil's N-P-K levels, pH value, and moisture content alongside 10 years of regional weather patterns and current market demand to provide the most profitable and sustainable suggestion.",
  },
  {
    question: "What are AI Analysis Credits?",
    answer: "One credit is consumed each time you run a full soil diagnostic or generate a seasonal crop strategy. Credits reset at the start of every billing cycle.",
  },
  {
    question: "Can I connect my own IoT soil sensors?",
    answer: "Yes, our Industrial plan supports direct API integration with most major IoT hardware providers like Bosch and John Deere sensors.",
  },
];

// --- TESTIMONIALS ---
export interface Testimonial {
  name: string;
  title: string;
  quote: string;
  profilePic: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Rajesh Khanna",
    title: "Commercial Rice Farmer",
    quote: "AgriPredict helped me identify a Nitrogen deficiency I didn't know I had. My yield increased by 15% in just one season!",
    profilePic: "https://placehold.co/100x100/10b981/ffffff?text=RK",
  },
  {
    name: "Sarah Jenkins",
    title: "Organic Vineyard Owner",
    quote: "The satellite mapping feature is incredible. I can monitor my entire estate's hydration levels from my phone.",
    profilePic: "https://placehold.co/100x100/059669/ffffff?text=SJ",
  },
  {
    name: "Vikram Singh",
    title: "Agro-Exporter",
    quote: "The market trend analysis allowed us to switch to Maize just before a global price surge. The ROI was phenomenal.",
    profilePic: "https://placehold.co/100x100/34d399/ffffff?text=VS",
  },
];


