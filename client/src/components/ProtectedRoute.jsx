// client/src/components/ProtectedRoute.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bjt_token");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setVerified(true);
    }
  }, [navigate]);

  if (!verified) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-indigo-600 animate-pulse font-bold">
          Memeriksa Tiket Masuk...
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
