import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import MyProfile from "./pages/user/MyProfile";
import Register from "./pages/auth/Register";
import Navbar from "./components/shared/Navbar";
import LessonsList from "./components/StudioClassCard"; // ייבוא של הקומפוננטה החדשה

// קומפוננטת Layout שמכילה את ה-Navbar ו־Outlet להצגת תוכן הדף
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
    <BrowserRouter>
      <Routes>
        {/* כל הדפים תחת Layout שמציג Navbar */}
        <Route path="/" element={<Layout />}>
          {/* דף הבית: שיעורים */}
          <Route index element={<LessonsList />} />

          {/* שאר הדפים */}
          <Route path="Login" element={<Login />} />
          <Route path="MyProfile" element={<MyProfile />} />
          <Route path="Register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
