import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // or "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";

// Define custom JWT interface
interface CustomJwtPayload extends JwtPayload {
  name: string;
  email: string;
  picture: string;
}
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";

// Icons
import {
  Email, Lock, Visibility, VisibilityOff,
  Agriculture, Grass, ChevronLeft
} from "@mui/icons-material";
import { getUser } from "~/redux/actions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUser(userId));
      navigate("/dashboard");
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      toast.error("Required fields are missing");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
        { email, password }
      );

      if (res.status === 200) {
        toast.success("Welcome back, Farmer!");
        localStorage.setItem("userId", res?.data?.user?._id);
        dispatch(getUser(res?.data?.user?._id));
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed. Check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    console.log("Decoded JWT:", jwtDecode(credentialResponse.credential));

    try {
      const googleCreds = jwtDecode<CustomJwtPayload>(credentialResponse.credential);
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
    } catch (error: any) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
        "Failed to login up. Please try again later.",
      );
      toast.error(
        error?.response?.data?.message ||
        "Failed to login up. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020804] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >

        {/* Left Side: Visual/Branding */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-green-600 to-green-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="https://www.transparenttextures.com/patterns/leaf.png"
              alt="pattern"
              className="w-full h-full object-repeat"
            />
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center text-white/80 hover:text-white transition mb-12 group">
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to site</span>
            </Link>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-lg text-green-700">
                <Agriculture fontSize="large" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white">AGRIPREDICT<span className="text-green-300">.AI</span></h2>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Predicting the <br /> <span className="text-green-200 underline decoration-green-400/50">Next Harvest.</span>
            </h1>
          </div>

          <div className="relative z-10 bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <p className="text-green-50 text-sm leading-relaxed italic">
              "Access your soil analytics dashboard and market insights with a single click."
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-transparent">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500">Log in to manage your digital farm.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-green-500 ml-1">Email Address</label>
              <div className="relative group">
                <Email className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                  placeholder="name@farm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-green-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white">
                <input type="checkbox" className="accent-green-500 rounded" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-green-500 font-bold hover:text-green-400">
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-500 text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <span>SIGN IN TO DASHBOARD</span>}
            </motion.button>
          </form>

          <div className="my-8 flex items-center before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
            <span className="px-4 text-xs font-bold text-gray-600 uppercase">OR CONTINUE WITH</span>
          </div>

          <div className="flex justify-center">
            <div className="rounded-3xl overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setError("Google login failed.");
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
            New to AgriPredict?{" "}
            <Link to="/signup" className="text-white font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
