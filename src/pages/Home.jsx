// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="mb-6 text-4xl font-bold text-center text-gray-800">
        Welcome to PropDash
      </h1>
      <p className="mb-8 text-center text-gray-600 max-w-md">
        Manage your bookings, services, and network all in one place. Get started by logging in or registering an account.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
