import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/config/SupaBaseDb';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '@/components/Loader';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Container fluid>
            <Form class="form-signin">
                <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
                <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                <Form.Label for="inputEmail" class="sr-only">Email address</Form.Label>
                <Form.Control type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus />
                <Form.Label for="inputPassword" class="sr-only">Password</Form.Label>
                <Form.Control type="password" id="Form.ControlPassword" class="form-control" placeholder="Password" required />
                <div class="checkbox mb-3">
                    <Form.Label>
                        <Form.Control type="checkbox" value="remember-me" /> Remember me
                    </Form.Label>
                </div>
                <Button hidden={isLoading} class="btn btn-lg btn-primary btn-block" type="submit">Sign in</Button>
                <Button hidden={!isLoading} class="btn btn-lg btn-primary btn-block"><Loader /></Button>
                <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
            </Form>
        </Container>
    );
};

export default Login;