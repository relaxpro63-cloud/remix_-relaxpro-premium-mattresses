import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFAB from './components/layout/WhatsAppFAB';
import ScrollToTop from './components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider, useCart } from './features/cart/CartContext';
import { useGlobalScrollAnimations } from './hooks/useIntersectionObserver';
import { OrderReceipt, Tier } from './types';
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
import ProductDetailRoute from './routes/product/product-detail';

const MattressBuilder = lazy(() => import('./components/builder/MattressBuilder'));

function AppContent() {
  const navigate = useNavigate();
  const cart = useCart();
  const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | 'all'>('all');
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
    setOrderReceipt(summary);
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
              <div className="min-h-[60vh] flex items-center justify-center bg-neutral-light">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-neutral-dark/40 text-[10px] font-accent uppercase tracking-[0.3em]">Loading</span>
                </div>
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
                      selectedTier={selectedTier}
                      setSelectedTier={setSelectedTier}
                    />
                  </PageShell>
                }
              />
              <Route path="/mattresses/:slug" element={<ProductDetailRoute onAddToCartDirect={cart.addToCartDirect} onNavigateBack={() => page('catalog')} />} />
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
              <Route
                path="/cart"
                element={
                  <PageShell
                    title="Your Cart | RelaxPro Premium Mattresses"
                    description="Review your selected natural latex mattress and accessories before checkout."
                  >
                    <CartPage
                      cart={cart.cart}
                      onUpdateQty={cart.updateQty}
                      onRemoveItem={cart.removeItem}
                      onClearCart={cart.clearCart}
                      onCheckoutSuccess={onCheckoutSuccess}
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
                    orderReceipt={orderReceipt}
                    onReset={() => {
                      setOrderReceipt(null);
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
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
