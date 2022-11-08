import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//Bootstrap
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Components
import CheckoutSteps from '../components/CheckoutSteps';

//Functions
import { Store } from '../Store';


export const PaymentMethodScreen = () => {
  
  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const navigate = useNavigate ();

  const [ paymentMethodName, setPaymentMethod] = useState(
    paymentMethod 
  );

  useEffect ( () => {
    if ( !shippingAddress.address) {
      navigate ( '/shipping');
    }
  }, [ shippingAddress, navigate]);

  const submitHandler = ( e) => {
    e.preventDefault ();
    if ( paymentMethodName === "") {
      toast.error ( 'Please choose a payment method !!!')
    } else {
      ctxDispatch ( { 
        type: 'SAVE_PAYMENT_METHOD', 
        payload: paymentMethodName 
      });
      localStorage.setItem ( 'paymentMethod', paymentMethodName);
      navigate( '/placeorder');
    }
  };


  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        
        <h2 className="my-3 text-center">
          Payment Method
        </h2>

        <Form onSubmit={ submitHandler} 
          className="payment-form">
          {/* PayPal */}
          <div className="mb-3">
            <Form.Check type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={ paymentMethodName === "PayPal"}
              onChange={ ( e) => setPaymentMethod ( e.target.value)}
            />
          </div>

          {/* Strip */}
          <div className="mb-3">
            <Form.Check type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={ paymentMethodName === "Stripe"}
              onChange={ ( e) => setPaymentMethod ( e.target.value)}
            />
          </div>

          {/* COD */}
          <div className="mb-3">
            <Form.Check type="radio"
              id="COD"
              label="Cash on delivery"
              value="Cash on delivery"
              checked={ paymentMethodName === "Cash on delivery"}
              onChange={ ( e) => setPaymentMethod ( e.target.value)}
            />
          </div>

          {/* Buttons */}
          <Row className="mt-3">
            <Col>
              <div className="mt-3">
                <Button type="submit" 
                  variant="warning text-white">
                  Continue
                </Button>
              </div>
            </Col>
            <Col xs={ 5}></Col>
            <Col>
              <div className="mt-3">
                <Button type="submit" 
                  variant="outline-warning"
                  onClick={ () => navigate ( "/shipping")}>
                  Back
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;