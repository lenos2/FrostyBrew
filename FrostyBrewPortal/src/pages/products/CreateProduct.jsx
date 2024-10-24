import { useState } from 'react';
import { supabase } from '@/config/SupaBaseDb';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import { openEditor } from "react-profile";
import Swal from 'sweetalert2';
import Loader from '@/components/Loader';
import { decode } from 'base64-arraybuffer';
import { imageFormatter } from '@/helpers/formatters';

const CreateProduct = () => {

    const [productName, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [productType, setProductType] = useState('');
    const [inStock, setInStock] = useState('yes');
    const [productImage, setProductImage] = useState({});
    const [formValidated, setFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setFormValidated(true);
        setIsLoading(true);

        //Upload image

        supabase.auth.getSession().then(({ data: { session } }) => {
            //setSession(session);
            console.log("Session", session);
        })

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
        console.log("Image Uploaded", data);

        const product = {
            name: productName.trim(),
            description,
            price: Number(price),
            type: productType,
            in_stock: inStock,
            image: data.path,
        };


        //Upload product
        var { data, error } = await supabase.from('products').insert(product);
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

        console.log("Product created");
        Swal.fire({
            title: 'Product Added',
            icon: 'success',
            position: "top-end",
            showConfirmButton: false,
            timer: 1500
        })
        //Navigate to the View page of the product

    };

    const onFileChange = async (e) => {
        //console.log(e.target.files[0]);

        // const result = await openEditor({ src: e.target.files[0] });

        // var dataURL = result.editedImage.getDataURL();
        // let img = {
        //     name: e.target.files[0].name,
        //     type: e.target.files[0].type,
        //     img: dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        // };
        var img = await imageFormatter(e);
        setProductImage(img);
    }


    const onClear = () => {
        //Clear all the fields
        setName("")
        setDescription("")
        setPrice("")
        setProductType("")
        setInStock("")
        setProductImage("")
        setFormValidated("")
        setName("")
    }

    return (
        <Container>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col>
                    <Form validated={formValidated} onSubmit={handleSubmit}>


                        <Form.Group className="mb-3">
                            <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                                <img src={productImage.img} style={{ maxHeight: '250px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3">

                                <Form.Label>Upload Product Image</Form.Label>

                                <Form.Control type="file" onChange={onFileChange} required />

                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" required
                                value={productName} onChange={(e) => setName(e.target.value)} />
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
                                Save
                            </Button>
                            <Button hidden={!isLoading} variant="primary" className='ls-button'>
                                <Loader />
                            </Button>
                            <Button variant="danger" className='ls-button' onClick={onClear}>
                                Clear
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col sm="1" lg="2"></Col>
            </Row>
        </Container>
    );
};

export default CreateProduct;