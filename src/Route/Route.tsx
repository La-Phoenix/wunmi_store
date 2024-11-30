import React, { Dispatch, SetStateAction } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Auth, { FormData } from '../Auth/Auth';
import HomePage from '../Home/HomePage';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import UploadProductPage from '../UploadProduct/UploadProduct';
import ProfilePage, { User } from '../Profile/ProfilePage';
import CategoryPage from '../Categories/CategoriesPage';
import ResetPassword from '../Forgot-Password/Reset-Password';
import ForgotPassword from '../Forgot-Password/Forgot-Password';
import ChatPage from '../Chat/Chat';
import ChatsPage from '../ChatsPage/chatPage';

// Import your components
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'buyer' | 'seller' | 'admin';
// }

interface AuthContextType {
  user: User | null;
  login: (endpoint: string, payload: FormData) => Promise<unknown>;
  isLoggedIn: boolean;
  logout: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  token: string | undefined;
}

// Create AuthContext
const AuthContext = React.createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  
  const login = async (endpoint: string, payload: FormData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(endpoint, payload);
      setIsLoggedIn(true)
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (token) {
        setToken(token);
        try {
          setIsLoggedIn(true);

          // Decode the JWT to get user information
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          
          // Check if the token is expired
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            logout(); // Log the user out if token is expired
            return;
          }
          if(decodedToken) {
            console.log(decodedToken)
            setUser(decodedToken as User);
          }

        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [isLoggedIn]);

  const logout = () => {
    console.log(Cookies.get('token'))
    Cookies.remove('token');  // Remove JWT 
    console.log(Cookies.get('token'))
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading , isLoggedIn, setIsLoading, token, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<'buyer' | 'seller' | 'admin'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const {isLoggedIn} = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if (roles && !roles.includes(use.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

// Layout Components
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Add your header/navbar here */}
    <main>{children}</main>
    {/* Add your footer here */}
  </div>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
          <button 
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {/* Add sidebar navigation */}
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

// Define the props type for RedirectRoute
interface RedirectRouteProps {
  element: React.ReactElement;
  redirectPath: string;
}

// RedirectRoute Component to handle redirection for authenticated users
const RedirectRoute: React.FC<RedirectRouteProps>= ({ element, redirectPath }) => {
  const { isLoggedIn } = useAuth(); // Access the user from context
  return isLoggedIn ? <Navigate to={redirectPath} replace /> : element;
};


const ChatPageWrapper: React.FC = () => {
  const { senderId, receiverId } = useParams();
  console.log(senderId)
  console.log(receiverId)
  if (!senderId || !receiverId) return <div>Error: Missing parameters</div>;

  return <ChatPage senderId={senderId} receiverId={receiverId} />;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<MainLayout><ProductListPage /></MainLayout>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Redirect to homepage if logged in */}
          <Route
            path="/auth"
            element={<RedirectRoute element={<Auth />} redirectPath="/" />}
          />
          {/* Protected routes - Buyer */}
          <Route 
            path="/upload-product"
            element={
              <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
                <UploadProductPage/>
              </ProtectedRoute>
            }
          />
          {/* Protected routes - Buyer */}
          <Route 
            path="/chats"
            element={
              <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
                <ChatsPage/>
              </ProtectedRoute>
            }
          />
          {/* Protected routes - Buyer */}
          <Route 
            path="/chat/:senderId/:receiverId"
            element={
              <ProtectedRoute roles={['buyer', 'seller', 'admin']}>
                <ChatPageWrapper/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                  <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <ProtectedRoute>
                  <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['buyer']}>
                <DashboardLayout>
                  <OrdersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Seller */}
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute roles={['seller', 'admin']}>
                <DashboardLayout>
                  <SellerProductsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute roles={['seller', 'admin']}>
                <DashboardLayout>
                  <SellerOrdersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Error routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Placeholder components (replace with your actual components)
const ProductListPage: React.FC = () => <div>Product List Page</div>;
const DashboardPage: React.FC = () => <div>Dashboard Page</div>;
const OrdersPage: React.FC = () => <div>Orders Page</div>;
const SellerProductsPage: React.FC = () => <div>Seller Products Page</div>;
const SellerOrdersPage: React.FC = () => <div>Seller Orders Page</div>;
const AdminUsersPage: React.FC = () => <div>Admin Users Page</div>;
const AdminProductsPage: React.FC = () => <div>Admin Products Page</div>;
const AdminOrdersPage: React.FC = () => <div>Admin Orders Page</div>;
const AdminSettingsPage: React.FC = () => <div>Admin Settings Page</div>;
const UnauthorizedPage: React.FC = () => <div>Unauthorized Page</div>;
const NotFoundPage: React.FC = () => <div>404 - Page Not Found</div>;

export default AppRoutes;