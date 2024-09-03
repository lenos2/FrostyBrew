import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from "react";
import { db } from '@/config/FirebaseDb';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'
import Loader from '@/components/Loader';
import { Link } from "react-router-dom";

const ListRecipes = () => {
    const [loading, setLoading] = useState(true);
    const [products, setPosts] = useState([]);
    const [swalProps, setSwalProps] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);

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
        setIsDeleting(true);
        await deleteDoc(doc(db, "recipes", recipeId))
            .then((snapshot) => {
                // Delete the file
                deleteObject(ref(imageRef)).then(() => {
                    // File deleted successfully
                    console.log("Image deleted");
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log("Failed to delete Image");
                });

                console.log("Record Deleted");
                Swal.fire({
                    title: 'Recipe Deleted',
                    icon: 'success',
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500
                })
                getData();
                setIsDeleting(false);
            }).catch((err) => {
                console.log("Failed to delete", err);
                Swal.fire({
                    title: 'Failed to delete Recipe',
                    icon: 'error',
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsDeleting(false);
            });
    }

    if (loading) {
        return (
            <div className='ls-full-page-loader'>
                <Loader />
                <h1>Recipes loading...</h1>
            </div>
        )
    } else {
        return (
            <Container>
                <Row>
                    <Col><Link to="/recipes/create" className='nav-link'>
                        <span data-feather="shopping-cart"></span>
                        <Button className='btn btn-primary btn-lg'>Create Recipe</Button>
                    </Link>
                    </Col>
                </Row>
                <Row>
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
                                                        <span hidden={isDeleting} className="btn btn-danger ls-btn" onClick={() => deleteRecipe(product.name, product.imageRef)}>Delete</span>
                                                        <span hidden={!isDeleting} className="btn btn-danger ls-btn"><Loader /></span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : <div>no products</div>
                                }
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            </Container>

        );
    }
}
export default ListRecipes;