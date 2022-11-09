import React from 'react';
import { useState, useContext, useEffect} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import Axios from 'axios';

//Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

//Componets
import SearchBox from '../components/SearchBox';
import cartFill from '../screens/images/icons/cartFill.svg';
import cartEmpty from '../screens/images/icons/cartEmpty.svg';

//Functions
import { Store } from '../Store';
import { getError } from '../utils.js';




export const Header = () => {
  const url = "https://rr-api.onrender.com";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch ( { type: 'USER_SIGNOUT' });
    localStorage.removeItem ( 'userInfo');
    localStorage.removeItem ( 'shippingAddress');
    localStorage.removeItem ( 'paymentMethod');
    toast.success ( 'Sign-out success!!!')
    window.location.href = "/signin";
  };  


  const [ categories, setCategories] = useState ( []);

  useEffect ( () => {
    const fetchCategories = async () => {
      try {
        const { data } = await Axios.get ( `${ url}/api/products/categories`);
        setCategories ( data);
      } catch ( error) {
        toast.error ( getError ( error));
      }
    };
    fetchCategories ();
  }, []);

  return (
    <header className="d-flex justify-content-center align-items-center bg-black ">
      <Navbar bg="black" variant="dark" expand="lg">
        <Container >
          <LinkContainer to="/">
                <Navbar.Brand className="navbar-brand fs-2 me-0">
                  GAME of BURGERS
                </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto w-100 justify-content-center align-itmes-center">
              <Link to="/about" className="nav-link">
                About
              </Link>   
              <Link to="/cart" className="nav-link pe-0">         
                { cart.cartItems.length > 0 
                  ? ( <>
                        <img src={ cartFill} className="cart-icon" alt="cart-fill" />
                        <Badge pill bg="danger cart-badge px-0">
                          { cart.cartItems.reduce ( (a, c) => a + c.quantity, 0)}
                        </Badge>
                      </>
                    )
                  : ( <img src={ cartEmpty} className="cart-icon" alt="cart-empty" />)           
                }
              </Link>
                { userInfo ? 
                  (
                    <NavDropdown title={ userInfo.name}
                      id="basic-nav-dropdown" >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item  className="outline-warning">
                          User Profile
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>
                            Order History
                          </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item"
                        to="#signout"
                        onClick={ signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) 
                  : (
                      <Link className="nav-link" 
                        to="/signin">
                        Sign In
                      </Link>
                    )
                }
            </Nav>

            {/* SearchBox */}
            <SearchBox />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;