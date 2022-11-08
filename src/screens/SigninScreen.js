import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast } from 'react-toastify';


//Bootstrap
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Functions
import { getError } from '../utils';
import { Store } from '../Store';


export const SigninScreen = () => {
  const url = "https://qq-api.onrender.com";

  const { search } = useLocation ();
  const redirectInUrl = new URLSearchParams ( search).get ( 'redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [ email, setEmail] = useState ('');
  const [ password, setPassword] = useState ('');

  const submitHandler = async ( e) => {
    e.preventDefault ();
    try {
      const { data } = await Axios.post ( `${ url}/api/users/signin`, {
        email,
        password,
      });
      ctxDispatch ({ 
        type: 'USER_SIGNIN', 
        payload: data 
      });
      toast.success ( 'Signin Successfully')
      localStorage.setItem ( 'userInfo', JSON.stringify ( data));
      navigate ( redirect || '/');
     
    } catch ( error) {
      toast.error ( 
        getError ( error)
      );
    }
  };

  useEffect ( () => {
    if ( userInfo) {
      navigate ( redirect);
    }
  }, [ navigate, redirect, userInfo]);




  return (
    <Container className="small-container justify-content-between">
      <Helmet>
        <title>
          Sign In
        </title>
      </Helmet>

      <h2 className="my-3 text-center">
        Sign In
      </h2>

      {/* Sing-in */}
        <Row md={ 5} className="justify-content-center">
          <Col>
            <Form onSubmit={ submitHandler}>
              <Form.Group className="mb-3" 
                controlId="email"
              >
                <Form.Label className="fs-5">
                  Email
                </Form.Label>
                <Form.Control type="email"
                  onChange={ ( e) => setEmail ( e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 " 
                controlId="password">
                <Row className="justify-content-between">
                  <Col xs="3" lg="3">
                    <Form.Label className="fs-5">
                      Password
                    </Form.Label>
                  </Col>
                  <Col xs="6" md="auto" lg="3">
                    <Link to="/forgetpassword" 
                        className="text-info "
                        style={{ textDecoration:"none"}}
                      >
                        Forget password ?
                    </Link>
                  </Col>
                </Row>
                <Form.Control type="password"
                  required
                  onChange={ ( e) => setPassword ( e.target.value)}
                />
              </Form.Group>

              <div className="mb-3 d-flex justify-content-between">
                <Col xs="3" lg="3">
                    <Button type="submit"
                      variant="warning text-white"
                    >
                      Sign In
                    </Button>
                </Col>
                <Col xs="2" lg="3">
                  <Button type="button"
                      variant="outline-warning"
                      onClick={ () => navigate ( -1)}>
                      Back
                  </Button>
                </Col>
              </div>

              <div className="mb-3 fs-4">
                New customer?
                <Link to={`/signup?redirect=${redirect}`} 
                  className="ms-2 text-info fs-4"
                  style={{ textDecoration:"none"}}>
                    Create your account
                </Link>
              </div>
            </Form>
          </Col>

        {/* OR */}
   

        {/* 3rd party login */}
        <Row className="auth-login">
          <Col className="auth-buttons">

          </Col>



        </Row>
  
           
        </Row>

    </Container>
  );
};


export default SigninScreen;