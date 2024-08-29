import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from "react";
import { db } from '@/config/FirebaseDb';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SweetAlert2 from 'react-sweetalert2';

const ListRecipes = () => {
    const [loading, setLoading] = useState(true);
    const [products, setPosts] = useState([]);
    const [swalProps, setSwalProps] = useState({});

    const getData = async () => {
        const products = collection(db, 'recipes');
        const productsSS = await getDocs(products);
        const getPostsFromFb = productsSS.docs.map(doc => doc.data());
        console.log("Recipes", getPostsFromFb)
        setPosts(getPostsFromFb);
        setLoading(false);
    }

    useEffect(() => {
        getData();
        return () => { };
    }, []);

    const deleteRecipe = async (recipeId) => {
        await deleteDoc(doc(db, "recipes", recipeId))
            .then((snapshot) => {
                console.log("Record Deleted");
                Swal.fire({
                    title: 'Recipe Deleted',
                    icon: 'success',
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500
                })
                getData();
            }).catch((err) => {
                console.log("Failed to delete", err);
                Swal.fire({
                    title: 'Failed to delete Recipe',
                    icon: 'error',
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500
                })
            });
    }

    if (loading) {
        return (
            <div>Firebase is still loading...</div>
        )
    } else {
        return (
            <Container>
                <Row>
                    <Col sm="1" lg="2"></Col>
                    <Col><h1>Recipes</h1></Col>
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
                                    <th>Complexity</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.length > 0 ? (
                                        products.map((product) => {
                                            return (
                                                <tr key={product.name}>
                                                    <td><img src={product.image} style={{ width: '50px', height: '50px', 'objectFit': 'contain' }} /></td>
                                                    <td>{product.name}</td>
                                                    <td>{product.complexity}</td>
                                                    <td>{product.type}</td>
                                                    <td>
                                                        <span className="btn btn-primary ls-btn" >View</span>
                                                        <span className="btn btn-warning ls-btn" >Edit</span>
                                                        <span className="btn btn-danger ls-btn" onClick={() => deleteRecipe(product.name)}>Delete</span></td>
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
export default ListRecipes;