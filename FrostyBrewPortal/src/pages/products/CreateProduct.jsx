import { useState } from 'react';
import { db, productsStorageRef } from '@/config/FirebaseDb';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CreateProduct = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [productType, setProductType] = useState('');
    const [inStock, setInStock] = useState('yes');
    const [productImage, setProductImage] = useState('');
    const [formValidated, setFormValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setFormValidated(true);

        //Upload image
        const productImageRef = ref(productsStorageRef, productType + "/" + productImage.name);
        uploadBytes(productImageRef, productImage).then((snapshot) => {
            console.log('Uploaded a blob or file!');

            getDownloadURL(productImageRef).then(async (downloadURL) => {
                console.log('File available at', downloadURL);

                const product = { name, description, price: Number(price), type: productType, in_stock: inStock, image: downloadURL };
                await setDoc(doc(db, "products", name), product)
                    .then(function () {
                        console.log("Product created");
                    });
            });

        });
        // Add a new document in collection "products"

    };

    const onFileChange = (e) => {
        setProductImage(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    return (
        <Container>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col><h1>Create Product</h1></Col>
                <Col sm="1" lg="2"></Col>
            </Row>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col>
                    <Form validated={formValidated} onSubmit={handleSubmit}>
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
                                <option value="COLLECTABLE">Collectables</option>
                                <option value="BEER">Beer</option>
                                <option value="EXTRA">Extra</option>
                                <option value="LIQUOR">Liquor</option>
                                <option value="RENTAL">Rental</option>
                                <option value="SNACK">Snack</option>
                                <option value="WINE">Wine</option>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Product Image</Form.Label>
                                <Form.Control type="file" onChange={onFileChange} required />
                            </Form.Group>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col sm="1" lg="2"></Col>
            </Row>
        </Container>
    );
};

export default CreateProduct;