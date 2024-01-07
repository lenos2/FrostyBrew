import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from "react";
import { db } from '@/config/FirebaseDb';
import { collection, getDocs } from 'firebase/firestore';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const ListProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setPosts] = useState([]);

    useEffect(() => {
        async function getData() {
            const products = collection(db, 'products');
            const productsSS = await getDocs(products);
            const getPostsFromFb = productsSS.docs.map(doc => doc.data());
            setPosts(getPostsFromFb);
            setLoading(false);
        }
        getData();
        return () => { };
    }, []);

    if (loading) {
        return (
            <div>Firebase is still loading...</div>
        )
    } else {
        return (
            <Container>

                <Row>
                    <Col sm="1" lg="2"></Col>
                    <Col><h1>Products</h1></Col>
                    <Col sm="1" lg="2"></Col>
                </Row>

                <Row>
                    <Col sm="1" lg="2"></Col>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>In Stock</th>
                                    <th>Price</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.length > 0 ? (
                                        products.map((product) => {
                                            return (
                                                <tr key={product.key}>
                                                    <td><img src={product.image} style={{ width: '50px', height: '50px', 'objectFit': 'contain' }} /></td>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.in_stock}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.type}</td>
                                                    <td>View / Edit / Delete</td>
                                                </tr>
                                            );
                                        })
                                    ) : <div>no products</div>
                                }
                            </tbody>
                        </Table>

                    </Col>
                    <Col sm="1" lg="2"></Col>
                </Row>
            </Container>
        );
    }
}
export default ListProducts;