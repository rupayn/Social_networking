import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-gray-800 dark:text-gray-100">404</h1>

        <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Page Not Found
        </p>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable, or you entered the wrong URL.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go back home
          </Link>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
