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
import { openEditor } from "react-profile";
import Swal from 'sweetalert2'
import Loader from '@/components/Loader';
import { decode } from 'base64-arraybuffer';
import { imageFormatter } from '@/helpers/formatters';

const EditProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [productType, setProductType] = useState('');
    const [inStock, setInStock] = useState('yes');
    const [productImage, setProductImage] = useState('');
    const [hasNewImage, setHasNewImage] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { productId } = useParams();

    const getData = async () => {
        setIsLoading(true);
        console.log(JSON.stringify([productId]));

        const { data, error } = await supabase
            .from('products')
            .select().eq("id", productId).limit(1).single();

        if (error) {
            console.log("No such document!");
            return;
        }

        console.log("Document data:", data);
        setDescription(data.description)
        setPrice(data.price)
        setProductType(data.type)
        setInStock(data.in_stock)
        var res = supabase.storage.from("recipes").getPublicUrl(data.image);
        setProductImage(res.data.publicUrl)
        setName(data.name)

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
        return () => { };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setFormValidated(true);
        setIsLoading(true);

        //Upload image
        if (hasNewImage) {

            //Upload image
            var { data, error } = await supabase
                .storage
                .from('products')
                .upload("products/" + productType + "/" + productImage.name, decode(productImage.img), {
                    contentType: productImage.type,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.log("Failed to upload image", error);
                Swal.fire({
                    title: 'Failed to save' + error.toString(),
                    icon: 'danger',
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500
                });
                setIsLoading(false);
                return;
            }

            setProductImage(data.path);
            setHasNewImage(false)
        }

        var name = productName.trim();
        const product = {
            name,
            description,
            price: Number(price),
            type: productType,
            in_stock: inStock,
            image: productImage,
        };

        //Upload product
        var { data, error } = await supabase.from('products').update(product).eq("id", productId);
        setIsLoading(false);
        if (error) {
            console.log("Failed to save", error.toString());
            Swal.fire({
                title: 'Failed to save' + error.toString(),
                icon: 'danger',
                position: "top-end",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        //Navigate to the View page of the product

        console.log("Product updated");
        Swal.fire({
            title: 'Product Updated',
            icon: 'success',
            position: "top-end",
            showConfirmButton: false,
            timer: 1500
        })
        setIsLoading(false);

    };

    const onFileChange = async (e) => {
        var img = await imageFormatter(e);
        setProductImage(img);
        setHasNewImage(true);
    }

    return (
        <Container>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col>
                    <Form validated={formValidated} onSubmit={handleSubmit}>


                        <Form.Group className="mb-3">
                            <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                                <img hidden={hasNewImage} src={productImage} style={{ maxHeight: '250px' }} />
                                <img hidden={!hasNewImage} src={productImage.img} style={{ maxHeight: '250px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3">

                                <Form.Label>Upload Product Image</Form.Label>

                                <Form.Control type="file" onChange={onFileChange} />

                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" required
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter product description" required
                                value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter product price" required
                                value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select aria-label="Select product type" required
                                value={productType} onChange={(e) => setProductType(e.target.value)}>
                                <option value="">Select Product Type</option>
                                <option value="BEER">Beer</option>
                                <option value="CIDER">Cider</option>
                                <option value="LIQUOR">Liquor</option>
                                <option value="WHISKEY">Whiskey</option>
                                <option value="RUM">Rum</option>
                                <option value="VODKA">Vodka</option>
                                <option value="GIN">Gin</option>
                                <option value="WINE">Wine</option>
                                <option value="SNACK">Snacks</option>
                                <option value="SOFT_DRINK">Soft Drink</option>
                                <option value="MIXER">Mixer</option>
                                <option value="PLATTER">Platter</option>
                                <option value="COLLECTABLE">Collectable</option>
                                <option value="RENTAL">Rental</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>In Stock</Form.Label>
                            <Form.Select aria-label="Is product in stock" required
                                value={inStock} onChange={(e) => setInStock(e.target.value)}>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                            <Button hidden={isLoading} variant="primary" type="submit" className='ls-button'>
                                Update
                            </Button>
                            <Button hidden={!isLoading} variant="primary" className='ls-button'>
                                <Loader />
                            </Button>
                            <Button variant="danger" className='ls-button' onClick={getData}>
                                Reset
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col sm="1" lg="2"></Col>
            </Row>
        </Container>
    );
}
export default EditProduct;