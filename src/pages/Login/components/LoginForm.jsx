// src/pages/Login/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { theme } from "../../../styles/theme";

export default function LoginForm({ userType, styling }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (signInError.message.includes("Email not confirmed")) {
        setError("Please confirm your email address before logging in.");
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    const accountType = data.user.user_metadata?.user_type;
    
    // Validate user type matches
    if (accountType && accountType !== userType) {
      const expectedLabel = userType === "customer" ? "Client" : "Professional";
      const actualLabel = accountType === "customer" ? "Client" : "Professional";
      setError(
        `This account is registered as a ${actualLabel}. Please use the ${actualLabel} login page.`
      );
      setLoading(false);
      return;
    }

    console.log("Login successful:", data.user);
    setLoading(false);

    // Route based on account type
    if (userType === "customer") {
      navigate("/customer/dashboard");
    } else {
      navigate("/provider");
    }
  };

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className={`${theme.alert.error} mb-6 flex items-start gap-3`}>
          <div className="bg-red-200 rounded-full p-1 flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
          </div>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={theme.text.label}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`${theme.input.base} ${styling.input} mt-2`}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={theme.text.label}>Password</label>
            <button
              type="button"
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`${theme.input.base} ${styling.input}`}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${styling.button} disabled:opacity-50 disabled:cursor-not-allowed justify-center`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </>
  );
}