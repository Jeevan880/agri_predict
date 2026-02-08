import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { updateUser, logout } from "../../redux/actions";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Save from "@mui/icons-material/Save";
import Cancel from "@mui/icons-material/Cancel";
import Agriculture from "@mui/icons-material/Agriculture";
import CheckCircle from "@mui/icons-material/CheckCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import Verified from "@mui/icons-material/Verified";
import Sensors from "@mui/icons-material/Sensors";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";

export default function ProfilePage() {
  const user = useSelector((state) => state.reducer.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(user?.picture || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [activity, setActivity] = useState([]);

  // Fetch Activity Log
  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/${user._id}/activity`
        );
        setActivity(res.data);
      } catch (error) {
        console.error("Failed to fetch farm activity log");
      }
    };
    fetchActivity();
  }, [user]);

  // Image Upload Logic
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        try {
          const res = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/user/update/${user?._id}`,
            { picture: base64Image }
          );
          dispatch(updateUser(res.data.user));
          toast.success("Profile picture updated!");
        } catch (error) {
          toast.error("Upload failed.");
          setProfileImage(user?.picture);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [user, dispatch]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Update Profile Data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/update/${user?._id}`,
        formData
      );
      dispatch(updateUser(res.data.user));
      toast.success("Credentials updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FIXED: DELETE ACCOUNT LOGIC ---
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/user/delete/${user?._id}`
      );
      toast.success("Account permanently deleted.");
      dispatch(logout()); // Clear Redux state
      localStorage.clear(); // Clear local storage
      navigate("/"); // Redirect to landing page
    } catch (error) {
      toast.error("Failed to delete account. Try again later.");
    } finally {
      setOpenDialog(false);
    }
  };

  const renderActivityText = (item) => {
    const typeMap = {
      soil_analysis: "Performed soil analysis",
      crop_recommendation: "Generated AI crop strategy",
      market_check: "Checked market trends"
    };
    return `${typeMap[item.type] || "Activity logged"} for ${item.item?.fieldName || "your farm"}`;
  };

  return (
    <div className="min-h-screen font-sans text-white bg-[#020804] p-4 md:p-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight">Farmer <span className="text-green-500">Profile</span></h1>
          <p className="text-gray-500">Manage your precision farming account and AI data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div {...getRootProps()} className="relative cursor-pointer group">
                  <input {...getInputProps()} />
                  <img src={profileImage} alt="Profile" className="h-44 w-44 rounded-3xl object-cover border-4 border-green-500/20 shadow-2xl" />
                  <div className="absolute inset-0 bg-green-500/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <EditIcon className="text-black" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-3xl font-bold">{formData.name}</h2>
                        <Verified className="text-blue-400" fontSize="small" />
                      </div>
                      <p className="text-gray-400 font-medium mb-6">{formData.email}</p>
                      
                      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-black font-bold rounded-xl hover:scale-105 transition shadow-lg shadow-green-500/20">
                          <EditIcon fontSize="small" /> Edit Bio
                        </button>
                        <button onClick={() => navigate("/reset-password")} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
                          <LockResetIcon fontSize="small" /> Security
                        </button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-green-500 transition"
                      />
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-green-500 transition"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-6 py-2 bg-green-500 text-black font-bold rounded-xl flex items-center gap-2">
                          {isSaving ? <CircularProgress size={18} color="inherit" /> : <Save fontSize="small" />} Save
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/5 rounded-xl">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="bg-gradient-to-br from-green-900/20 to-black p-8 rounded-[2.5rem] border border-green-500/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-2xl text-black"><WorkspacePremium /></div>
                  <h3 className="text-xl font-bold tracking-tight">Active Plan: <span className="text-green-400">{user?.plan || "Standard"}</span></h3>
                </div>
                <button onClick={() => navigate("/pricing")} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-green-400 transition">Upgrade</button>
              </div>
              <p className="text-gray-400 text-sm mb-4">You have full access to satellite mapping and soil nutrient tracking.</p>
            </div>
          </main>

          {/* Sidebar Stats */}
          <aside className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <Sensors className="text-green-500 mb-2" fontSize="large" />
                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">AI Prediction Credits</h4>
                <p className="text-6xl font-black text-white my-2">{user?.credits || 0}</p>
                <p className="text-green-500 text-xs font-bold">Resets Monthly</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h4 className="text-lg font-bold mb-6">Recent Field Logs</h4>
              <ul className="space-y-6">
                {activity.length > 0 ? activity.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 shadow-[0_0_8px_#22c55e]" />
                    <div>
                      <p className="text-sm text-gray-300 leading-snug">{renderActivityText(item)}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                )) : <p className="text-gray-600 text-sm italic">No recent activity detected.</p>}
              </ul>
            </div>

            <button onClick={() => setOpenDialog(true)} className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <DeleteForever fontSize="small" /> Deactivate Account
            </button>
          </aside>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        PaperProps={{ sx: { bgcolor: "#020804", color: "white", borderRadius: "24px", border: "1px solid rgba(239,68,68,0.2)", p: 2 } }}
      >
        <DialogTitle className="font-bold">Erase All Farm Data?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#9ca3af" }}>
            This will permanently delete your soil analysis history, field maps, and remaining AI credits. This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#94a3b8", fontWeight: "bold" }}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            sx={{ bgcolor: "#ef4444", color: "white", fontWeight: "bold", px: 4, borderRadius: "12px", "&:hover": { bgcolor: "#b91c1c" } }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}