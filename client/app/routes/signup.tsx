import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "~/redux/actions";

// Icons
import { 
  Person, Email, Lock, Visibility, VisibilityOff, 
  Agriculture, ChevronLeft, Spa 
} from "@mui/icons-material";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUser(userId));
      navigate("/dashboard");
    }
  }, [dispatch, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/signup`, {
        name,
        email,
        password,
        picture: "https://res.cloudinary.com/doxykd1yk/image/upload/v1751733473/download_ywnnsj.png",
      });

      if (res.status === 201) {
        toast.success("Account created successfully!");
        localStorage.setItem("userId", res?.data?.user?._id);
        dispatch(getUser(res?.data?.user?._id));
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
      setLoading(true);
      console.log("Decoded JWT:", jwtDecode(credentialResponse.credential));
  
      try {
        const googleCreds = jwtDecode(credentialResponse.credential);
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/user/googleauth`,
          {
            name: googleCreds?.name,
            email: googleCreds?.email,
            password: googleCreds?.sub,
            picture: googleCreds?.picture,
          },
        );
  
        console.log("googleauth response:", res);
  
        if (res.status === 200 || res.status === 201) {
          toast.success("Signup successful!");
          setEmail("");
          setPassword("");
          localStorage.setItem("userId", res?.data?.user?._id);
          dispatch(getUser(res?.data?.user?._id));
  
          const redirectPath =
            localStorage.getItem("redirectPath") || "/dashboard";
          navigate(redirectPath);
          localStorage.removeItem("redirectPath");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to login up. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#020804] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl z-10"
      >
        {/* Left Visual Side */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-emerald-700 to-green-950 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <Link to="/" className="flex items-center text-white/70 hover:text-white transition mb-12 group">
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-xs font-bold uppercase tracking-widest ml-1">Home</span>
            </Link>
            <div className="flex items-center space-x-3 mb-8">
               <div className="p-3 bg-white rounded-2xl text-green-800">
                  <Spa fontSize="large" />
               </div>
               <h2 className="text-2xl font-black tracking-tighter text-white uppercase">AgriPredict</h2>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Start Your <br /> <span className="text-green-300">Sustainable</span> <br /> Journey.
            </h1>
          </div>
          
          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
             <p className="text-green-50 text-sm italic">
               "Join 12,000+ farmers using AI to optimize soil health and maximize seasonal profits."
             </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-transparent">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white">Create Account</h2>
            <p className="text-gray-500 mt-2">Join the future of data-driven farming.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 ml-1">Full Name</label>
              <div className="relative group">
                <Person className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all"
                  placeholder="Farmer John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 ml-1">Email Address</label>
              <div className="relative group">
                <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-green-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type={showCPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-green-500 transition-all"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowCPassword(!showCPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showCPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-4 bg-green-500 text-black font-black rounded-2xl shadow-xl hover:bg-green-400 transition-all flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <span>CREATE ACCOUNT</span>}
            </motion.button>
          </form>

          <div className="my-6 flex items-center before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
            <span className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or Register With</span>
          </div>

          <div className="flex justify-center">
            <div className="rounded-3xl overflow-hidden">
                <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                    toast.error("Google login failed.");
                }}
                width="100%"
                theme="filled_blue"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
                auto_select={true}
                />
            </div>
           </div>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}