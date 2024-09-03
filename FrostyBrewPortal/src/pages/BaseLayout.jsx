import { Outlet } from "react-router-dom";
import Header from '@/components/Header'
import SideBar from '@/components/SideBar'
import '@/assets/styles/Dashboard.css';
import { Col, Container, Row } from "react-bootstrap";
//import { Form } from "react-bootstrap";

const BaseLayout = () => {
    return <>
        <Header />
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 d-none d-md-block bg-light sidebar">
                    <SideBar />
                </div>
                <div role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                    <Outlet />
                </div>
            </div>
        </div>
    </>;
};

export default BaseLayout;