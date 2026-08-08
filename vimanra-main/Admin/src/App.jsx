import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CountsProvider } from "./context/CountsContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";
import Reviews from "./pages/Reviews";
import Gallery from "./pages/Gallery";
import Facilities from "./pages/Facilities";
import Rooms from "./pages/Rooms";
import ThingsToDo from "./pages/ThingsToDo";

function RequireAuth({ children }) {
  const { admin } = useAuth();
  const location = useLocation();
  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/enquiries" element={<RequireAuth><Enquiries /></RequireAuth>} />
      <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />
      <Route path="/gallery" element={<RequireAuth><Gallery /></RequireAuth>} />
      <Route path="/facilities" element={<RequireAuth><Facilities /></RequireAuth>} />
      <Route path="/rooms" element={<RequireAuth><Rooms /></RequireAuth>} />
      <Route path="/things-to-do" element={<RequireAuth><ThingsToDo /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CountsProvider>
          <AppRoutes />
        </CountsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
