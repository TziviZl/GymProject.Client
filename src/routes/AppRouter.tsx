import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MyProfile from "../pages/user/MyProfile";
import TrainerProfile from "../pages/trainer/TrainerProfile";
import SecretaryDashboard from "../pages/SecretaryDashboard";
import SecretaryPersonalArea from "../pages/admin/SecretaryPersonalArea";
import AllGymnasts from "../pages/admin/Gymnasts/AllGymnasts";
import AllTrainers from "../pages/admin/Trainers/AllTrainers";
import AllClasses from "../pages/admin/Classes/AllClasses";
import LessonsList from "../components/LessonsTable";
import Contact from "../pages/user/Contact";
import SecretaryMessages from "../pages/admin/Messages";
import Blog from "../components/SportBlog";
import About from "../components/shared/About";
import { ROUTES } from "../utils/constants";

export default function AppRouter() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.MY_PROFILE} element={<MyProfile />} />
      <Route path={ROUTES.TRAINER_PROFILE} element={<TrainerProfile />} />
      <Route path={ROUTES.SECRETARY_DASHBOARD} element={<SecretaryDashboard />} />
      <Route path={ROUTES.SECRETARY_PERSONAL_AREA} element={<SecretaryPersonalArea />} />
      <Route path={ROUTES.MANAGE_GYMNASTS} element={<AllGymnasts />} />
      <Route path={ROUTES.MANAGE_TRAINERS} element={<AllTrainers />} />
      <Route path={ROUTES.MANAGE_CLASSES} element={<AllClasses />} />
      <Route path={ROUTES.LESSONS} element={<LessonsList />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.MESSAGES} element={<SecretaryMessages />} />
      <Route path={ROUTES.BLOG} element={<Blog />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
    </Routes>
  );
}