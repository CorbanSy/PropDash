export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
