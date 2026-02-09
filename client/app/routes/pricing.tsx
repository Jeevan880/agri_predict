import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  pricingPlans, 
  faqItems, 
  itemVariants, 
  modalVariants,
  faqContentVariants 
} from "~/components/constants";
import axios from "axios";
import { getUser, updateUser } from "~/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// High-Tech Agriculture Icons
import SensorsIcon from "@mui/icons-material/Sensors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ScienceIcon from "@mui/icons-material/Science";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import StarIcon from "@mui/icons-material/Star";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const PricingPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [modalType, setModalType] = useState<"payment" | "demo">("payment");
  
  const user = useSelector((state: any) => state.reducer.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) dispatch(getUser(userId));
    else navigate("/login");
  }, [dispatch, navigate]);

  const handleChoosePlan = (planName: string) => {
    setSelectedPlan(planName);
    setModalType("demo");
    setShowModal(true);
  };

  const paymentHandler = async (plan: any) => {
    if (!user) {
      toast.error("Please log in to upgrade.");
      return;
    }
    try {
      const { data: order } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order`, {
        amount: parseInt(plan.price.replace("₹", "").replace(",", "")),
        currency: "INR",
        userId: user._id,
        planName: plan.name,
      });

      const options = {
        key: "rzp_test_NOyYDcDQQX0GaM",
        amount: order.amount,
        name: "AgriPredict AI",
        description: `${plan.name} Tier Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/validate`, response);
          if (data) {
            dispatch(updateUser(data.user));
            toast.success("Tier Activated!");
            setSelectedPlan(plan.name);
            setModalType("payment");
            setShowModal(true);
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#10b981" },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Failed to initiate payment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020804] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Agricultural Intelligence
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight italic">
              Simple <span className="text-green-500 underline decoration-white/10">Pricing.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Transparent tiers designed to scale with your farm's productivity and data needs.
            </p>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan: any, index: number) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] flex flex-col border transition-all duration-500 ${
                plan.isPopular 
                  ? "bg-gradient-to-b from-green-900/20 to-black border-green-500/40 shadow-2xl" 
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                  Most Preferred
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.isPopular && <StarIcon className="text-yellow-400" fontSize="small" />}
                </div>
                <p className="text-gray-500 text-sm h-10 leading-snug">{plan.tagline}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  {plan.price !== "Contact Us" && <span className="text-gray-500 font-bold text-sm">/year</span>}
                </div>
                <p className="text-green-500 text-xs font-black uppercase mt-2 tracking-widest flex items-center gap-2">
                  <SensorsIcon sx={{ fontSize: 14 }} /> {plan.credits}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckIcon className="text-green-500 mt-0.5" sx={{ fontSize: 18 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.price === "Contact Us" ? () => handleChoosePlan(plan.name) : () => paymentHandler(plan)}
                disabled={user?.plan === plan.name}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                  user?.plan === plan.name
                    ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                    : plan.isPopular
                    ? "bg-green-500 text-black hover:bg-green-400"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {user?.plan === plan.name ? "ACTIVE TIER" : plan.price === "Contact Us" ? "REQUEST DEMO" : "UPGRADE NOW"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* --- FULL COMPARISON TABLE --- */}
        <section className="mt-40 max-w-5xl mx-auto px-4 overflow-x-auto">
          <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest">
            Capability <span className="text-green-500">Matrix</span>
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6">Hobbyist</th>
                <th className="py-4 px-6 text-green-400">Professional</th>
                <th className="py-4 px-6">Industrial</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "N-P-K Soil Analysis", free: "Standard", pro: "Advanced AI", ent: "Real-time IoT" },
                { label: "Satellite Monitoring", free: "None", pro: "Weekly", ent: "Live Updates" },
                { label: "Field Boundaries", free: "1 Field", pro: "10 Fields", ent: "Unlimited" },
                { label: "Market API Access", free: "Restricted", pro: "Full Access", ent: "Priority Exec" },
                { label: "Agronomist Chat", free: "AI Bot", pro: "Standard", ent: "Dedicated Lead" },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-6 px-6 font-bold italic text-gray-300">{row.label}</td>
                  <td className="py-6 px-6 text-gray-500">{row.free}</td>
                  <td className="py-6 px-6 text-green-500">{row.pro}</td>
                  <td className="py-6 px-6 text-white">{row.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* FAQ Section */}
        <section className="mt-40 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-12 flex items-center gap-3 italic">
            <HelpOutlineIcon className="text-green-500" /> Knowledge Base
          </h2>
          <div className="space-y-4">
            {faqItems.map((item: any, index: number) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center group"
                >
                  <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{item.question}</span>
                  <ExpandMoreIcon className={`transition-transform duration-500 ${openFAQ === index ? "rotate-180 text-green-500" : "text-gray-600"}`} />
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div initial="hidden" animate="visible" exit="exit" variants={faqContentVariants} className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                      <div className="pt-4 border-t border-white/5">{item.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECURITY & TRUST SECTION --- */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-20 items-center border-t border-white/10 pt-40 pb-20">
          <div>
            <h2 className="text-4xl font-black mb-8 italic leading-none">
              Data Integrity <br /> <span className="text-green-500">& Encryption</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              We understand that soil intelligence is your competitive edge. AgriPredict AI utilizes enterprise-grade 
              encryption to ensure only you see your land's true potential.
            </p>
            <div className="flex gap-10">
              {["ISO 27001", "GDPR", "AES-256"].map((cert) => (
                <div key={cert}>
                  <p className="text-2xl font-black text-white">{cert}</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Compliant</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 relative group overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-xl font-bold mb-4">Precision Guarantee</h4>
               <p className="text-gray-400 text-sm italic">
                 Our AI models are trained on over 2 million successful harvest data points. 
                 If our N-P-K recommendation deviates by more than 15%, we offer full analysis credit refunds.
               </p>
             </div>
             <AgricultureIcon className="absolute -bottom-10 -right-10 text-white/5 scale-[4] group-hover:text-green-500/10 transition-all duration-700" />
          </div>
        </section>

        {/* --- FINAL FOOTER --- */}
        <footer className="mt-40 text-center border-t border-white/5 pt-20">
           <p className="text-xs font-bold text-gray-700 uppercase tracking-[0.5em] mb-4 text-center">AgriPredict Hub</p>
           <div className="flex justify-center gap-8 text-gray-500 text-[10px] font-black uppercase mb-10">
             <span className="hover:text-green-500 cursor-pointer">Privacy</span>
             <span className="hover:text-green-500 cursor-pointer">Terms</span>
             <span className="hover:text-green-500 cursor-pointer">Security</span>
           </div>
           <p className="text-[10px] text-gray-800">© {new Date().getFullYear()} Precision Agriculture Solutions.</p>
        </footer>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-[#0a120b] border border-green-500/30 p-10 rounded-[3rem] max-w-md w-full text-center relative shadow-2xl">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="text-green-500" sx={{ fontSize: 40 }} />
              </div>
              <h3 className="text-3xl font-black mb-2">{modalType === "demo" ? "Request Sent" : "Plan Active"}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {modalType === "demo" 
                  ? `Our specialists will contact you regarding the ${selectedPlan} tier.`
                  : `Successfully upgraded to the ${selectedPlan} tier.`}
              </p>
              <button onClick={() => { setShowModal(false); navigate("/dashboard"); }} className="w-full py-4 bg-green-500 text-black font-black rounded-2xl hover:bg-green-400 transition-all">
                GO TO DASHBOARD
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPage;

