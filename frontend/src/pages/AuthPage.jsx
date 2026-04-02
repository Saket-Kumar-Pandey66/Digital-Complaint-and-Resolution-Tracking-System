import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, required }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        <Icon size={16} />
      </div>
      <input
        type={isPassword ? (show ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm font-medium transition-all outline-none"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-base)",
          color: "var(--color-text-primary)",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid var(--color-accent)";
          e.target.style.boxShadow = "0 0 0 3px var(--color-accent-muted)";
          e.target.style.background = "var(--color-elevated)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid var(--color-border-base)";
          e.target.style.boxShadow = "none";
          e.target.style.background = "var(--color-surface)";
        }}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", username: "", email: "", password: "", confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        await api.post("/auth/register", formData);
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-base)" }}>
      {/* ─── Left Branding Side ─── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden bg-[var(--color-surface)] border-r border-[var(--color-border-base)]">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div
              className="p-2.5 rounded-xl transition-all"
              style={{
                background: "var(--color-accent-muted)",
                border: "1px solid var(--color-border-base)",
              }}
            >
              <ShieldCheck size={22} className="text-[color:var(--color-accent)]" />
            </div>
            <span className="text-2xl font-bold text-[color:var(--color-text-primary)] tracking-tight">DCRTS Portal</span>
          </button>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-[color:var(--color-text-primary)] leading-[1.1] tracking-tight mb-6"
          >
            Resolve issues with
            <br />
            <span className="text-[color:var(--color-accent)]">complete clarity.</span>
          </motion.h1>
          <p className="text-[color:var(--color-text-muted)] text-lg leading-relaxed max-w-sm">
            A centralized portal for academic institutions to capture, categorize, and resolve complaints — fast.
          </p>
        </div>

        {/* Workflow steps glass card */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="rounded-xl p-6 space-y-5"
            style={{
              background: "var(--color-elevated)",
              border: "1px solid var(--color-border-base)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-faint)] mb-2">How it works</p>
            {[
              { num: "01", text: "Submit issue details", color: "var(--color-accent)" },
              { num: "02", text: "Admin review & triage", color: "var(--color-accent)" },
              { num: "03", text: "Real-time tracking", color: "var(--color-accent)" },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "transparent", border: `1px solid ${step.color}`, color: step.color }}
                >
                  {step.num}
                </div>
                <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{step.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Right Form Side ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-md">

          {/* Back to home (mobile) */}
          <button
            onClick={() => navigate("/")}
            className="lg:hidden flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to home
          </button>

          {/* Header */}
          <motion.div
            key={isLogin ? "login-header" : "register-header"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2
              className="text-3xl font-semibold text-[color:var(--color-text-primary)] mb-2 tracking-tight"
            >
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-[color:var(--color-text-muted)] text-sm">
              {isLogin
                ? "Sign in to access your complaint dashboard."
                : "Register as a student or staff member."}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5 overflow-hidden"
                >
                  <InputField icon={UserIcon} type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
                  <InputField icon={Mail} type="email" name="email" placeholder="Institutional Email" required value={formData.email} onChange={handleChange} />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField icon={UserIcon} type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} />
            <InputField icon={Lock} type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="confirm-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <InputField icon={Lock} type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-lg font-medium text-white text-base transition-all flex items-center justify-center gap-2"
                style={{
                  background: loading ? "var(--color-accent-hover)" : "var(--color-accent)",
                  boxShadow: "0 0 12px var(--color-accent-muted)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </motion.button>
            </div>
          </form>


          {/* Toggle */}
          <div className="mt-7 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={handleToggle}
                className="font-semibold text-[color:var(--color-accent)] hover:text-white transition-colors"
              >
                {isLogin ? "Sign up for free" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
