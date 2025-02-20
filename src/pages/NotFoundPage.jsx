import { Link } from "react-router-dom";
import "./csspage/page.css"

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
