import React, { useEffect, useState } from "react";
import { Routes, Route, useParams, Link } from 'react-router-dom';
import { supabase } from '@/config/SupaBaseDb';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'
import Loader from '@/components/Loader';

const ListProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setPosts] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const getData = async () => {
        const { data } = await supabase.from("products").select();
        console.log(data);
        //const getPostsFromFb = productsSS.docs.map(doc => doc.data());
        setPosts(data);
        setLoading(false);
    }

    useEffect(() => {
        getData();
        return () => { };
    }, []);

    const deleteProduct = async (productId, imageUrl) => {
        setIsDeleting(true);
        await deleteDoc(doc(db, "products", productId))
            .then((snapshot) => {

                // Delete the file
                const httpsReference = ref(firebaseStorage, imageUrl); // this url is coming from getDownloadURL()
                // Then you do whatever you want with the ref, 🍿 like remove files:
                deleteObject(httpsReference).then(() => {
                    // File deleted successfully
                    console.log("Image deleted");
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log("Failed to delete Image");
                });

                // Delete the file
                // deleteObject(refFromURL(image)).then(() => {
                //     // File deleted successfully
                //     console.log("Image deleted2");
                // }).catch((error) => {
                //     // Uh-oh, an error occurred!
                //     console.log("Failed to delete Image");
                // });

                console.log("Record Deleted");
                Swal.fire({
                    title: 'Product Deleted',
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
                <h1>Products loading...</h1>
            </div>
        )
    } else {
        return (
            <Container>

                <Row>
                    <Col><Link to="/products/create" className='nav-link'>
                        <span data-feather="shopping-cart"></span>
                        <Button className='btn btn-primary btn-lg'>Create Product</Button>
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
                                                <tr key={product.id}>
                                                    <td><img src={product.image} style={{ width: '50px', height: '50px', 'objectFit': 'contain' }} /></td>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.in_stock}</td>
                                                    <td>${product.price}</td>
                                                    <td>{product.type}</td>
                                                    <td>

                                                        <Link to={"view/" + product.id} className={'nav-link'}>
                                                            <span className="btn btn-primary ls-btn" >View</span>
                                                        </Link>
                                                        <Link to={"edit/" + product.id} className={'nav-link'}>
                                                            <span className="btn btn-warning ls-btn" >Edit</span>
                                                        </Link>
                                                        <span hidden={isDeleting} className="btn btn-danger ls-btn" onClick={() => deleteProduct(product.name, product.image)}>Delete</span>
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
export default ListProducts;