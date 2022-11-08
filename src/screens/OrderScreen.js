import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';


//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//Components
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//Functions
import { Store } from '../Store';
import { getError } from '../utils';


const reducer = (state, action) => {
  switch ( action.type) {
    //Get orders
    case 'FETCH_REQUEST':
      return { 
        ...state, loading: true, 
        error: '' 
      };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        order: action.payload, 
        error: '' 
      };
    case 'FETCH_FAIL':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };

    //Pay
    case 'PAY_REQUEST':
      return { 
        ...state, 
        loadingPay: true 
      };
    case 'PAY_SUCCESS':
      return { 
        ...state, 
        loadingPay: false, 
        successPay: true 
      };
    case 'PAY_FAIL':
      return { 
        ...state, 
        loadingPay: 
        false 
      };
    case 'PAY_RESET':
      return { 
        ...state, loadingPay: false, 
        successPay: false 
      };
      
    //Deliver
    case 'DELIVER_REQUEST':
      return { 
        ...state, 
        loadingDeliver: true 
      };
    case 'DELIVER_SUCCESS':
      return { 
        ...state, 
        loadingDeliver: false, 
        successDeliver: true 
      };
    case 'DELIVER_FAIL':
      return { 
        ...state, 
        loadingDeliver: false 
      };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    
    default:
      return state;
  }
};


