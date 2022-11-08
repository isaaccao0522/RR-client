import { useEffect, useReducer, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { toast} from 'react-toastify';


//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

//Components


//Functions
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


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
        product: action.payload, 
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


export const  ProductScreen = () => {
  const url = "https://qq-api.onrender.com/";

  const params = useParams();
  const { slug } = params;

  const navigate = useNavigate ();

  const [{ loading, error, product }, dispatch] = useReducer ( reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect ( () => {
    const fetchData = async () => {
      dispatch ({ type: 'FETCH_REQUEST' });
      try {
        const result = await Axios.get ( `${ url}/api/products/slug/${slug}`);
        dispatch ({ 
          type: 'FETCH_SUCCESS', 
          payload: result.data 
        });
      } catch ( eror) {
        dispatch ({ 
          type: 'FETCH_FAIL', 
          payload: getError( error) 
        });
      }
    };
    fetchData ();
  }, [ slug]);

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find ( ( x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await Axios.get ( `/api/products/${ product._id}`);
    if ( data.countInStock < quantity) {
      toast.error ( 'Sorry. Product is out of stock');
      return;
    } else {
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { 
          ...product,
           quantity 
        },
      });
      toast.info ( `add a ${ product.name} to cart`)
    }
  };


  return (
      loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox  variant=" danger">
          { error}
        </MessageBox>
      ) : (
        <div className="mb-3">
          <Row>
            <Col md={ 6}>
              <img  className="img-large"
                src={ product.image}
                alt={ product.name}
              />
            </Col>

            <Col md={ 6} className="bg-black">
              <ListGroup variant="flush text-bg-dark">
                <ListGroup.Item className="border-0 text-center text-bg-dark">
                  <Helmet>
                    <title>{ product.name}</title>
                  </Helmet>
                  <h1 className="product-name">
                    { product.name}
                  </h1>
                </ListGroup.Item>


                <ListGroup.Item className="border-0 text-bg-dark">
                  Calorie : { product.calorie}
                </ListGroup.Item>

                  {/* Notice */}
                  { product.notice !== "" &&  
                    ( <ListGroup.Item className="border-0 text-bg-dark" >
                        <Row>
                          <Col>
                            Notice:
                          </Col>
                          <Col>
                            <Badge bg="danger">
                              { product.notice}
                            </Badge>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  }

                <ListGroup.Item className="border-0 text-bg-dark">
                  Pirce : ${ product.price}
                </ListGroup.Item>

                {/* Status   */}
                <ListGroup.Item className="border-0 text-bg-dark">
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      { product.countInStock > 0 
                        ? ( <Badge bg="success">In Stock</Badge>)
                        : ( <Badge bg="danger">Unavailable</Badge>)
                      }
                    </Col>
                  </Row>
                </ListGroup.Item>
                
                {/* Ingredients */}
                <Accordion className="ingredients" >
                    <Accordion.Item eventKey="0" className="text-bg-dark border-0">
                      <Accordion.Header>
                        Ingredients
                      </Accordion.Header>
                      <Accordion.Body>
                        &emsp;{ product.ingredients}
                      </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
              </ListGroup>
      
              { product.countInStock > 0 
                ? (
                    <>
                      <ListGroup.Item className="mt-3">
                        <div className="d-grid">
                          <Button variant="warning text-white"
                              onClick={ addToCartHandler}
                            >
                              Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item className="mt-3">
                      <div className="d-grid" >
                        <Button variant="outline-warning"
                            xs={ 10}
                            onClick={ () => navigate ( '/')}
                          >
                            Back
                        </Button>
                      </div>
                      </ListGroup.Item>
                    </>
                  )
                : (
                    <ListGroup.Item  className="mt-3">
                      <div className="d-grid">
                        <Button variant="outline-warning"
                            onClick={ () => navigate ( '/')}
                          >
                            Back
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )
              }

            </Col>
          </Row>
        </div>
      )
  )
};


export default ProductScreen;