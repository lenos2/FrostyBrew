import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from '@/pages/BaseLayout';
import Dashboard from '@/pages/Dashboard';
import NoPage from '@/pages/NoPage';
import BaseProducts from '@/pages/products/BaseProducts';
import ListProducts from '@/pages/products/ListProducts';
import Product from "@/pages/products/Product";
import CreateProduct from "@/pages/products/CreateProduct";
import BaseRecipes from '@/pages/recipes/BaseRecipes';
import ListRecipes from '@/pages/recipes/ListRecipes';
import Recipe from "@/pages/recipes/Recipe";
import CreateRecipe from "@/pages/recipes/CreateRecipe";

const Routing = () => {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BaseLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<BaseProducts />}>
                        <Route index element={<ListProducts />} />
                        <Route path="view" element={<Product />} />
                        <Route path="create" element={<CreateProduct />} />
                    </Route>
                    <Route path="recipes" element={<BaseRecipes />}>
                        <Route index element={<ListRecipes />} />
                        <Route path="view" element={<Recipe />} />
                        <Route path="create" element={<CreateRecipe />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>

    );
};

export default Routing;