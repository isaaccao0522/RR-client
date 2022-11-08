import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast} from 'react-toastify';

//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//Components

//Functions
import { Store} from '../Store';
import { getError } from '../utils';


export const ForgetPasswordScreen = () => {
  const url = "https://qq-api.onrender.com/";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { userInfo } = state;

  const navigate = useNavigate ();

  const [ email, setEmail] = useState ('');
  const [ phone, setPhone] = useState ('');

  const submitHandler = async ( e) => {
    e.preventDefault ();
    try {
      const { data } = await Axios.post ( `${ url}/api/users/reset`, {
        email,
        phone,
      });
      ctxDispatch ({ 
        type: 'USER_SIGNIN', 
        payload: data 
      });
      toast.success ( 'Signin Successfully')
      localStorage.setItem ( 'userInfo', JSON.stringify ( data));
      navigate ( "/profile");
    } catch ( error) {
      toast.error ( 
        getError ( error),
      );
    }

  }

  return (
    <Container className="small-container">

    <Helmet>
      <title>Sign In</title>
    </Helmet>

    <h2 className="my-3 text-center">
      Forget Password
    </h2>

    <Row className='justify-content-md-center'>
      <Col md="10" lg="8">
        <Form onSubmit={ submitHandler}>
          {/* Email */}
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

          {/* Phone */}
          <Form.Group className="mb-3 " 
            controlId="phone">
            <Form.Label className="fs-5">
              Phone
            </Form.Label>
            <Form.Control type="password"
              onChange={ ( e) => setPhone ( e.target.value)}
              required
            />
          </Form.Group>

          {/* Buttons */}
          <div className="mb-3 d-flex justify-content-between">
            <Col xs="3" lg="3">
              <Button type="submit"
                variant="warning text-white"
              >
                Reset Password
              </Button>
            </Col>
            <Col xs="2" lg="3">
              <Button type="button"
                variant="outline-warning"
                onClick={ () => navigate ( -1)}
              >
                Back
              </Button>
            </Col>
          </div>
        </Form>
      </Col>


    </Row>
  </Container>
  )
};


export default ForgetPasswordScreen;
