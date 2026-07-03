import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFAB from './components/layout/WhatsAppFAB';
import ScrollToTop from './components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider, useCart } from './features/cart/CartContext';
import { useGlobalScrollAnimations } from './hooks/useIntersectionObserver';
import { PRODUCTS } from './data/products';
import { CartItem, OrderReceipt, Product, MattressSize } from './types';
import HomePage from './routes/home/index';
import SleepSciencePage from './routes/pages/sleep-science';
import AboutPage from './routes/pages/about';
import LocationsPage from './routes/pages/locations';
import ContactPage from './routes/pages/contact';
import NotFoundPage from './routes/pages/not-found';
import SuccessPage from './features/cart/success-page';
import ProductList from './components/product/ProductList';
import CompareTable from './components/product/CompareTable';
import CartPage from './components/cart/CartPage';
import PageShell from './components/layout/PageShell';
import SEO from './components/seo/SEO';
import ProductDetailRoute from './routes/product/product-detail';


const MattressBuilder = lazy(() => import('./components/builder/MattressBuilder'));

function AppContent() {
  const navigate = useNavigate();
  const cart = useCart();
  useGlobalScrollAnimations();

  const page = (name: string) => {
    if (name === 'home') navigate('/');
    else navigate(`/${name}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const pdp = (slug: string) => {
    navigate(`/mattresses/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCheckoutSuccess = (orderId: string, summary: OrderReceipt) => {
    cart.clearCart();
    navigate('/success');
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-between selection:bg-brand-500 selection:text-brand-950">
      <Header cartCount={cart.totalCount} />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-brand-700 text-sm uppercase tracking-[0.3em]">Loading…</div>
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onAddToCartDirect={(product, size, acc, fabric) => cart.addToCartDirect(product, size, acc, fabric)}
                    onOrderSuccess={(orderId, summary) => onCheckoutSuccess(orderId, summary)}
                    onNavigate={page}
                  />
                }
              />
<Route
  path="/builder"
  element={
    <PageShell
      title="Custom Mattress Builder - Design Your Perfect Sleep | RelaxPro"
      description="Personalize your GOLS natural latex mattress layer-by-layer. Choose GOTS bamboo cover, composite layers, custom size."
    >
      <MattressBuilder onAddToCart={(item) => cart.addToCart(item)} onNavigate={page} />
    </PageShell>
  }
/>
<Route
  path="/catalog"
  element={
    <PageShell
      title="Our Natural Latex & Orthopedic Mattresses | RelaxPro"
      description="Browse India's finest chemical-free mattresses. Premium 7-zone latex, heavy rebonded ortho systems, and ventilated sleep tech."
    >
      <ProductList
        onAddToCartDirect={(product, size, includeAcc) => cart.addToCartDirect(product, size, includeAcc)}
        onNavigateToPdp={pdp}
        onNavigate={page}
        selectedTier="all"
        setSelectedTier={() => {}}
      />
    </PageShell>
  }
/>
<Route
  path="/mattresses/:slug"
  element={<ProductDetailRoute onAddToCartDirect={cart.addToCartDirect} onNavigateBack={() => page('catalog')} />}
/>
<Route
  path="/compare"
  element={
    <PageShell
      title="Compare Mattresses | RelaxPro Premium Mattresses"
      description="Compare dimensions, layers, comfort levels, and prices of RelaxPro natural latex mattresses."
    >
      <CompareTable
        onAddToCartDirect={(product, size, includeAcc) => cart.addToCartDirect(product, size, includeAcc)}
        onNavigateToPdp={pdp}
        onNavigate={page}
      />
    </PageShell>
  }
/>
<Route path="/science" element={<SleepSciencePage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/locations" element={<LocationsPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route
  path="/success"
  element={
    <SuccessPage
      orderReceipt={null}
      onReset={() => {
        cart.clearCart();
      }}
    />
  }
/>
<Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppFAB />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
