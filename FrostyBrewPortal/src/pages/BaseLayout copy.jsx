import { Outlet } from "react-router-dom";
import Navbar from '@/components/NavBar'

const BaseLayout = () => {
    return <>
        <Navbar />
        <Outlet />
    </>;
};

export default BaseLayout;