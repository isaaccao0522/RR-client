
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast } from 'react-toastify';

//Bootstrap
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

//Components

//Functions
import { Store } from '../Store';
import { getError } from '../utils';


export const SignupScreen = () => {
  const url = "https://rr-server.adaptable.app";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { userInfo } = state;

  const { search } = useLocation ();
  const redirectInUrl = new URLSearchParams ( search).get ( 'redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const navigate = useNavigate ();

  const [ name, setName] = useState ('');
  const [ email, setEmail] = useState ('');
  const [ phone, setPhone] = useState ('');
  const [ password, setPassword] = useState ('');
  const [ confirmPassword, setConfirmPassword] = useState ('');

  const submitHandler = async ( e) => {
    e.preventDefault ();
    if ( phone.length < 10) {
      toast.error ( "Phone: please enter your phone number !!!");
      return;
    }
    if ( password.length < 6 ) {
      toast.error ( "Password: please fill out letters or numbers more than 6 charactors.")
      return;
    }
    if ( password !== confirmPassword) {
      toast.error ( 'Passwords do not match !!!');
      return;
    }
    try {
      const { data } = await Axios.post ( `${ url}/api/users/signup`, {
        name,
        email,
        phone,
        password,
      });
      ctxDispatch ({ 
        type: 'USER_SIGNIN', 
        payload: data 
      });
      localStorage.setItem  ( 'userInfo', JSON.stringify ( data));
      navigate ( redirect || '/');
    } catch ( error) {
      toast.error ( getError ( error));
    }
  };

  useEffect ( () => {
    if ( userInfo) {
      navigate ( redirect);
    }
  }, [  navigate, redirect, userInfo]);


  const [ validated, setValidated] = useState(false);

  const handleSubmit = ( event) => {
    const form = event.currentTarget;
    if ( form.checkValidity () === false) {
      event.preventDefault ();
      event.stopPropagation ();
    }
    setValidated ( true);
  };


  return (
    <Container className="small-container">

      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <h2 className="my-3 text-center">
        Sign Up
      </h2>

      <Row md={ 2} className="justify-content-center">
        <Form 
          onSubmit={ submitHandler}>

          {/* Name */}
          <Form.Group lg={2} className="mb-3"
            controlId="name"
            >
            <Form.Label className="fs-5 mb-">
                Name
            </Form.Label>
            <Form.Control xs={ 3}
                type="text"
                placeholder="Derek"
                minlength="2"
                onChange={ ( e) => setName ( e.target.value)} 
                required="required"
            />
          </Form.Group>


          {/* Email */}
          <Form.Group className="mb-3"
            controlId="email"
          >
            <Form.Label className="fs-5">
              Email
            </Form.Label>
            <Form.Control type="email"
              placeholder="burgers@gmail.com"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              onChange={ ( e) => setEmail( e.target.value)}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label className="d-flex fs-5">
              Phone
            </Form.Label>
            <Form.Control type="phone"
              placeholder="09xx-xxxxx"
              pattern="09\d{2}-\d{6}"
              maxlength="11"
              onChange={ ( e) => setPhone ( e.target.value)}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fs-5">
              Password
            </Form.Label>
            <Form.Control type="password"
              placeholder="More than 6 letters or numbers."
              pattern="^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$" 
              onChange={ ( e) => setPassword ( e.target.value)}
              required="required"
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3" 
              controlId="confirmPassword"
            >
              <Form.Label className="fs-5">
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                onChange={ ( e) => setConfirmPassword ( e.target.value)}
                required
              />
          </Form.Group>

          <Row className="justify-content-between">
            <Col className="mb-3" 
              xs="4" md="4" lg="3">
              <Button type="submit"
                variant="warning text-white">
                Create account
              </Button>
            </Col>

            <Col className="mb-3" 
              xs="3" md="3" lg="2">
              <Button type="button"
                variant="outline-warning">
                Back
              </Button>
            </Col>
          </Row>
          <div className="mb-3 fs-5">
            Already have an account?{' '}
            <Link to={`/signin?redirect=${redirect}`}
              className="ms-2 text-info"
              style={{ textDecoration:"none"}}
            >
              Login
            </Link>
          </div>
        </Form>
      </Row>

    </Container>
  );
};


export default SignupScreen;