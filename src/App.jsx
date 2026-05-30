import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./layouts/AdminLayout";

// Lazy load semua halaman — bundle dipecah per route
const Login          = lazy(() => import("./pages/Login"));
const Dashboard      = lazy(() => import("./pages/Dashboard"));
const HeroSection    = lazy(() => import("./pages/HeroSection"));
const Products       = lazy(() => import("./pages/Products"));
const Partners       = lazy(() => import("./pages/Partners"));
const Testimonials   = lazy(() => import("./pages/Testimonials"));
const FooterSettings = lazy(() => import("./pages/FooterSettings"));
const SectionImagePage = lazy(() => import("./pages/SectionImagePage"));

// Fallback saat chunk sedang dimuat
function PageLoader() {
  return (
    <div className="page-loading">
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Root → landing page statis */}
            <Route path="/" element={<RedirectToLanding />} />

            {/* Login admin */}
            <Route path="/login" element={<Login />} />

            {/* Admin panel (protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="hero" element={<HeroSection />} />
              <Route path="products" element={<Products />} />
              <Route
                path="intro"
                element={
                  <SectionImagePage
                    docId="intro"
                    title="Intro Section"
                    description="Kelola gambar dan tombol di section perkenalan RHT"
                    folder="rhtairpro/intro"
                    showButton
                  />
                }
              />
              <Route
                path="applications"
                element={
                  <SectionImagePage
                    docId="applications"
                    title="Aplikasi / Fasilitas"
                    description="Kelola gambar section fasilitas publik"
                    folder="rhtairpro/applications"
                  />
                }
              />
              <Route path="partners" element={<Partners />} />
              <Route
                path="technology"
                element={
                  <SectionImagePage
                    docId="technology"
                    title="Teknologi NCCO"
                    description="Kelola gambar section teknologi NCCO"
                    folder="rhtairpro/technology"
                  />
                }
              />
              <Route
                path="advantages"
                element={
                  <SectionImagePage
                    docId="advantages"
                    title="Keunggulan NCCO"
                    description="Kelola gambar section keunggulan produk"
                    folder="rhtairpro/advantages"
                  />
                }
              />
              <Route path="testimonials" element={<Testimonials />} />
              <Route
                path="about"
                element={
                  <SectionImagePage
                    docId="about"
                    title="Tentang RHT"
                    description="Kelola gambar section tentang perusahaan"
                    folder="rhtairpro/about"
                  />
                }
              />
              <Route path="footer" element={<FooterSettings />} />
            </Route>

            {/* Catch-all → landing */}
            <Route path="*" element={<RedirectToLanding />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

function RedirectToLanding() {
  window.location.replace("/landing.html");
  return null;
}
