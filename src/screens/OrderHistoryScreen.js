import React from 'react';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';

//Bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

//Components
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//Functions
import { Store } from '../Store';
import { getError } from '../utils';


const reducer = ( state, action) => {
  switch ( action.type) {
    case 'FETCH_REQUEST':
      return { 
        ...state, 
        loading: true 
      };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        orders: action.payload, 
        loading: false 
      };
    case 'FETCH_FAIL':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    default:
      return state;
  }
};

export const OrderHistoryScreen = () => {
  const url = "https://rr-server.adaptable.app";

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer ( reducer, {
    loading: true,
    error: '',
  });

  useEffect ( () => {
    const fetchData = async () => {
      dispatch ({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await Axios.get ( `${ url}/api/orders/mine`,
          { headers: { Authorization: `Bearer ${ userInfo.token}` } }
        );
        dispatch ({ 
          type: 'FETCH_SUCCESS', 
          payload: data 
        });
      } catch ( error) {
        dispatch ({
          type: 'FETCH_FAIL',
          payload: getError ( error),
        });
      }
    };
    fetchData();
  }, [ userInfo]);


  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h2 className="my-3 text-center">
        Order History
      </h2>

      { loading 
        ? ( <LoadingBox />) 
        : error 
        ? ( <MessageBox variant="danger">
              { error}
            </MessageBox>
          ) 
        : ( <Row>
              { orders.map ( ( order) => (
                <table  className="d-flex justify-content-center"
                  key={ order._id}> 
                  {/* Form */}
                  <tbody md={ 5} className="me-5 mb-2 " >  
                    <tr > 
                        <Col className="my-2">
                            <td>Order_id</td>
                        </Col>
                        <Col className="my-2">
                          <td>Date</td>
                        </Col>
                        <Col className="my-2">
                          <td xs="2">
                            Total
                          </td>
                        </Col>
                        <Col className="my-2">
                          <td xs="2">
                            Paid
                          </td>
                        </Col>
                        <Col className="my-2">
                          <td xs="2">
                          Delivery
                          </td>
                        </Col>
                        <Col className="my-2">
                          <td xs="2">
                          Actions
                          </td>
                        </Col>
                    </tr>
                  </tbody>

                  {/* Order details */}
                  <tbody md={ 5} className="mb-2 ">
                    <tr> 
                        <Col className="my-2">
                            <td>{ order._id}</td>
                        </Col>
                        <Col className="my-2">
                            <td>{ order.createdAt}</td>
                        </Col>
                        <Col className="my-2">
                            <td xs="2">
                              { order.totalPrice.toFixed ( 1)}
                            </td>
                        </Col>
                        <Col className="my-2">
                            <td xs="2">
                              { order.isPaid ? order.paidAt.substring ( 0, 10) : 'No'}
                            </td>
                        </Col>
                        <Col className="my-2">
                            <td xs="2">
                              { order.isDelivered
                                ? order.deliveredAt.substring ( 0, 10)
                                : 'No'
                              }
                            </td>
                        </Col>
                        <Col className="my-2">
                            <td xs="2">
                              <Button type="button"
                                variant="outline-warning"
                                onClick={() => {
                                  navigate(`/order/${ order._id}`);
                                }}
                              >
                              Details
                              </Button>
                            </td>
                        </Col>
                    </tr> 
                  </tbody>   
                </table>
                ))
              }  
            </Row>
          )
        }
    </div>
  );
};


export default OrderHistoryScreen; 