import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider, useCart } from './features/cart/CartContext';
import { useGlobalScrollAnimations } from './hooks/useIntersectionObserver';
import { getSiteSettings } from './lib/queries';
import { OrderReceipt, Tier } from './types';
import HomePage from './routes/home/index';
import PageShell from './components/layout/PageShell';
import LeadPopup from './components/home/LeadPopup';
import { usePopup } from './hooks/usePopup';
const MattressBuilder = lazy(() => import('./components/builder/MattressBuilder'));
const SleepSciencePage = lazy(() => import('./routes/pages/sleep-science'));
const AboutPage = lazy(() => import('./routes/pages/about'));
const AboutRelaxProMattressPage = lazy(() => import('./routes/pages/about-relaxpro-mattress'));
const MattressTypePage = lazy(() => import('./routes/pages/mattress-type'));
const LocationsPage = lazy(() => import('./routes/pages/locations'));
const ContactPage = lazy(() => import('./routes/pages/contact'));
const NotFoundPage = lazy(() => import('./routes/pages/not-found'));
const AccessoriesPage = lazy(() => import('./routes/pages/accessories'));
const CertificatesPage = lazy(() => import('./routes/pages/certificates'));
const StudioRedirect = lazy(() => import('./routes/pages/studio'));
const SuccessPage = lazy(() => import('./features/cart/success-page'));
const ProductList = lazy(() => import('./components/product/ProductList'));
const CompareTable = lazy(() => import('./components/product/CompareTable'));
const CartPage = lazy(() => import('./components/cart/CartPage'));
const ProductDetailRoute = lazy(() => import('./routes/product/product-detail'));
const VoiceAssistant = React.lazy(() => import('./features/voice-ai/VoiceAssistant'));
import { ToastProvider } from './components/ui/Toast';

function AppContent() {
  const navigate = useNavigate();
  const cart = useCart();
  const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | 'all'>('all');
  const [popupSettings, setPopupSettings] = useState<any>(null);
  const popup = usePopup(popupSettings?.leadPopup ? {
    enabled: popupSettings.leadPopup.enabled,
    initialDelay: popupSettings.leadPopup.initialDelay,
    cooldownSeconds: popupSettings.leadPopup.cooldownSeconds,
    scrollPercent: popupSettings.leadPopup.scrollPercent,
  } : undefined);
  useGlobalScrollAnimations();

  useEffect(() => {
    getSiteSettings().then(s => {
      setPopupSettings(s);
    }).catch(() => {});
  }, []);

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
    <div className="min-h-screen bg-secondary flex flex-col justify-between selection:bg-brand-500 selection:text-brand-950">
      <Header cartCount={cart.totalCount} />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-brand-600/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-graphite-400 text-[10px] font-accent uppercase tracking-[0.3em]">Loading</span>
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
                    title="Build Your Mattress | RelaxPro"
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
                    title="Natural Latex Mattresses | RelaxPro Premium Mattresses"
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
                    title="Compare Natural Latex Mattresses | RelaxPro"
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
                    title="Cart | RelaxPro"
                    description="Review your selected natural latex mattress and accessories before checkout."
                    noindex
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
              <Route path="/about-relaxpro-mattress" element={<AboutRelaxProMattressPage />} />
              <Route path="/latex-mattress" element={<MattressTypePage slug="latex-mattress" />} />
              <Route path="/natural-latex-mattress" element={<MattressTypePage slug="natural-latex-mattress" />} />
              <Route path="/hr-foam-mattress" element={<MattressTypePage slug="hr-foam-mattress" />} />
              <Route path="/rebonded-mattress" element={<MattressTypePage slug="rebonded-mattress" />} />
              <Route path="/orthopedic-mattress" element={<MattressTypePage slug="orthopedic-mattress" />} />
              <Route path="/custom-size-mattress" element={<MattressTypePage slug="custom-size-mattress" />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route
                path="/accessories"
                element={
                  <PageShell
                    title="Mattress Accessories — Pillows & Protectors | RelaxPro"
                    description="Complete your sleep setup with latex pillows, shredded pillows, fiber pillows, and mattress protectors. Direct factory pricing."
                  >
                    <AccessoriesPage />
                  </PageShell>
                }
              />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/studio" element={<StudioRedirect />} />
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
      <Suspense fallback={null}>
        <VoiceAssistant />
      </Suspense>
      <LeadPopup
        isOpen={popup.isOpen}
        onClose={popup.close}
        onSubmitted={popup.onSubmitted}
        onDontShowAgain={popup.onDontShowAgain}
        content={popupSettings?.leadPopup}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
