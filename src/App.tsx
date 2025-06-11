import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import MyProfile from "./pages/user/MyProfile";
import Register from "./pages/auth/Register";
import Layout from "./layouts/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="Login" element={<Login />} />
          <Route path="MyProfile" element={<MyProfile />} />
          <Route path="Register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
