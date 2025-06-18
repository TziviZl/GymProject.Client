// src/components/shared/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // גלול לראש הדף בכל מעבר דף
  }, [pathname]);

  return null; // הקומפוננטה לא מציגה שום דבר
}
