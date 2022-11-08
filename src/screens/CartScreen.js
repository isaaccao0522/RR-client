import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast } from 'react-toastify';

//Bootstrap
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Components
import MessageBox from '../components/MessageBox';

//Functions
import { Store } from '../Store';


export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const {
    cart: { cartItems },
  } = state;

  const navigate = useNavigate ();

  const updateCartHandler = async ( item, quantity) => {
    const { data } = await Axios.get ( `/api/products/${ item._id}`);
    if ( data.countInStock < quantity) {
      toast.error ( 'Sorry. Product is out of stock');
      return;
    } else {
      ctxDispatch ({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });
    }
  };

  const removeItemHandler = ( item) => {
    ctxDispatch ({ 
      type: 'CART_REMOVE_ITEM', 
      payload: item 
    });
  };

  const checkoutHandler = () => {
    navigate ( '/signin?redirect=/shipping');
  };


  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h2 className="my-3 text-center">
        Shopping Cart
      </h2>

      <Row>
        <Col md={ 8}>
          { cartItems.length === 0 ? (
            <MessageBox>
              <p className="text-center fs-3 m-0">
                Cart is empty. 
              </p>
            </MessageBox>
          ) : (
            <ListGroup>
              { cartItems.map ( ( item) => (
                <ListGroup.Item className="text-bg-dark" key={ item._id} >
                  <Row className="align-items-center">
                    <Col md={ 4}>
                      <Link to={ `/product/${ item.slug}`} style={{ textDecoration:"none"}}>
                        <img src={ item.image}
                          alt={ item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <p className="fs-4 text-white text-center">
                          { item.name}
                        </p>  
                      </Link>
                    </Col>

                    <Col md={ 3} 
                      className="d-flex-col">
                      {/* Minus */}
                      <Button type="button"
                        variant="light"
                        onClick={ () => updateCartHandler( item, item.quantity - 1)}
                        disabled={ item.quantity === 1}
                      >
                        <i class="bi bi-dash-circle"></i>
                      </Button>{''}
                      <span className="mx-2">
                        { item.quantity}
                      </span>{' '}

                       {/* Plus */}
                      <Button type="button" 
                        variant="light" 
                        onClick={ () => updateCartHandler ( item, item.quantity + 1)}
                      >
                        <i class="bi bi-plus-circle"></i>
                      </Button>
                    </Col>

                    <Col md={ 3}>
                      ${ item.price}
                    </Col>

                    {/* Remove */}
                    <Col md={ 2}>
                      <Button type="button" 
                        variant="light" 
                        onClick={ () => removeItemHandler ( item)}>
                        <i class="bi bi-trash"></i>  
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={ 4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0">
                  <h3>
                    Subtotal ({ cartItems.reduce ( (a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    { cartItems.reduce( ( a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>

                {/* Proceed to Checkout */}
                <ListGroup.Item className="border-0">
                  <div className="d-grid">
                    {  cartItems.length === 0
                      ? (
                          <Button type="button" 
                            variant="outline-danger"
                            onClick={ () => navigate ( "/")}
                            >
                            Go Shopping
                          </Button>
                        )
                      : ( 
                          <Button type="button" 
                            variant="warning text-white"
                            onClick={ checkoutHandler}
                          >
                            Proceed to Checkout
                          </Button>
                        )
                    }
                  </div>
                </ListGroup.Item>
                {/* Prev */}
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button type="button"
                      variant="outline-dark"
                      onClick={ () => navigate ( "/")}
                    >
                      Back
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}