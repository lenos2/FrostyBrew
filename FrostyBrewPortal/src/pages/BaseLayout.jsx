import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { supabase } from '@/config/SupaBaseDb';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import Header from '@/components/Header'
import SideBar from '@/components/SideBar'
import '@/assets/styles/Dashboard.css';
import { Col, Container, Row } from "react-bootstrap";
//import { Form } from "react-bootstrap";

const BaseLayout = () => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, []);

    if (!session) {
        <>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 d-none d-md-block bg-light sidebar">
                        <SideBar />
                    </div>
                    <div role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
                    </div>
                </div>
            </div>
        </>
        return
    } else {
        console.log("Logged in");
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
    }
};

export default BaseLayout;