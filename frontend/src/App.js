import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider } from 'styled-components';

// Import styles
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Import components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

// Import pages
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Coach from './pages/Coach';
import Analytics from './pages/Analytics';
import Heatmap from './pages/Heatmap';
import GetStarted from './pages/GetStarted';
import SignIn from './components/Auth/SignInForm';
import SignUp from './components/Auth/SignUpForm';

// Import services
import { AuthProvider, useAuth } from './services/AuthContext';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  margin-top: 64px; /* Header height */
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading...</p>
      </LoadingContainer>
    );
  }
  
  return user ? children : <Navigate to="/signin" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading...</p>
      </LoadingContainer>
    );
  }
  
  return user ? <Navigate to="/coach" replace /> : children;
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <AppContainer>
      <Header />
      
      <MainContent>
        {user && <Sidebar />}
        
        <ContentArea>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to={user ? "/coach" : "/about"} replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/get-started" element={<GetStarted />} />
            
            {/* Authentication routes */}
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/coach" 
              element={
                <ProtectedRoute>
                  <Coach />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/heatmap" 
              element={
                <ProtectedRoute>
                  <Heatmap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ContentArea>
      </MainContent>
      
      <Footer />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppContainer>
  );
};

// Root App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 