//React Libraries
import { useState, useRef, useEffect } from 'react';
import { db, recipesStorageRef } from '@/config/FirebaseDb';
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
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
    const [formValidated, setFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { recipeName } = useParams();
    const [fieldDisabled, setFieldDisabled] = useState(true);

    const getData = async () => {
        const docRef = doc(db, "recipes", recipeName);
        const docSnap = await getDoc(docRef);
        setIsLoading(true);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
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

    return (
        <Container>
            <Row>
                <Col sm="1" lg="2"></Col>
                <Col>
                    <Form validated={formValidated}>

                        <Form.Group className="mb-3">
                            <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                                <img src={recipeImage} style={{ maxHeight: '250px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3">

                                <Form.Label>Upload Recipe Image</Form.Label>

                                <Form.Control type="file" required disabled={fieldDisabled} />

                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter recipe name" required
                                value={name} onChange={(e) => setName(e.target.value)} disabled={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter recipe description" required
                        value={description} onChange={(e) => setDescription(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={description} onChange={setDescription} readOnly={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter ingredients" required
                        value={ingredients} onChange={(e) => setIngredients(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={ingredients} onChange={setIngredients} readOnly={fieldDisabled} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
                            {/* <Form.Control type="text" placeholder="Enter Instructions" required
                        value={instructions} onChange={(e) => setInstructions(e.target.value)} /> */}
                            <ReactQuill theme="snow" value={instructions} onChange={setInstructions} readOnly={fieldDisabled} />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select aria-label="Select recipe type" required
                                        value={recipeType} onChange={(e) => setRecipeType(e.target.value)} disabled={fieldDisabled}>
                                        <option value="">Select Recipe Type</option>
                                        <option id="COCKTAIL" value="COCKTAIL">Cocktail</option>
                                        <option id="SHOOTER" value="SHOOTER">Shooter</option>
                                        <option id="MOCKTAIL" value="MOCKTAIL">Mocktail</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Complexity</Form.Label>
                                    <Form.Select aria-label="How hard is it to make this drink" required
                                        value={complexity} onChange={(e) => setComplexity(e.target.value)} disabled={fieldDisabled}>
                                        <option value="">Please Select Rating</option>
                                        <option id="SUPER_EASY" value="SUPER_EASY">Super Easy - 1 Star</option>
                                        <option id="EASY" value="EASY">Easy - 2 Stars</option>
                                        <option id="MEDIUM" value="MEDIUM">Medium - 3 Stars</option>
                                        <option id="HARD" value="HARD">Hard - 4 Stars</option>
                                        <option id="SUPER_HARD" value="SUPER_HARD">Super Hard - 5 Stars</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" style={{ textAlign: 'center' }}>

                            <Link to={"/recipes/edit/" + recipeName} className={'nav-link'}>
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
export default ViewRecipe;