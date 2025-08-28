import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ReelsPage from "./pages/ReelsPage";
import VideosPage from "./pages/VideosPage";
import VideoDetail from "./pages/VideoDetail";
import BlogPage from "./pages/BlogPage";
// import ReelDetail from "./pages/ReelDetail";
import ReelPage from "./pages/ReelPage";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import VerificationIdentityPage from "./pages/VerificationIdentityPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify-identity" element={<VerificationIdentityPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/activate-account" element={<ActivateAccountPage />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/reels" element={<ProtectedRoute><ReelsPage /></ProtectedRoute>} />
              <Route path="/reels/:id" element={<ProtectedRoute><ReelPage /></ProtectedRoute>} />
              <Route path="/videos" element={<ProtectedRoute><VideosPage /></ProtectedRoute>} />
              <Route path="/videos/:id" element={<ProtectedRoute><VideoDetail /></ProtectedRoute>} />
              <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
              {/* <Route path="/reels/:id" element={<ProtectedRoute><ReelDetail /></ProtectedRoute>} /> */}
              <Route path="/blog/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
