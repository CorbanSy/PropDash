//propdash-mvp\src\pages\NotFound.jsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-3 text-xl text-gray-600">Oops... page not found.</p>
      <p className="mt-1 text-gray-500 text-center max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Go back home
      </a>

      <img
        className="mt-10 w-60 opacity-80"
        src="/assets/notfound-illustration.svg"
        alt="Not found"
      />
    </div>
  );
}
