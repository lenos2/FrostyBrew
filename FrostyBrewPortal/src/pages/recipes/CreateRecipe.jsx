import { useState, useRef, useEffect } from 'react';
import { db, recipesStorageRef } from '@/config/FirebaseDb';
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
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

const CreateRecipe = () => {

    const [recipeName, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [recipeType, setRecipeType] = useState('');
    const [complexity, setComplexity] = useState('');
    const [instructions, setInstructions] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [formValidated, setFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

        var name = recipeName.trim();
        //Upload image
        const recipeImageRef = ref(recipesStorageRef, recipeType + "/" + recipeImage.name);
        uploadString(recipeImageRef, recipeImage.img, 'data_url').then((snapshot) => {
            console.log('Uploaded a data_url string!');

            getDownloadURL(recipeImageRef).then(async (downloadURL) => {
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

                await setDoc(doc(db, "recipes", name), recipe)
                    .then(function () {
                        console.log("Recipe created");
                        Swal.fire({
                            title: 'Recipe Added',
                            icon: 'success',
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setIsLoading(false);
                    }).catch((err) => {
                        console.log("Failed to save", err.toString());
                        Swal.fire({
                            title: 'Failed to save' + err.toString(),
                            icon: 'danger',
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setIsLoading(false);
                    });
            });
        });
    };

    const onFileChange = async (e) => {
        const result = await openEditor({ src: e.target.files[0] });

        let img = {
            name: e.target.files[0].name,
            img: result.editedImage.getDataURL(),
        };
        //console.log(result.editedImage.getDataURL());
        setRecipeImage(img);
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
                                <img src={recipeImage.img} style={{ maxHeight: '250px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3">

                                <Form.Label>Upload Recipe Image</Form.Label>

                                <Form.Control type="file" onChange={onFileChange} required />

                            </Form.Group>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter recipe name" required
                                value={recipeName} onChange={(e) => setName(e.target.value)} />
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
                                Submit
                            </Button>
                            <Button hidden={!isLoading} variant="primary" className='ls-button'>
                                <Loader />
                            </Button>
                            <Button variant="danger" type="submit" className='ls-button' onClick={onClear}>
                                clear
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col sm="1" lg="2"></Col>
            </Row>
        </Container>
    );
};

export default CreateRecipe;