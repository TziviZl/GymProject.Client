import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import AppRouter from "./routes/AppRouter";
import './css/responsive.css';
import './css/mobile-tables.css';

const queryClient = new QueryClient();

function Layout() {
  return (
    <>
      <Navbar />
      <AppRouter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/*" element={<Layout />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
