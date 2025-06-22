import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import MyProfile from "./pages/user/MyProfile";
import Register from "./pages/auth/Register";
import Navbar from "./components/shared/Navbar";
import LessonsList from "./components/LessonsTable";
import Blog from "./components/SportBlog";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/Home";
import Contact from "./pages/user/Contact"; 
import About from "./components/shared/About"; 
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import TrainerProfile from "./pages/trainer/TrainerProfile";


function Layout() {
  return (
    <>
      <Navbar />
      
      <Outlet />

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
           <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} /> {/* דף הבית */}
            <Route path="Blog" element={<Blog />} />
            <Route path="TrainerProfile" element={<TrainerProfile />} />
            <Route path="Login" element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route path="MyProfile" element={<MyProfile />} />
            <Route path="lessons" element={<LessonsList />} /> 
            <Route path="Contact" element={<Contact />} />
            <Route path="About" element={<About />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
