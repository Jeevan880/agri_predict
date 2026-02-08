import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

// Agriculture & High-Tech Icons
import ScienceIcon from "@mui/icons-material/Science";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MapIcon from "@mui/icons-material/Map";
import SensorsIcon from "@mui/icons-material/Sensors";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function DashboardIndex() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.reducer.currentUser);
  const navigate = useNavigate();

  // Mocked Ag-specific data for the UI demo
  const [agData, setAgData] = useState({
    stats: {
      soilHealthScore: 88,
      moistureLevel: "42%",
      activeFields: 4,
      predictedYieldBoost: "+18%",
    },
    recentAnalyses: [
      { id: 1, field: "North Field", crop: "Rice", date: new Date(), status: "Optimized", score: 92 },
      { id: 2, field: "East Vineyard", crop: "Grapes", date: new Date(Date.now() - 86400000), status: "Warning", score: 64 },
    ],
    marketAlerts: [
      { crop: "Wheat", trend: "Rising", price: "+$12.40", color: "text-green-400" },
      { crop: "Maize", trend: "Stable", price: "+$0.20", color: "text-blue-400" },
    ]
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            Welcome back, <span className="text-green-500">{user?.name?.split(' ')[0]}</span>
          </motion.h1>
          <p className="text-gray-500 mt-1">Satellite sync active. Soil sensors reporting 100% uptime.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl">
           <WbSunnyIcon className="text-yellow-500" />
           <div>
             <p className="text-sm font-bold text-white leading-none">28°C</p>
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Clear Skies • Hyderabad</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            <ShutterSpeedIcon className="text-green-500" sx={{ fontSize: 50 }} />
          </motion.div>
        </div>
      ) : (
        <>
          {/* --- TOP STATS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Soil Health" value={`${agData.stats.soilHealthScore}%`} icon={<ScienceIcon />} trend="Excellent" color="from-green-600/20 to-emerald-600/20" />
            <StatCard title="Moisture" value={agData.stats.moistureLevel} icon={<WaterDropIcon />} trend="Optimal" color="from-blue-600/20 to-cyan-600/20" />
            <StatCard title="Active Fields" value={agData.stats.activeFields} icon={<MapIcon />} trend="Satellite Linked" color="from-yellow-600/20 to-orange-600/20" />
            <StatCard title="Yield Forecast" value={agData.stats.predictedYieldBoost} icon={<TrendingUpIcon />} trend="Next Harvest" color="from-purple-600/20 to-indigo-600/20" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* --- QUICK ACTIONS (LEFT) --- */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SensorsIcon className="text-green-500" /> Neural Operations
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <QuickAction title="New Soil Test" icon={<ScienceIcon />} link="/dashboard/soil" color="bg-green-500" />
                  <QuickAction title="Crop Predictor" icon={<AgricultureIcon />} link="/dashboard/recommend" color="bg-emerald-500" />
                  <QuickAction title="Field Mapping" icon={<MapIcon />} link="/dashboard/fields" color="bg-blue-500" />
                  <QuickAction title="Market Hub" icon={<TimelineIcon />} link="/dashboard/market" color="bg-yellow-500" />
                </div>
              </section>

              {/* --- RECENT ANALYSES --- */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-2xl font-bold">Recent Soil Profiles</h2>
                  <Link to="/dashboard/soil" className="text-green-500 font-bold text-sm hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                  {agData.recentAnalyses.map((item) => (
                    <AnalysisItem key={item.id} data={item} />
                  ))}
                </div>
              </section>
            </div>

            {/* --- MARKET TRENDS (RIGHT) --- */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-[2rem] p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUpIcon className="text-green-500" /> Live Market
                </h2>
                <div className="space-y-6">
                  {agData.marketAlerts.map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div>
                        <p className="font-bold">{alert.crop}</p>
                        <p className={`text-xs font-bold uppercase ${alert.color}`}>{alert.trend}</p>
                      </div>
                      <p className="text-xl font-black">{alert.price}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition">
                  Detailed Pricing Analysis
                </button>
              </div>

              {/* --- SUSTAINABILITY CARD --- */}
              <div className="bg-green-600 rounded-[2rem] p-8 text-black relative overflow-hidden group">
                <div className="relative z-10">
                  <VerifiedIcon className="mb-4" />
                  <h3 className="text-2xl font-black leading-none mb-2">Sustainability Certificate</h3>
                  <p className="text-sm font-medium opacity-80">Your land carbon footprint is 24% lower than regional average.</p>
                </div>
                <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-4">
                   <AgricultureIcon sx={{ fontSize: 180 }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS ---

const StatCard = ({ title, value, icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} p-6 rounded-[2rem] border border-white/10 shadow-xl`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-black/20 rounded-2xl text-white">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-black/40 px-2 py-1 rounded-md">{trend}</span>
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-4xl font-black text-white mt-1">{value}</h3>
  </motion.div>
);

const QuickAction = ({ title, icon, color, link }) => (
  <Link to={link} className="group flex flex-col items-center text-center gap-3">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{title}</span>
  </Link>
);

const AnalysisItem = ({ data }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:border-green-500/50 transition-colors group">
    <div className="flex items-center gap-5">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl ${data.score > 80 ? 'bg-green-500 text-black' : 'bg-red-500/20 text-red-500'}`}>
        {data.score}
      </div>
      <div>
        <h4 className="font-bold text-lg">{data.field}</h4>
        <p className="text-sm text-gray-500">{data.crop} • {formatDistanceToNow(data.date)} ago</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className={`text-xs font-black uppercase ${data.status === 'Optimized' ? 'text-green-500' : 'text-red-500'}`}>
          {data.status}
        </p>
        <p className="text-[10px] text-gray-600">Satellite Health Index</p>
      </div>
      <ArrowForwardIcon className="text-gray-700 group-hover:text-green-500 transition-colors" />
    </div>
  </div>
);


