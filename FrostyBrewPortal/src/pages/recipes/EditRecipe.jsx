//React Libraries
import { useState, useRef, useEffect } from 'react';
import { db, recipesStorageRef } from '@/config/FirebaseDb';
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Routes, Route, useParams, Link } from 'react-router-dom';

//Styling
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactProfile from "react-profile";
import "react-profile/themes/default.min.css";
import { openEditor } from "react-profile";
import Swal from 'sweetalert2'
import Loader from '@/components/Loader';


const ViewRecipe = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [recipeType, setRecipeType] = useState('');
    const [complexity, setComplexity] = useState('');
    const [instructions, setInstructions] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [hasNewImage, setHasNewImage] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { recipeName } = useParams();

    const getData = async () => {
        setIsLoading(true);
        const docRef = doc(db, "recipes", recipeName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            setDescription(docSnap.data().description)
            setIngredients(docSnap.data().ingredients)
            setRecipeType(docSnap.data().type)
            setComplexity(docSnap.data().complexity)
            setInstructions(docSnap.data().instructions)
            setRecipeImage(docSnap.data().image)
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
            Swal.fire({
                title: 'Please Fill in all fields',
                icon: 'info',
                showConfirmButton: false,
                timer: 1500
            })
            e.stopPropagation();
        }
        setFormValidated(true);
        setIsLoading(true);
        //Upload image
        if (hasNewImage) {

            const recipeImageRef = ref(recipesStorageRef, recipeType + "/" + recipeImage.name);
            uploadString(recipeImageRef, recipeImage.img, 'data_url').then((snapshot) => {
                console.log('Uploaded a data_url string!');

                getDownloadURL(recipeImageRef).then((downloadURL) => {
                    console.log('File available at', downloadURL);

                    const recipe = {
                        name,
                        description,
                        ingredients,
                        complexity,
                        type: recipeType,
                        instructions,
                        image: downloadURL,
                    };

                    const recipeRef = doc(db, "recipes", name);
                    updateDoc(recipeRef, recipe)
                        .then(function () {
                            console.log("Recipe updated");
                            Swal.fire({
                                title: 'Recipe Updated',
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
            const recipe = {
                name,
                description,
                ingredients,
                complexity,
                type: recipeType,
                instructions,
                image: recipeImage,
            };

            const recipeRef = doc(db, "recipes", name);
            updateDoc(recipeRef, recipe)
                .then(function () {
                    console.log("Recipe updated");
                    Swal.fire({
                        title: 'Recipe Updated',
                        icon: 'success',
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setIsLoading(false);
                });
        }
    };

    const onFileChange = async (e) => {
        const result = await openEditor({ src: e.target.files[0] });

        let img = {
            name: e.target.files[0].name,
            img: result.editedImage.getDataURL(),
        };
        //console.log(result.editedImage.getDataURL());
        setRecipeImage(img);
        setHasNewImage(true);
    }

    const onClear = () => {
        //Clear all the fields
        setDescription("")
        setIngredients("")
        setRecipeType("")
        setComplexity("")
        setInstructions("")
        setRecipeImage("")
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
                                <img hidden={hasNewImage} src={recipeImage} style={{ maxHeight: '250px' }} />
                                <img hidden={!hasNewImage} src={recipeImage.img} style={{ maxHeight: '250px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Upload Recipe Image</Form.Label>
                                <Form.Control type="file" onChange={onFileChange} />
                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter recipe name" required disabled={true}
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter recipe description" required
                        value={description} onChange={(e) => setDescription(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={description} onChange={setDescription} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter ingredients" required
                        value={ingredients} onChange={(e) => setIngredients(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={ingredients} onChange={setIngredients} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter Instructions" required
                        value={instructions} onChange={(e) => setInstructions(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={instructions} onChange={setInstructions} />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select aria-label="Select recipe type" required
                                        value={recipeType} onChange={(e) => setRecipeType(e.target.value)}>
                                        <option value="">Select Recipe Type</option>
                                        <option value="COCKTAIL">Cocktail</option>
                                        <option value="SHOOTER">Shooter</option>
                                        <option value="MOCKTAIL">Mocktail</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Complexity</Form.Label>
                                    <Form.Select aria-label="How hard is it to make this drink" required
                                        value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                                        <option value="">Please Select Rating</option>
                                        <option value="SUPER_EASY">Super Easy - 1 Star</option>
                                        <option value="EASY">Easy - 2 Stars</option>
                                        <option value="MEDIUM">Medium - 3 Stars</option>
                                        <option value="HARD">Hard - 4 Stars</option>
                                        <option value="SUPER_HARD">Super Hard - 5 Stars</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
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
export default ViewRecipe;