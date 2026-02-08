import React, { useState, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { logout } from "~/redux/actions";

// Agriculture Specific Icons
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science"; // For Soil Analysis
import TimelineIcon from "@mui/icons-material/Timeline"; // For Market Trends
import LocalFloristIcon from "@mui/icons-material/LocalFlorist"; // For Crop Recommendations
import TravelExploreIcon from "@mui/icons-material/TravelExplore"; // For Field Mapping
import PersonIcon from "@mui/icons-material/Person";
import AgricultureIcon from "@mui/icons-material/Agriculture";

// Use the existing constants logic but with Ag-focused items
const agriSidebarItems = [
  { name: "Overview", path: "/dashboard", icon: DashboardIcon },
  { name: "Soil Analysis", path: "/dashboard/soil", icon: ScienceIcon },
  { name: "Crop Advisor", path: "/dashboard/recommend", icon: LocalFloristIcon },
  { name: "Market Trends", path: "/dashboard/market", icon: TimelineIcon },
  { name: "Field Mapping", path: "/dashboard/fields", icon: TravelExploreIcon },
  { name: "My Profile", path: "/dashboard/profile", icon: PersonIcon },
];

const Dashboard: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.reducer.currentUser);
  const userLoading = useSelector((state: any) => state.reducer.userLoading);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#020804] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <AgricultureIcon className="text-green-500" style={{ fontSize: 40 }} />
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen font-sans text-white bg-[#020804]">
      {/* --- TOP NAVIGATION --- */}
      <motion.header 
        className="flex justify-between items-center h-16 px-4 md:px-8 bg-black/40 backdrop-blur-xl border-b border-green-900/30 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="p-2 bg-green-500 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <AgricultureIcon className="text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white hidden sm:block">
            AGRIPREDICT<span className="text-green-500">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
              <p className="text-[10px] text-green-500 font-medium">Verified Farmer</p>
            </div>
            <div 
              className="h-9 w-9 rounded-full border-2 border-green-500/50 overflow-hidden cursor-pointer"
              onClick={handleMenuOpen}
            >
              <img src={user?.picture} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>

          <button className="lg:hidden text-green-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* PROFILE DROPDOWN */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: "#0a120b",
              color: "white",
              borderRadius: "16px",
              border: "1px solid rgba(34,197,94,0.2)",
              mt: 1.5,
              minWidth: 180,
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }
          }}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            navigate("/dashboard/profile");
          }} sx={{ fontSize: '14px', py: 1.5 }}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 18 }} /> My Profile
          </MenuItem>
          <hr className="border-white/10" />
          <MenuItem onClick={handleLogout} sx={{ fontSize: '14px', py: 1.5, color: '#ff4444' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Logout
          </MenuItem>
        </Menu>
      </motion.header>

      <div className="flex">
        {/* --- DESKTOP SIDEBAR --- */}
        <motion.aside
          className="hidden lg:flex flex-col bg-black/20 border-r border-white/5 h-[calc(100vh-64px)] sticky top-16 transition-all"
          animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        >
          <div className="p-4 flex flex-col h-full">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="mb-6 self-end p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-green-500 transition"
            >
              {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>

            <div className="space-y-2 flex-1">
              {agriSidebarItems.map((item) => (
                <Tooltip key={item.name} title={isSidebarCollapsed ? item.name : ""} placement="right">
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-xl transition-all group hover:bg-green-500/10"
                  >
                    <item.icon className={`transition-colors ${isSidebarCollapsed ? "mx-auto" : "mr-3"} group-hover:text-green-400 text-gray-400`} />
                    {!isSidebarCollapsed && (
                      <span className="text-sm font-semibold tracking-wide text-gray-300 group-hover:text-white">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* --- MOBILE OVERLAY SIDEBAR --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a120b] z-[60] p-6 lg:hidden shadow-2xl border-r border-green-900/30"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-green-500">MENU</span>
                <CloseIcon onClick={() => setIsSidebarOpen(false)} />
              </div>
              <div className="space-y-4">
                {agriSidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center p-4 bg-white/5 rounded-2xl text-gray-300"
                  >
                    <item.icon className="mr-4 text-green-500" />
                    <span className="font-bold">{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;