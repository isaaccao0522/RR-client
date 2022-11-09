import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

//Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

//Components
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen'
import AboutScreen from './screens/AboutScreen'
import Header from './components/Header';
import Banner from './components/Banner';


//Functions
import { Store } from './Store';
import { getError } from './utils';


export const App = () => {

  const url = "https://rr-api.onrender.com";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { cart, userInfo } = state;
  const today = new Date () ;


  const [ categories, setCategories] = useState ( []);

  useEffect ( () => {
    const fetchCategories = async () => {
      try {
        const { data } = await Axios.get ( `${ url}/api/products/categories`);
        setCategories ( data);
      } catch ( error) {
        toast.error ( getError( error));
      }
    };
    fetchCategories ();
  }, []);


  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container justify-content-center">
        <ToastContainer position="bottom-center" 
          autoClose={ 2000}
          hideProgressBar={ false}
          newestOnTop={ false}
          closeOnClick
          rtl={ false}
          pauseOnFocusLoss={ false}
          draggable
          pauseOnHover={ false}
          theme="light"
          />
       
        <Header />
        
        <Banner />

        <main>
          <Container className="mt-3 text-white bg-black">
            <Routes>
              <Route path="/forgetpassword" element={<ForgetPasswordScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/orderhistory"  element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>} />
              <Route path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>


        <footer className="d-flex justify-content-center text-white bg-black">
          <Row lg="1">
            <Col>
              <p className="fs-5" style={{ color:"rgba(212, 175, 55, 1)"}}>
                Derek Cao
              </p>
            </Col>
          </Row>
          &ensp;
          <Row lg="1">
            <Col>
              <p className="fs-5">
                &copy; {today.getFullYear ()} Copyrights
              </p> 
            </Col>
          </Row>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
