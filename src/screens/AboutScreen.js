import React from 'react';
import { Link} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';



//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Components
import aboutBurger from '../screens/images/burgers/about.png';



export const AboutScreen = () => {
  return (
    <Container className="small-container justify-content-between">
      <Helmet>
        <title>
          about&emsp;GAME of BURGERS
        </title>
      </Helmet>

      <h2 className="my-3 text-center">
        about&emsp;GAME of BURGERS
      </h2>

      <Row  className="d-flex justify-content-center">
        <Col lg="4" md="6">
          <text>
            <p> 
              Have you ever watch a TV drama "Game of thrones" ?
            </p>
            <p>
              Are you serious ? Never ?
            </p>
            <p>
              That's the famous TV series on HBO from 2011 ~ 2019 , this E-commercial website which is based on a story of it and all products are named from roles of "Game of BURGERS".
            </p>
            <p>
              Even if you didn't watch it , never mind, just go shopping on this website directly.
            </p>
            <p>
              And now , That's go to enjoy it.
            </p>
          </text>
        </Col>
        <Col lg="4" md="6" 
          className=" d-flex justify-content-center">
          <img src={ aboutBurger} alt="aboutBurger" />
        </Col>
      </Row>

      {/* Resource */}
      <Row  className="d-flex justify-content-center">
        <h2 className="my-3 text-center">
          Resource
        </h2>
        <Col lg="4" md="6">
          <p>
            Pictures:&emsp;
            <a href="https://www.foodiesfeed.com"
              className="text-info" 
              style={{ textDecoration:"none"}}
            >
              Foodiesfeed
            </a>
            &ensp;
            and
            &ensp;
            <a href="https://www.figma.com/"
              className="text-info" 
              style={{ textDecoration:"none"}}
            >
              Figma
            </a>
          </p>
          <p>
            Name of products:&emsp;
            <a href="https://www.hbo.com/game-of-thrones"
              className="text-info" 
              style={{ textDecoration:"none"}}
            >
              Game of Thrones
            </a>
          </p>
        </Col>
      </Row>



    </Container>
  )
};


export default AboutScreen; 
