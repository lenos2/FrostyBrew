import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BaseRecipes = () => {
    const [pageTitle, setPageTitle] = useState("Recipes");

    return (


        <Container>
            <div class="mb-4 bg-body-tertiary rounded-3">
                <div class="container-fluid py-5 px-5">
                    <h1 class="display-5 fw-bold">{pageTitle}</h1>
                </div>
            </div>

            <div class=" h-100 p-5 bg-body-tertiary border rounded-3">
                <Outlet />
            </div>

        </Container>
    );
}

export default BaseRecipes;