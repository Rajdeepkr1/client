import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { WalletProvider } from './context/WalletContext';
import { Shell } from './components/layout/Shell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { DashboardPage } from './pages/DashboardPage';
import { TopicPage } from './pages/TopicPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WalletPage } from './pages/WalletPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route
            path="bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/:subject"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route path="subjects/:subject" element={<TopicPage />} />
          <Route path="subjects/:subject/topics/:topicId" element={<TopicPage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <PurchaseProvider>
            <WalletProvider>
              <AnimatedRoutes />
            </WalletProvider>
          </PurchaseProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
