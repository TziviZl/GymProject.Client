import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import MyProfile from "./pages/user/MyProfile";
import Register from "./pages/auth/Register";
import Navbar  from "./components/shared/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="Login" element={<Login />} />
          <Route path="MyProfile" element={<MyProfile />} />
          <Route path="Register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
