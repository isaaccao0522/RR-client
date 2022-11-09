
import React from 'react';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';

//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

//Components
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

//Functions
import { Store } from '../Store';
import { getError } from '../utils';


const reducer = ( state, action) => {
  switch ( action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};


export const PlaceOrderScreen = () => {
  const url = "https://rr-api.onrender.com";

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });


  cart.itemsPrice = cart.cartItems.reduce ( ( a, c) => a + c.quantity * c.price, 0)
  cart.shippingPrice = cart.itemsPrice > 100 ? 0: 10;
  cart.taxPrice = 0.15 * cart.itemsPrice;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


  const placeOrderHandler = async () => {
    
    try {
      dispatch ({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post ( `${ url}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${ userInfo.token}`,
          },
        }
      );
      ctxDispatch ({ type: 'CART_CLEAR' });
      dispatch ({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem ( 'cartItems');
      navigate ( `/order/${ data.order._id}`);
    } catch ( error) {
      dispatch ({ type: 'CREATE_FAIL' });
      toast.error ( getError( error));
    }
  };

  useEffect ( () => {
    if ( !cart.paymentMethod) {
      navigate ( '/payment');
    }
  }, [ cart, navigate]);


  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Helmet>
        <title>Preview Order</title>
      </Helmet>

      <h2 className="my-3 text-center">
        Preview Order
      </h2>

      <Row>
        <Col md={ 8}>
          {/* Shipping */}
          <Card className="mb-3 text-bg-dark">
            <Card.Body>
              <Card.Title className="text-center">
                Shipping
              </Card.Title>
              <Card.Text>
                <strong>Name:</strong>&ensp;{ cart.shippingAddress.fullName} 
                <br />
                <strong>Address:</strong>&ensp;
                { cart.shippingAddress.city},
                { cart.shippingAddress.postalCode}, 
                { cart.shippingAddress.address}
                <br />
                <strong>Phone:</strong>&ensp;
                { cart.shippingAddress.phone}
              </Card.Text>
              <Button type="button"
                variant="warning text-dark"
                onClick={ () => navigate ( "/shipping")}
              >
                Edit
              </Button>
            </Card.Body>
          </Card>

          {/* Payment */}
          <Card className="mb-3 text-bg-dark">
            <Card.Body>
              <Card.Title className="text-center">
                Payment
              </Card.Title>
              <Card.Text>
                <strong>Method:</strong>&ensp;{ cart.paymentMethod}
              </Card.Text>
              <Button type="button"
                variant="warning text-dark"
                onClick={ () => navigate ( "/payment")}
              >
                Edit
              </Button>
            </Card.Body>
          </Card>

          {/* Items */}
          <Card className="mb-3 text-bg-dark">
            <Card.Body>
              <Card.Title className="text-center">
                Items
              </Card.Title>
              <ListGroup variant="flush">
                { cart.cartItems.map ( ( item) => (
                  <ListGroup.Item className="text-bg-dark" 
                    key={ item._id}>
                    <Row className="align-items-center text-bg-dark">
                      <Col md={ 6}>
                        <Link to={ `/product/${ item.slug}`} 
                          style={{ textDecoration:"none"}}>  
                          <img src={ item.image}
                            alt={ item.name}
                            className="img-fluid rounded img-thumbnail"
                          />{' '}
                          <p className="text-center text-white fs-5">
                            { item.name}
                          </p>
                        </Link>
                      </Col>
                      <Col md={ 3}
                        className="fs-5"
                        >
                        <span>{ item.quantity}</span>
                      </Col>
                      <Col md={ 3}
                        className="fs-5">
                        ${ item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button type="button"
                variant="warning text-dark "
                onClick={ () => navigate ( "/cart")}
              >
                Edit
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          {/* Note */}
          <Card className="mb-3 text-bg-dark">
            <Card.Body>
              <Card.Title className="text-center">
                Note
              </Card.Title>
              <Card.Text>
                { cart.shippingAddress.note}
              </Card.Text>
              <Button type="button"
                variant="warning text-dark"
                onClick={ () => navigate ( "/shipping")}
              >
                Edit
              </Button>
            </Card.Body>
          </Card>

          {/* Order Summary */}
          <Card>
            <Card.Body>
              <Card.Title className="text-dark text-center">
                Order Summary
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${ cart.itemsPrice.toFixed ( 2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${ cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${ cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${ cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button type="button"
                      variant="warning text-white"
                      onClick={ placeOrderHandler}
                      disabled={ cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    <Button type="button"
                      variant="outline-dark mt-3 border-3"
                      onClick={ () => navigate ( "/payment")}
                    >
                      Back
                    </Button>
                  </div>
                  { loading && <LoadingBox />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


export default PlaceOrderScreen;