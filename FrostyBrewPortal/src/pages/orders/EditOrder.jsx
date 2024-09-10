//React Libraries
import { useState, useEffect } from 'react';
import { db, productsStorageRef } from '@/config/FirebaseDb';
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
    const { productName } = useParams();

    const getData = async () => {
        setIsLoading(true);
        console.log(JSON.stringify(productName));
        const docRef = doc(db, "products", productName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setDescription(docSnap.data().description)
            setPrice(docSnap.data().price)
            setProductType(docSnap.data().type)
            setInStock(docSnap.data().in_stock)
            setProductImage(docSnap.data().image)
            setName(docSnap.data().name)

        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getData();
        return () => { };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setFormValidated(true);
        setIsLoading(true);

        //Upload image
        if (hasNewImage) {
            const productImageRef = ref(productsStorageRef, productType + "/" + productImage.name);
            uploadString(productImageRef, productImage.img, 'data_url').then((snapshot) => {
                console.log('Uploaded a data_url string!');
                console.log(JSON.stringify(productImageRef.toString()));

                getDownloadURL(productImageRef).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);

                    const product = {
                        name,
                        description,
                        price: Number(price),
                        type: productType,
                        in_stock: inStock,
                        image: downloadURL,
                    };

                    const productRef = doc(db, "products", name);
                    updateDoc(productRef, product)
                        .then(function () {
                            console.log("Product updated");
                            Swal.fire({
                                title: 'Product Updated',
                                icon: 'success',
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setIsLoading(false);
                        });
                });

            });

        } else {
            const product = {
                name,
                description,
                price: Number(price),
                type: productType,
                in_stock: inStock,
                image: productImage,
            };

            const productRef = doc(db, "products", name);
            updateDoc(productRef, product)
                .then(function () {
                    console.log("Product updated");
                    Swal.fire({
                        title: 'Product Updated',
                        icon: 'success',
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setIsLoading(false);
                });
        }

        // Add a new document in collection "products"

    };

    const onFileChange = async (e) => {
        //console.log(e.target.files[0]);

        const result = await openEditor({ src: e.target.files[0] });

        let img = {
            name: e.target.files[0].name,
            img: result.editedImage.getDataURL(),
        };
        //console.log(result.editedImage.getDataURL());
        setProductImage(img);
        setHasNewImage(true);
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
        // setName(docSnap.data().name)
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
                                <option value="SNACK">Snack</option>
                                <option value="EXTRA">Extra</option>
                                <option value="COLLECTABLE">Collectables</option>
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
                            <Button variant="danger" className='ls-button' onClick={onClear}>
                                clear
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