import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { theme } from "../../../styles/theme";
import {
  validateLoginForm,
  parseLoginError,
  formatLoginData,
  validateUserType,
  getRedirectPath,
} from "../../../utils/loginValidation";

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

    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setLoading(true);

    try {
      const loginData = formatLoginData(formData);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword(loginData);

      if (signInError) {
        setError(parseLoginError(signInError));
        setLoading(false);
        return;
      }

      const typeValidation = validateUserType(data.user, userType);
      
      if (!typeValidation.isValid) {
        setError(typeValidation.error);
        setLoading(false);
        return;
      }

      console.log("Login successful:", data.user);
      setLoading(false);

      const redirectPath = getRedirectPath(data.user);
      navigate(redirectPath);
      
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className={`${theme.alert.error} mb-6 flex items-start gap-3`}>
          <div className="bg-red-200 rounded-full p-1 flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
          </div>
          <span className="text-sm">{error}</span>
        </div>
      )}

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