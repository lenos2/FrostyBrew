//React Libraries
import { useState, useEffect } from 'react';
import { supabase } from '@/config/SupaBaseDb';

import { Routes, Route, useParams, Link } from 'react-router-dom';

//Styling
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '@/components/Loader';


const ViewProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [productType, setProductType] = useState('');
    const [inStock, setInStock] = useState('yes');
    const [productImage, setProductImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { productId } = useParams();
    const [fieldDisabled, setFieldDisabled] = useState(true);

    const getData = async () => {
        setIsLoading(true);
        console.log(JSON.stringify(productId));
        var { data, error } = await supabase
            .from('products')
            .select().eq("id", productId).limit(1).single();
        // supabase
        //     .from('products')
        //     .select().eq("id", productId).limit(1).single().then((response) => {
        //         console.log("Data test Leo", response.data);
        //         console.log("Data test Leo 2", response.error);
        //     })

        if (error) {
            console.log("No such document!");
            return;
        }
        console.log("Document data:", data);
        setDescription(data.description)
        setPrice(data.price)
        setProductType(data.type)
        setInStock(data.in_stock)
        setName(data.name)
        var res = supabase.storage.from("products").getPublicUrl(data.image);
        setProductImage(res.data.publicUrl)
        console.log("Image link", res.data.publicUrl)

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
        return () => { };
    }, []);


    return (
        <Container>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                                <img src={productImage} style={{ maxHeight: '250px' }} />
                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" required
                                value={name} onChange={(e) => setName(e.target.value)} disabled={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter product description" required
                                value={description} onChange={(e) => setDescription(e.target.value)} disabled={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter product price" required
                                value={price} onChange={(e) => setPrice(e.target.value)} disabled={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select aria-label="Select product type" required
                                value={productType} onChange={(e) => setProductType(e.target.value)} disabled={fieldDisabled}>
                                <option value="">Select Product Type</option>
                                <option value="BEER">Beer</option>
                                <option value="CIDER">Cider</option>
                                <option value="LIQUOR">Liquor</option>
                                <option value="WHISKEY">Whiskey</option>
                                <option value="RUM">Rum</option>
                                <option value="VODKA">Vodka</option>
                                <option value="GIN">Gin</option>
                                <option value="WINE">Wine</option>
                                <option value="SNACK">Snack</option>
                                <option value="EXTRA">Extra</option>
                                <option value="COLLECTABLE">Collectables</option>
                                <option value="RENTAL">Rental</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>In Stock</Form.Label>
                            <Form.Select aria-label="Is product in stock" required disabled={fieldDisabled}
                                value={inStock} onChange={(e) => setInStock(e.target.value)}>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" style={{ textAlign: 'center' }}>

                            <Link to={"/products/edit/" + productId} className={'nav-link'}>
                                <Button variant="warning" type="submit" className='ls-button'>
                                    Edit
                                </Button>
                            </Link>

                        </Form.Group>
                    </Form>
                </Col>
                <Col sm="1" lg="2"></Col>
            </Row>
        </Container>
    );
}
export default ViewProduct;