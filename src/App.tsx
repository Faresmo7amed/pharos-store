import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/layout/Layout'
import { ShopProvider } from './context/ShopContext'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'

export default function App() {
    return (
        <BrowserRouter>
            <ShopProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="/products" replace />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:id" element={<ProductPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </ShopProvider>
        </BrowserRouter>
    )
}
