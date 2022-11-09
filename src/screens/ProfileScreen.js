import { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import Axios from 'axios';
//Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Components

//Functions
import { Store } from '../Store';
import { getError } from '../utils';


const reducer = ( state, action) => {
  switch ( action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, 
        loadingUpdate: true 
      };
    case 'UPDATE_SUCCESS':
      return { ...state, 
        loadingUpdate: false 
      };
    case 'UPDATE_FAIL':
      return { ...state, 
        loadingUpdate: false 
      };

    default:
      return state;
  }
};

export const ProfileScreen = () => {
  const url = "https://rr-api.onrender.com";

  const { state, dispatch: ctxDispatch } = useContext ( Store);
  const { userInfo } = state;
  const navigate = useNavigate ();
  const [ name, setName] = useState ( userInfo.name);
  const [ email, setEmail] = useState( userInfo.email);
  const [ phone, setPhone] = useState( userInfo.phone);
  const [ password, setPassword] = useState ('');
  const [ confirmPassword, setConfirmPassword] = useState ('');

  const [{ loadingUpdate }, dispatch] = useReducer ( reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async ( e) => {
    e.preventDefault ();
    if ( password !== confirmPassword) {
      toast.error ( 'Passwords do not match !!!');
      return;
    } 
    if ( password.length < 5 && ( typeof password !== String || Number)) {
      toast.error ( 'Please enter letters or numbers more than 6 characters.');
      return;
    }
    else {
      try {
        const { data } = await Axios.put ( `${ url}/api/users/profile`,
          {
            name,
            email,
            phone,
            password,
          },
          {
            headers: { Authorization: `Bearer ${ userInfo.token}` },
          }
        );
          dispatch ({
            type: 'UPDATE_SUCCESS',
          });
          ctxDispatch ({ 
            type: 'USER_SIGNIN', 
            payload: data 
          });
          localStorage.setItem ( 'userInfo', JSON.stringify (data));
          toast.success ( 'User updated successfully');
          navigate ( "/")
        } catch ( error) {
        dispatch  ({
          type: 'FETCH_FAIL',
        });
        toast.error ( getError ( error));
      }
    };
  };


  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      <h2 className="my-3 text-center">
        User Profile
      </h2>

      <Row md={ 2} className="justify-content-center">
        <Form onSubmit={ submitHandler}>
          {/* First Name */}
          <Form.Group className="mb-3 fs-5" 
            controlId="name">
            <Form.Label>
              Name
            </Form.Label>
            <Form.Control value={ name}
              onChange={ (e) => setName ( e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3 fs-5" 
            controlId="name">
            <Form.Label>
              Email
            </Form.Label>
            <Form.Control type="email"
              value={ email}
              onChange={ (e) => setEmail ( e.target.value)}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3 fs-5" 
            controlId="phone">
            <Form.Label>
              Phone
            </Form.Label>
            <Form.Control type="phone"
              value={ phone}
              onChange={ ( e) => setPhone ( e.target.value)}
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3 fs-5" 
            controlId="password">
            <Form.Label>
              Password
            </Form.Label>
            <Form.Control
              type="password"
              onChange={ ( e) => setPassword ( e.target.value)}
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3 fs-5" 
            controlId="confirmPassword">
            <Form.Label>
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              onChange={ ( e) => setConfirmPassword ( e.target.value)}
            />
          </Form.Group>
      

          <Row  xs="4" lg="6"
            className="d-flex mb-3 justify-content-between">
            <Col>
              <Button type="submit"
                variant="warning text-white">
                Update
              </Button>
            </Col>
            <Col>
              <Button type="button"
                variant="outline-warning "
                onClick={ () => navigate ( -1)}
              >
                Back
              </Button>
            </Col>
          </Row>
        
          {/* <div className="mb-3">  
          </div> */}
        </Form>
      </Row> 
    </div>
  );
};


export default ProfileScreen;