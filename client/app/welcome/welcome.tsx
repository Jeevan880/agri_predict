import React from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Icons
import {
  ArrowForward, Agriculture, WbSunny, WaterDrop, Science,
  Insights, LocalFlorist, VerifiedUser, Login,
  AccountCircle, Public, Sensors, Spoke
} from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function Welcome() {
  const navigate = useNavigate();

  const chartData: any = {
    labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
    datasets: [{
      label: "Market Demand",
      data: [30, 45, 35, 60, 70, 95],
      borderColor: "#4ade80",
      backgroundColor: "rgba(74, 222, 128, 0.1)",
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div className="min-h-screen font-sans text-white bg-[#020804] selection:bg-green-500/30">
      {/* 1. NAVIGATION */}
      <nav className="flex justify-between items-center p-5 px-6 md:px-16 bg-black/60 backdrop-blur-xl border-b border-green-900/20 sticky top-0 z-[100]">
        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => {
          navigate("/");
        }}>
          <div className="p-2 bg-green-500 rounded-lg group-hover:rotate-12 transition-transform">
            <Agriculture className="text-black text-2xl" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">AGRIPREDICT<span className="text-green-500">.AI</span></span>
        </div>

        <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold uppercase tracking-widest text-gray-400">
          <a href="#analysis" className="hover:text-green-400 transition">Soil Analytics</a>
          <a href="#market" className="hover:text-green-400 transition">Market Hub</a>
          <a href="#community" className="hover:text-green-400 transition">Community</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition">
            <Login fontSize="small" /> <span>Login</span>
          </Link>
          <Link to="/signup" className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-green-400 transition-all shadow-xl">
            Join Now
          </Link>
        </div>
      </nav>

      {/* 2. HERO & QUICK ACTIONS */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 relative z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tight mb-6">
                Cultivate <span className="text-green-500">Intelligence.</span><br />
                Harvest Wealth.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
                The world's first AI agronomist that talks to your soil and listens to the global market.
                Get 98% accurate crop recommendations based on real-time data.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="group px-8 py-4 bg-green-500 text-black font-black rounded-2xl hover:scale-105 transition flex items-center space-x-3 shadow-[0_20px_40px_rgba(74,222,128,0.2)]">
                <Sensors /> <span>ANALYZE MY SOIL</span>
              </Link>
              <Link to="/market" className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md font-black rounded-2xl hover:bg-white/10 transition flex items-center space-x-3">
                <Public /> <span>GLOBAL MARKET VIEW</span>
              </Link>
            </div>

            {/* Live Stats Bar */}
            <div className="flex items-center space-x-8 pt-6 border-t border-white/5">
              <div><p className="text-2xl font-bold">12k+</p><p className="text-xs text-gray-500 uppercase">Active Farmers</p></div>
              <div className="w-px h-8 bg-white/10" />
              <div><p className="text-2xl font-bold">850k</p><p className="text-xs text-gray-500 uppercase">Acres Managed</p></div>
              <div className="w-px h-8 bg-white/10" />
              <div><p className="text-2xl font-bold">22%</p><p className="text-xs text-gray-500 uppercase">Avg. Yield Boost</p></div>
            </div>
          </div>

          {/* Weather & Prediction Floating Widget */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-green-900/40 to-black p-8 rounded-[2.5rem] border border-green-500/20 backdrop-blur-3xl shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-green-400 font-bold text-sm uppercase">Current Forecast</p>
                  <h3 className="text-3xl font-bold">Hyderabad, IN</h3>
                </div>
                <WbSunny className="text-yellow-400 text-5xl animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <WaterDrop className="text-blue-400 mb-2" />
                  <p className="text-xl font-bold">62%</p>
                  <p className="text-xs text-gray-500">Moisture</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <Science className="text-purple-400 mb-2" />
                  <p className="text-xl font-bold">6.8 pH</p>
                  <p className="text-xs text-gray-500">Soil Acid</p>
                </div>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition">
                Get Daily Briefing
              </button>
            </motion.div>
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>

      {/* 3. INNOVATION GRID */}
      <section id="analysis" className="py-24 px-6 bg-[#040d06]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold">Smart Agricultural Core</h2>
            <p className="text-gray-500">Advanced AI modules integrated for precision farming.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Spoke />} title="Neural Mapping" desc="Connects regional data to your specific land coordinates." />
            <FeatureCard icon={<Insights />} title="Yield Forecast" desc="Predicts harvest volume with 95% confidence intervals." />
            <FeatureCard icon={<LocalFlorist />} title="Eco-Sync" desc="Sustainable suggestions to prevent soil nutrient depletion." />
            <FeatureCard icon={<AccountCircle />} title="Expert Support" desc="24/7 Access to digital and human agronomists." />
          </div>
        </div>
      </section>

      {/* 4. MARKET CHART SECTION */}
      <section id="market" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-black/50 p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Insights className="text-green-500" /> <span>Demand Growth (Organic Pulses)</span>
            </h3>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">Don't just plant.<br />Plant for the <span className="text-green-500">Buyer.</span></h2>
            <p className="text-gray-400 text-lg">
              Our AI connects to global supply chain data. We tell you what to grow based on what buyers are
              pre-ordering in international markets.
            </p>
            <Link to="/market-trends" className="inline-flex items-center space-x-2 text-green-400 font-bold hover:underline">
              <span>EXPLORE FULL MARKET HUB</span> <ArrowForward fontSize="small" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY TESTIMONIALS */}
      <section id="community" className="py-24 px-6 bg-green-950/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 text-center">Voices from the Field</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial name="Rajesh Kumar" role="Wheat Farmer" text="The AI predicted the early monsoon perfectly. Saved my entire harvest this year." />
            <Testimonial name="Anita Desai" role="Organic Specialist" text="My soil pH was a mess. Following the AgriPredict strategy restored my land in 2 seasons." />
            <Testimonial name="Samuel J." role="Large Scale Producer" text="Profitability is up 30%. The market integration is a complete game changer for us." />
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 bg-gradient-to-b from-green-500 to-green-700 p-16 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black text-black">Start Your Digital Farm Today</h2>
          <p className="text-green-950 font-bold text-lg max-w-xl mx-auto">
            Free soil analysis for your first acre. No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-900 transition shadow-2xl">
              Create Free Account
            </Link>
            <Link to="/contact" className="px-10 py-4 border-2 border-black text-black font-bold rounded-2xl hover:bg-black hover:text-white transition">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2026 AGRIPREDICT AI. SUSTAINABLE INNOVATION FOR THE GLOBAL FARMER.</p>
      </footer>
    </div>
  );
}

// Sub-components
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:border-green-500/50 transition-all hover:-translate-y-2">
      <div className="text-green-500 mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Testimonial({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-3xl text-left italic">
      <p className="text-gray-300 mb-6">"{text}"</p>
      <div className="not-italic">
        <p className="font-bold text-green-400">{name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-widest">{role}</p>
      </div>
    </div>
  );
}