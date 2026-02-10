import React, { useState, useEffect, useRef } from "react";
import { 
  APIProvider, 
  Map, 
  useMap, 
  AdvancedMarker, 
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LocationOn, Science, WaterDrop, 
  Opacity, Agriculture, Map as MapIcon, EditNote, Thermostat, Grain
} from "@mui/icons-material";
import axios from "axios";
import mandalData from "./data.json";
import Recommedations from "~/components/recommedations";

// --- MAP FLY-TO CONTROLLER ---
const MapHandler = ({ place }: { place: google.maps.places.PlaceResult | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !place?.geometry?.location) return;
    map.panTo(place.geometry.location);
    map.setZoom(13);
  }, [map, place]);
  return null;
};

// --- MODERN SEARCH BAR ---
const ModernSearch = ({ onPlaceSelect }: { onPlaceSelect: (p: google.maps.places.PlaceResult) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "address_components"],
      componentRestrictions: { country: "in" }
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelect(place);
    });
  }, [places, onPlaceSelect]);

  return (
    <div className="relative group w-full max-w-xl px-4">
      <div className="absolute inset-0 bg-green-500/10 blur-2xl group-focus-within:bg-green-500/25 transition-all rounded-full" />
      <div className="relative flex items-center bg-black/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl">
        <div className="pl-4 text-green-500"><Search /></div>
        <input
          ref={inputRef}
          placeholder="Sync coordinates..."
          className="w-full bg-transparent px-4 py-2 text-white placeholder:text-gray-500 outline-none font-medium text-sm"
        />
      </div>
    </div>
  );
};

export default function TelanganaAgriDashboard() {
  const [activeTab, setActiveTab] = useState<"map" | "manual">("manual");
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [info, setInfo] = useState<any>(null);
  const [season, setSeason] = useState("Kharif");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [manualData, setManualData] = useState({
    N: 100, P: 50, K: 150, ph: 7.0,
    temperature: 28.0, humidity: 60, rainfall: 150
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    const mName = place.name;
    let foundMandal: any = null;

    Object.keys(mandalData.districts).forEach((districtName) => {
      const mandals = (mandalData.districts as any)[districtName].mandals;
      const match = mandals.find((m: any) => m.name === mName);
      if (match) foundMandal = { ...match, district: districtName };
    });

    if (foundMandal) {
      setInfo(foundMandal);
      setRecommendations([]);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 600);
    }
  };

  const getPrediction = async () => {
    const dataToSource = activeTab === "map" ? info : { ...manualData, name: "Custom Input", district: "Manual Parameters" };
    if (!dataToSource) return;
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        N: dataToSource.N, P: dataToSource.P, K: dataToSource.K, ph: dataToSource.ph,
        annual_temp: dataToSource.temperature, annual_humidity: dataToSource.humidity,
        annual_rainfall: dataToSource.rainfall, season: season
      });
      setRecommendations(res.data.recommendations);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#020603] min-h-screen text-white font-sans selection:bg-green-500/30">
      
      {/* COMPACT TAB SELECTOR */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1 backdrop-blur-md">
          {[
            { id: "manual", icon: <EditNote fontSize="small"/>, label: "Manual Entry" },
            { id: "map", icon: <MapIcon fontSize="small"/>, label: "Map View" }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {setActiveTab(tab.id as any); setRecommendations([]);}}
              className={`px-6 py-2 rounded-xl flex items-center gap-2 transition-all font-bold uppercase text-[10px] tracking-widest ${activeTab === tab.id ? "bg-green-500 text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP SECTION: MAP OR COMPACT FORM */}
      <section className="p-4 md:p-8 h-[700px]">
        <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-[#050a06]">
          
          {/* BACKGROUND IMAGE OVERLAY */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <img 
               src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
               alt="farming" 
               className="w-full h-full object-cover grayscale"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-[#020603] via-transparent to-[#020603]" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "map" ? (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full relative">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <div className="absolute top-8 left-0 right-0 z-50 flex justify-center">
                    <ModernSearch onPlaceSelect={handlePlaceSelect} />
                  </div>
                  <Map defaultCenter={{ lat: 17.385, lng: 78.486 }} defaultZoom={8} mapId={import.meta.env.VITE_GOOGLE_MAP_ID} disableDefaultUI className="w-full h-full grayscale brightness-50">
                    {selectedPlace?.geometry?.location && (
                      <AdvancedMarker position={selectedPlace.geometry.location}>
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-[0_0_15px_#22c55e]" />
                      </AdvancedMarker>
                    )}
                    <MapHandler place={selectedPlace} />
                  </Map>
                </APIProvider>
              </motion.div>
            ) : (
              <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full w-full relative z-10 flex flex-col justify-center items-center px-6">
                <div className="max-w-3xl w-full bg-black/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <Science className="text-green-500" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Soil Matrix Input</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { k: 'N', label: 'Nitrogen', icon: <Science fontSize="small"/> },
                      { k: 'P', label: 'Phosphorus', icon: <Science fontSize="small"/> },
                      { k: 'K', label: 'Potassium', icon: <Science fontSize="small"/> },
                      { k: 'ph', label: 'pH Level', icon: <WaterDrop fontSize="small"/> },
                      { k: 'temperature', label: 'Temp', icon: <Thermostat fontSize="small"/> },
                      { k: 'humidity', label: 'Humidity', icon: <Opacity fontSize="small"/> },
                      { k: 'rainfall', label: 'Rainfall', icon: <Grain fontSize="small"/> }
                    ].map((item) => (
                      <div key={item.k} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-1 opacity-50">
                          <span className="scale-75 text-green-500">{item.icon}</span>
                          <p className="text-[9px] font-bold uppercase tracking-widest">{item.label}</p>
                        </div>
                        <input 
                          type="number"
                          value={(manualData as any)[item.k]}
                          onChange={(e) => setManualData({...manualData, [item.k]: parseFloat(e.target.value)})}
                          className="bg-transparent text-white text-xl font-black w-full outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* COMPACT RESULTS SECTION */}
      <section ref={resultsRef} className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence>
          {(info || activeTab === "manual") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-l-2 border-green-500 pl-6">
                <div>
                  <p className="text-green-500 font-bold text-[9px] uppercase tracking-widest mb-1 flex items-center gap-2">
                    <LocationOn fontSize="inherit" /> NODE: {activeTab === "map" ? "SATELLITE" : "MANUAL"}
                  </p>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {activeTab === "map" ? info?.name : "Custom"} <span className="text-white/10">/</span> <span className="text-green-500">{activeTab === "map" ? info?.district : "Params"}</span>
                  </h2>
                </div>
              </div>

              {/* ACTION PANEL */}
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-2">
                  {["Kharif", "Rabi", "Summer"].map((s) => (
                    <button key={s} onClick={() => setSeason(s)} className={`px-5 py-2 rounded-xl font-bold text-[10px] uppercase transition-all border ${season === s ? 'bg-green-500 text-black border-green-500 shadow-lg' : 'bg-transparent text-gray-500 border-white/10'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={getPrediction}
                  disabled={loading}
                  className="w-full md:w-auto bg-green-500 text-black px-12 py-4 rounded-2xl font-black uppercase italic text-sm hover:scale-105 transition-all shadow-xl shadow-green-500/20"
                >
                  {loading ? "Syncing..." : "Execute AI Diagnostic"}
                </button>
              </div>

              <Recommedations recommendations={recommendations} />              
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}