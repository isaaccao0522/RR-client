import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import logger from 'use-reducer-logger';
import { Helmet } from 'react-helmet-async';

//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Components
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';

//Functions


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
        products: action.payload, 
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


export const HomeScreen = () => {
  const url = "https://rr-server.adaptable.app";

  const [{ loading, error, products }, dispatch] = useReducer ( logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect ( () => {
    const fetchData = async () => {
      dispatch ({ type: 'FETCH_REQUEST' });
      try {
        const result = await Axios.get ( `${ url}/api/products`);
        dispatch ({ 
          type: 'FETCH_SUCCESS', 
          payload: result.data 
        });
      } catch ( eror) {
        dispatch ({ 
          type: 'FETCH_FAIL', 
          payload: error.message 
        });
      }
    };
    fetchData();
  }, []);
  

  return (
    <div>
      <Helmet>
        <title>GAME of BURGERS</title>
      </Helmet>

      <h2 className="text-center mb-3">
        All Products
      </h2>

      <div className="products">
        {loading 
          ?  (  <LoadingBox />) 
          : error ? 
            ( <MessageBox>
              { error}
              </MessageBox>
            ) 
          : (
              <Row>
                { products.map ( ( product) => (
                  <Col className="mb-3" sm={ 6} md={ 4} lg={ 3}  key={ product.slug}>
                    <Product product={ product}></Product>
                  </Col>
                  ))
                }
              </Row>
            )
          }
      </div>
    </div>
  );
}
export default HomeScreen;