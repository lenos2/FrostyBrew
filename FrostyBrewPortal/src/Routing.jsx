import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from '@/pages/BaseLayout';
import Dashboard from '@/pages/Dashboard';
import NoPage from '@/pages/NoPage';
//Products
import BaseProducts from '@/pages/products/BaseProducts';
import ListProducts from '@/pages/products/ListProducts';
import ViewProduct from "@/pages/products/ViewProduct";
import EditProduct from "@/pages/products/EditProduct";
import CreateProduct from "@/pages/products/CreateProduct";
//Recipes
import BaseRecipes from '@/pages/recipes/BaseRecipes';
import ListRecipes from '@/pages/recipes/ListRecipes';
import ViewRecipe from "@/pages/recipes/ViewRecipe";
import EditRecipe from "@/pages/recipes/EditRecipe";
import CreateRecipe from "@/pages/recipes/CreateRecipe";
//Banners
import EditBanner from "./pages/cover_banner/EditBanner";
import BaseBanner from "./pages/cover_banner/BaseBanner";
//Orders
import BaseOrders from '@/pages/orders/BaseOrders';
import ListOrders from '@/pages/orders/ListOrders';
import ViewOrder from "@/pages/orders/ViewOrder";
import EditOrder from "@/pages/orders/EditOrder";
import CreateOrder from "@/pages/orders/CreateOrder";
import Login from "./components/login/Login";

const Routing = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BaseLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="login" element={<Login />} />
                    <Route path="products" element={<BaseProducts />}>
                        <Route index element={<ListProducts />} />
                        <Route path="view/:productId" element={<ViewProduct />} />
                        <Route path="edit/:productId" element={<EditProduct />} />
                        <Route path="create" element={<CreateProduct />} />
                    </Route>
                    <Route path="recipes" element={<BaseRecipes />}>
                        <Route index element={<ListRecipes />} />
                        <Route path="view/:recipeId" element={<ViewRecipe />} />
                        <Route path="edit/:recipeId" element={<EditRecipe />} />
                        <Route path="create" element={<CreateRecipe />} />
                    </Route>
                    <Route path="orders" element={<BaseOrders />}>
                        <Route index element={<ListOrders />} />
                        <Route path="view/:orderId" element={<ViewOrder />} />
                        <Route path="edit/:orderId" element={<EditOrder />} />
                        <Route path="create" element={<CreateOrder />} />
                    </Route>
                    <Route path="cover_banner" element={<BaseBanner />}>
                        <Route index element={<EditBanner />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>

    );
};

export default Routing;