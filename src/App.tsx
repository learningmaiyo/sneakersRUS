import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/DjangoAuth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CheckoutSuccess from "./pages/CheckoutSuccess";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/products" element={<Products />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
