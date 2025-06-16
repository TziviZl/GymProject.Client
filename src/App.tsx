import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import MyProfile from "./pages/user/MyProfile";
import Register from "./pages/auth/Register";
import Navbar from "./components/shared/Navbar";
import LessonsList from "./components/LessonsTable";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/Home";



function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} /> {/* דף הבית */}
            <Route path="Login" element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route path="MyProfile" element={<MyProfile />} />
            <Route path="lessons" element={<LessonsList />} /> {/* הועבר לכאן */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
