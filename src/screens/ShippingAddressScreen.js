import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

//Bootstrap
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';


//Components
import CheckoutSteps from '../components/CheckoutSteps';

//Functions
import { Store } from '../Store';
import Container from 'react-bootstrap/esm/Container';


export const ShippingAddressScreen = () => {
  const url = "https://qq-api.onrender.com/";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const navigate = useNavigate();

  const [ fullName, setFullName] = useState ( userInfo.name || '');
  const [ city, setCity] = useState ( shippingAddress.city || '');
  const [ postalCode, setPostalCode] = useState (
    shippingAddress.postalCode || ''
  );
  const [ address, setAddress] = useState ( shippingAddress.address || '');
  const [ phone, setPhone] = useState ( userInfo.phone);
  const [ note, setNote] = useState ( shippingAddress.note || '');

  useEffect(() => {
    if (  !userInfo) {
      navigate( `${ url}/signin?redirect=/shipping`);
    }
  }, [ userInfo, navigate]);

  const submitHandler = ( e) => {
    e.preventDefault ();
    ctxDispatch ({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        phone,
        note
      },
    });
    localStorage.setItem  ( 'shippingAddress',
      JSON.stringify  ({
        fullName,
        address,
        city,
        postalCode,
        phone,
        note
      })
    );
    navigate  ( '/payment');
  };


  return (
    <Container className="container 
      small-container">

      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2 />

      <h2 className="my-3 text-center">
          Shipping Address
      </h2>

      <Row className='justify-content-md-center'>
        <Col md="10" lg="8">
          <Form 
          onSubmit={ submitHandler}>
            {/* Name */}
            <Form.Group className="mb-3" 
              controlId="fullName">
              <Form.Label>
                Full Name
              </Form.Label>
              <Form.Control value={ fullName}
                placeholder="ex: Derek Cao"
                onChange={ ( e) => setFullName ( e.target.value)}
                required
              />
            </Form.Group>

            {/* City */}
            <Form.Group md={3}
              className="mb-3" 
                controlId="city">
                <Form.Label>
                  City
                </Form.Label>
                <Form.Control value={city}
                  placeholder="ex: Taipei"
                  onChange={ ( e) => setCity ( e.target.value)}
                  required
                />
            </Form.Group>

            {/* Postal code */}
            <Form.Group className="mb-3" 
                controlId="postalCode">
                <Form.Label>
                  Postal Code
                </Form.Label>
                <Form.Control value={ postalCode}
                  placeholder="ex: 11105"
                  onChange={ ( e) => setPostalCode  ( e.target.value)}
                  required
                />
            </Form.Group>
      
            {/* Address */}
            <Form.Group className="mb-3" 
              controlId="address">
              <Form.Label>
                Address
              </Form.Label>
              <Form.Control value={ address}
                placeholder="No. 131, Bo'ai Rd., Zhongzheng Dist."
                onChange={ ( e) => setAddress ( e.target.value)}
                required
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3" 
              controlId="phone">
              <Form.Label>
                Phone
              </Form.Label>
              <Form.Control value={ phone}
                placeholder=" 09xxxxxxxx"
                onChange={ ( e) => setPhone ( e.target.value)}
                required
              />
            </Form.Group>
            
            {/* Note */}
            <Form.Group className="mb-3" >
              <Form.Label>
                Note (optional)
              </Form.Label>
              <Form.Control value={ note} 
                as="textarea" 
                aria-label="note" 
                placeholder="Anything to let us know ?"
                onChange={ ( e) => setNote ( e.target.value)}
              />
            </Form.Group>

            {/* Buttons */}
            <div className="mb-3 d-flex justify-content-between">
              <Col xs="3" md="2" lg="6">
                <Button type="submit" 
                    variant="warning text-white"
                  >
                    Continue
                </Button>
              </Col>
              <Col xs="3" md="2" lg="1">
                <Button type="button" 
                  variant="outline-warning"
                  onClick={ () => navigate ( "/cart")}
                >
                  Back
                </Button>
              </Col>
            </div>
          </Form>
        </Col>
      </Row>
      
   
    </Container>
  );
};

export default ShippingAddressScreen;