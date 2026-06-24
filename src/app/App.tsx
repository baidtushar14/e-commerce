import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { ProductListPage } from "./pages/ProductList";
import { ProductDetailPage } from "./pages/ProductDetail";
import { NotFoundPage } from "./pages/NotFound";
import "./styles/global.scss";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
