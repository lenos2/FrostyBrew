import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';

const BaseProducts = () => {
    const [pageTitle, setPageTitle] = useState("Products");

    return (
        <Container>
            <div class="mb-4 bg-body-tertiary rounded-3">
                <div class="container-fluid py-5 px-5">
                    <h1 class="display-5 fw-bold">{pageTitle}</h1>
                </div>
            </div>

            <div class=" h-100 py-2 bg-body-tertiary border rounded-3">
                <Outlet />
            </div>

        </Container>
    );
}

export default BaseProducts;