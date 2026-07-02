import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getToken, clearToken, type UserProfile } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!token) return;
    api<UserProfile>("/users/current")
      .then(setUser)
      .catch(() => setUser(null));
  }, [token]);

  useEffect(() => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    api<UserProfile>("/users/current")
      .then(setUser)
      .catch(() => setUser(null)); // solo no mostrar el nombre, sin expulsar
  }, [location]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <span className="font-bold text-lg">✈️ FlyAway</span>
        <Link to="/search" className="hover:underline">
          Buscar Vuelos
        </Link>
        {token && (
          <Link to="/bookings" className="hover:underline">
            Mis Reservas
          </Link>
        )}
      </div>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            {user && <span className="text-sm">Hola, {user.username}</span>}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
