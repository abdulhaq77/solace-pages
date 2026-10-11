import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { BiHide } from "react-icons/bi";
import { GrFormViewHide } from "react-icons/gr";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track visibility state

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const user = await loginUser(data.email, data.password);

      // Redirect based on role (Three-tier architecture routing)
      if (user.role === "admin") {
        navigate("/admin");
        toast.success("Admin login successful!");
      } else {
        navigate("/shop");
        toast.success("Login successful!");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Failed to sign in. Please check your credentials.",
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to sign in. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-amber-200">
            Welcome Back
          </span>
          <h2 className="text-3xl font-serif text-amber-100">
            Sign In to Solace
          </h2>
          <p className="text-stone-400 text-xs">
            Access your digital library and e-novels.
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-rose-950/50 border border-rose-900 text-rose-300 text-xs rounded text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full bg-stone-950 border border-stone-800 rounded px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
              placeholder="reader@solace.com"
            />
            {errors.email && (
              <p className="text-rose-400 text-[10px] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full bg-stone-950 border border-stone-800 rounded pl-4 pr-10 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-200 focus:outline-none text-xs tracking-wider"
              >
                {showPassword ? <GrFormViewHide /> : <BiHide />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-400 text-[10px] mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-100 text-stone-950 py-3 rounded text-xs uppercase tracking-widest font-bold hover:bg-amber-200 transition shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-stone-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-200 hover:underline font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