export const OrderScreen = () => {
  const { state } = useContext ( Store);
  const { userInfo } = state;

  const params = useParams ();
  const { id: orderId } = params;
  const navigate = useNavigate ();

  const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, 
    dispatch] = useReducer ( reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
      successDeliver: false
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer ();

  useEffect (() => {
    const fetchOrder = async () => {
      try {
        dispatch ({ type: 'FETCH_REQUEST' });
        const { data } = await Axios.get( `/api/orders/${orderId}`, 
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch ({ 
          type: 'FETCH_SUCCESS', 
          payload: data 
        });
      } catch ( error) {
        dispatch ({ 
          type: 'FETCH_FAIL', 
          payload: getError( error) 
        });
      }
    };

    if ( !userInfo) {
      return navigate( '/login');
    }
    if ( !order._id || successPay || successDeliver || ( order._id && order._id !== orderId )) {
      fetchOrder ();
      if ( successPay) {
        dispatch ({ type: 'PAY_RESET' });
      }
      if ( successDeliver) {
        dispatch ({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await Axios.get ( '/api/keys/paypal', 
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch ({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch ({ 
          type: 'setLoadingStatus', 
          value: 'pending' 
        });
      };
      loadPaypalScript ();
    }
  }, [ order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver]);

  const createOrder = ( data, actions) => {
    return actions.order
    .create ({
      purchase_units: [{
        amount: { value: order.totalPrice },
        }
      ] 
    })
    .then (( orderID) => {
      return orderID;
    });
  };

  const onApprove = ( data, actions) => {
    return actions.order.capture()
      .then( async (details) => {
        try {
          dispatch ({ type: 'PAY_REQUEST' });
          const { data } = await Axios.put ( `/api/orders/${order._id}/pay`,
            details,
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch ({ 
            type: 'PAY_SUCCESS', 
            payload: data 
          });
          toast.success ( 'Order is paid');
        } catch ( error) {
          dispatch ({ 
            type: 'PAY_FAIL', 
            payload: getError ( error) 
          });
          toast.error ( getError ( error));
        }
    });
  };

  const onError = ( error) => {
    toast.error  ( getError ( error));
  };

  const deliverOrderHandler = async () => {
    try {
      dispatch ({ type: 'DELIVER_REQUEST' });
      const { data } = await Axios.put ( `/api/orders/${ order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${ userInfo.token}` },
        }
      );
      dispatch ({ 
        type: 'DELIVER_SUCCESS', 
        payload: data 
      });
      toast.success ( 'Order is delivered');
    } catch ( error) {
      toast.error ( getError (error));
      dispatch ({ type: 'DELIVER_FAIL' });
    }
  };


  return (
    loading 
    ? ( <LoadingBox />) 
    : error 
    ? ( <MessageBox variant="danger">
          { error}
        </MessageBox>) 
    : ( <div>
          <Helmet>
            <title>Order { orderId}</title>
          </Helmet>

          <h2 className="my-3 text-center"
            style={{ color:"goldenrod"}}>
            Order : { orderId}
          </h2>

          <Row className="d-flex justify-content-center">
            {/* Left  columns*/}
            <Col md={6}>
              {/* Shipping */}
              <Card className="mb-3 text-bg-dark">
                <Card.Body>
                  <Card.Title className="text-center">
                    Shipping
                  </Card.Title>
                  <Card.Text>
                    <strong>Name:&ensp;</strong> { order.shippingAddress.fullName} 
                    <br />
                    <strong>Address:&ensp;</strong> { order.shippingAddress.city}, 
                    { order.shippingAddress.postalCode},
                    { order.shippingAddress.address}
                    <br />
                    <strong>Phone:&ensp;</strong>
                    { order.shippingAddress.phone}
                  </Card.Text>
                  { order.isDelivered 
                    ? ( <MessageBox variant="success">
                          Delivered at { order.deliveredAt}
                        </MessageBox>) 
                
                    : ( <>
                          <MessageBox variant="primary bg-opacity-75">
                            The order is preparing
                          </MessageBox>
                          <MessageBox variant="danger">
                            Not Delivered
                          </MessageBox>
                        </>
                      )
                  }
                </Card.Body>
              </Card>

              {/* Payment */}
              <Card className="mb-3 text-bg-dark">
                <Card.Body>
                  <Card.Title className="text-center">
                    Payment
                  </Card.Title>
                  <Card.Text>
                    <strong>Method:</strong> { order.paymentMethod}
                  </Card.Text>
                  { order.paymentMethod !== "Cash on delivery" 
                    ? ( order.isPaid 
                       ? ( <MessageBox variant="success">
                            Paid at { order.paidAt}
                          </MessageBox> 
                        )
                      : ( <MessageBox variant="danger">
                            Not Paid
                          </MessageBox>
                        )
                      )
                    : (
                      <MessageBox variant="danger">
                            Not Paid
                      </MessageBox>
                    )     

                  }
                </Card.Body>
              </Card>

              {/* Items */}
              <Card className="mb-3 text-bg-dark">
                <Card.Body className="text-bg-dark">
                  <Card.Title className="text-center fs-4">
                    Items
                  </Card.Title>
                  <ListGroup variant="flush text-bg-dark">
                    { order.orderItems.map ( ( item) => (
                      <ListGroup.Item key={ item._id}
                        className="text-bg-dark"
                        >
                        <Row className="align-items-center text-bg-dark">
                          <Col md={ 6}>
                            <Link to={ `/product/${ item.slug}`}
                              style={{ textDecoration:"none"}}>
                              <img src={ item.image}
                                className="img-fluid rounded img-thumbnail"
                                alt={ item.name}
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
                          <Col md={ 3} className="fs-5">
                            ${ item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Colmns*/}
            <Col md={ 5}>
              {/* Note */}
              { order.shippingAddress.note.length !== 0 && (
                 <Card className="mb-3 text-bg-dark">
                 <Card.Body>
                   <Card.Title className="text-center">
                     Note
                   </Card.Title>
                   <Card.Text>
                     { order.shippingAddress.note}
                   </Card.Text>
                 </Card.Body>
               </Card>
                )
              }
        
               

                {/* Order Summary */}
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title className="text-center text-dark">
                      Order Summary
                    </Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Items</Col>
                          <Col>${ order.itemsPrice.toFixed ( 2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping</Col>
                          <Col>${ order.shippingPrice.toFixed ( 2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Tax</Col>
                          <Col>${ order.taxPrice.toFixed ( 2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            <strong> Order Total</strong>
                          </Col>
                          <Col>
                            <strong>${ order.totalPrice.toFixed ( 2)}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                    { !order.isPaid && (
                  <ListGroup.Item className="payapl-buttons">
                    { isPending 
                      ? ( <LoadingBox />)
                      : ( <div>
                            <PayPalButtons createOrder={ createOrder}
                              onApprove={ onApprove}
                              onError={ onError}
                            >
                            </PayPalButtons>
                          </div>
                        )
                    }
                    { loadingPay && <LoadingBox />}
                  </ListGroup.Item>
                  )
                }
                  </Card.Body>
                  
                </Card>
                { userInfo.isAdmin && order.isPaid && !order.isDelivered && 
                  ( <ListGroup.Item>
                      { loadingDeliver && 
                        <LoadingBox />
                      }
                      <div className="d-grid">
                        <Button type="button" 
                          onClick={ deliverOrderHandler}
                        >
                          Deliver Order
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )
                }
            </Col>
            
          </Row>
        </div>
    )
  );
};


export default OrderScreen;