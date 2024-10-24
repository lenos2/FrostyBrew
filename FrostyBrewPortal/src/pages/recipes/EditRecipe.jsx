//React Libraries
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/config/SupaBaseDb';
import { Routes, Route, useParams, Link } from 'react-router-dom';

//Styling
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "react-profile/themes/default.min.css";
import { openEditor } from "react-profile";
import Swal from 'sweetalert2'
import Loader from '@/components/Loader';
import { decode } from 'base64-arraybuffer';
import { imageFormatter } from '@/helpers/formatters';

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
    const { recipeId } = useParams();

    const getData = async () => {
        setIsLoading(true);

        var { data, error } = await supabase
            .from('recipes')
            .select().eq("id", recipeId).limit(1).single();

        if (error) {
            console.log("No such document!");
            return;
        }

        console.log("Document data:", data);
        setDescription(data.description)
        setIngredients(data.ingredients)
        setRecipeType(data.type)
        setComplexity(data.complexity)
        setInstructions(data.instructions)
        setName(data.name)
        var res = supabase.storage.from("recipes").getPublicUrl(data.image);
        setRecipeImage(res.data.publicUrl)

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

            //Upload image
            var { data, error } = await supabase
                .storage
                .from('recipes')
                .upload('recipes/' + recipeType + "/" + recipeImage.name, decode(recipeImage.img), {
                    contentType: recipeImage.type,
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

            setRecipeImage(data.path);
            setHasNewImage(false)
        }


        const recipe = {
            name: productName.trim(),
            description,
            ingredients,
            complexity,
            type: recipeType,
            instructions,
            image: recipeImage,
        };

        //Upload recipe
        var { data, error } = await supabase.from('recipes').update(recipe).eq("id", recipeId);
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

        console.log("Recipe updated");
        Swal.fire({
            title: 'Recipe Updated',
            icon: 'success',
            position: "top-end",
            showConfirmButton: false,
            timer: 1500
        })
        setIsLoading(false);

    };

    const onFileChange = async (e) => {
        var img = await imageFormatter(e);
        setRecipeImage(img);
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
                            <Form.Control type="text" placeholder="Enter recipe name" required
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <ReactQuill theme="snow" value={description} onChange={setDescription} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            <ReactQuill theme="snow" value={ingredients} onChange={setIngredients} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
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
export default ViewRecipe;