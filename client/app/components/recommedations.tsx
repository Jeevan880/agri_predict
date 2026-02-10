import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { CROP_DETAILS } from "./cropdetails"; 

const Recommendations = ({ recommendations }) => {
  const [cropImages, setCropImages] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const UNSPLASH_ACCESS_KEY = "UtwCASxnGuhc5jk0j_xn64GLYlSUyKMs188KS-XCJuQ"; // Replace with your key

  // 1. Fetch 3 images for each recommended crop
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const item of recommendations) {
        try {
          const response = await axios.get("https://api.unsplash.com/search/photos", {
            params: {
              query: `${item.crop} crop`,
              per_page: 3,
              orientation: "landscape"
            },
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
          });
          newImages[item.crop] = response.data.results.map(img => img.urls.regular);
        } catch (error) {
          console.error(`Unsplash Error for ${item.crop}:`, error);
          newImages[item.crop] = [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000",
            "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000"
          ];
        }
      }
      setCropImages(newImages);
    };

    if (recommendations.length > 0) fetchImages();
  }, [recommendations]);

  // 2. Auto-Carousel Timer (Cycles every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-12 space-y-20">
      {/* SECTION: TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <motion.div 
            key={item.crop}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-10 rounded-[3rem] text-black shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden ${
              index === 0 ? "bg-green-500 scale-105 z-10" : "bg-white/5 text-white border border-white/10"
            }`}
          >
            <p className="font-black uppercase text-[10px] opacity-60 mb-2 tracking-widest">
              {index === 0 ? "Primary Choice" : `Option ${index + 1}`}
            </p>
            <h3 className="text-4xl font-black italic uppercase mb-2 leading-none">{item.crop}</h3>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black ${index === 0 ? "bg-black/10" : "bg-green-500 text-black"}`}>
              {item.confidence}% CONFIDENCE
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION: ENCYCLOPEDIA WITH AUTO-CAROUSEL */}
      <div className="space-y-12">
        <h2 className="text-4xl font-black italic uppercase text-green-500 border-l-8 border-green-500 pl-6">
          Crop Intelligence Encyclopedia
        </h2>

        {recommendations.map((item, index) => {
          const details = CROP_DETAILS[item.crop] || {};
          const images = cropImages[item.crop] || [];

          return (
            <motion.div 
              key={`${item.crop}-info`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* AUTO CAROUSEL HEADER */}
              <div className="relative h-96 w-full overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${item.crop}-${currentSlide}`}
                    src={images[currentSlide]}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                    alt={item.crop}
                  />
                </AnimatePresence>
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-1.5 transition-all rounded-full ${currentSlide === i ? 'w-8 bg-green-500' : 'w-2 bg-white/30'}`} />
                  ))}
                </div>

                <div className="absolute top-10 left-10">
                  <h4 className="text-6xl font-black italic uppercase text-white drop-shadow-2xl">{item.crop}</h4>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <p className="text-green-500 font-black uppercase text-xs tracking-[0.3em] mb-4 italic">Description</p>
                  <p className="text-2xl text-gray-300 font-medium leading-relaxed italic">
                    "{details.description}"
                  </p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Harvest Timeline</span>
                      <span className="text-green-500 font-black italic text-xl">{details.duration}</span>
                   </div>
                   
                   <div className="p-8 bg-green-500/10 rounded-[2.5rem] border border-green-500/20">
                      <p className="text-green-500 font-black uppercase text-[10px] mb-3 tracking-widest">TS-Agri Expert Protocol</p>
                      <p className="text-white font-bold text-lg leading-snug">
                        {details.tips}
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;