import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { AuthInitializer } from './components/AuthInitializer';
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import AppRouter from "./routes/AppRouter";
import './css/responsive.css';
import './css/mobile-tables.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
    },
  },
});

function Layout() {
  return (
    <>
      <AuthInitializer />
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
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/*" element={<Layout />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
