import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BaseRecipes = () => {
    return (
        <Container>
            <Row style={{ minHeight: '300px' }}>
                <Col sm="1" lg="2"></Col>
                <Col className="align-middle"><h1>Create Recipe</h1></Col>
                <Col sm="1" lg="2"></Col>
            </Row>
            <Outlet />
        </Container>
    );
}

export default BaseRecipes;