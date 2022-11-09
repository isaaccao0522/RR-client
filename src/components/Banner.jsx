import React from 'react';
import { useState} from 'react';
import { Link} from 'react-router-dom';

//Bootstrap
import Carousel from 'react-bootstrap/Carousel';


export const Banner = ( ) => {
  // const { products } = props;
  
  const [ index, setIndex] = useState ( 0);
  
  const handleSelect = ( selectedIndex) => {
    setIndex ( selectedIndex);
  };


  return (
    <div className="banner-container bg-black">
      <Carousel activeIndex={ index} 
        onSelect={ handleSelect}
       >
        {/* arya-stark */}
        <Carousel.Item data-bs-interval="1000" className="carousel-item">
          <Link to={ '/product/arya-stark'}>
            <img  className="d-block w-50 active carousel-image "
              src="https://lh3.googleusercontent.com/pw/AL9nZEX30aj9-MBRgO2HgJlmQ-qG9k52iqPGzO-dPpl_jOq-SL8nCu-CTjN2lOxprF73UCaAYqYCar9yO7GMfCpSN6zkFKY6XeEmTOqxkCk69lYfDl9YiM4uzp7Bvt_y4lMsVxHQ7TcR9HQj9hZiMg_SoY4g=w680-h383-no?authuser=0"
              alt="arya-stark"
            />
          </Link>
        </Carousel.Item>

        {/* tyrion-lannister */}
        <Carousel.Item data-bs-interval="500">
          <Link to={'/product/tyrion-lannister'}>
            <img  className="d-block w-50 carousel-image "
              src="https://lh3.googleusercontent.com/pw/AL9nZEVnsZQOvNK5_GGytlz1wyHNl0eJo-2rPp4iJWGZcNezlGnODglsI97JLSgfpCP_NoIYa64XZq_TW2YfOAVvuLt_7ahd8x3t9uCKZu-HukVTJ6qyikWwR0-GNOPKWfpRUyYogYbXAHYb2bquo-Iy_SQK=w680-h383-no?authuser=0"
              alt="tyrion-lannister"
            />
          </Link>
        </Carousel.Item>

        {/* daenerys-targaryen */}
        <Carousel.Item>
          <Link to={'/product/daenerys-targaryen'}>
            <img  className="d-block w-50 carousel-image "
              src="https://lh3.googleusercontent.com/pw/AL9nZEU4sKcHXpYJ8GpHe6y37HhY9ycgfNMALqtlZllJhSz7IOGDcWHSEc-OjsgpMiluLaFsWHpLfIpkEvE8zlZNRbLVAw1Y_2vWLa205JWKzzFKfvs18yHrBJeHiJqEXuKu8iUwI05LmBbCAz-abFJwH7t7=w680-h383-no?authuser=0"
              alt="daenerys-targaryen"
            />
          </Link>
        </Carousel.Item>

        {/* brienne-of-tarth */}
        <Carousel.Item >
          <Link to={'/product/brienne-of-tarth'}>
            <img  className="d-block w-50 carousel-image"
              src="https://lh3.googleusercontent.com/pw/AL9nZEVDvDueTzTLFXV1G4NoXU_5PataVIYu7y0SHGwAsKDYokPfzK56ongwsA-3NRTe-w9_WPrx0r34cYz2-OcZa5F1hO80kbHuQe3bhvIWUnbz7RMvQcGgrW5fuZnJWkt2PywsaPdssuiETcQj1xjoF3Td=w680-h383-no?authuser=0"
              alt="brienne-of-tarth"
            />
          </Link>
        </Carousel.Item>

        {/* john-snow */}
        <Carousel.Item >
        <Link to={'/product/john-snow'}>
          <img  className="d-block w-50 carousel-image "
            src="https://lh3.googleusercontent.com/pw/AL9nZEXDyhvcxpjZoKVJMFQD3wInPsAwwpyFtbGatSQFy5sCJYm4hCHF33HfsUvr07Ra2DxJv5IciEAizwISJ9HPAm3dbeX9JWE4nH7ZilCd1sD4yRJioKicSbvk-GNesNAbh1AIn30re07KkNY38oRH18la=w680-h383-no?authuser=0"
            alt="john-snow"
          />
          </Link>
        </Carousel.Item>

        {/* joffrey-baratheon */}
        <Carousel.Item >
          <Link to={'/product/joffrey-baratheon'}>
            <img  className="d-block w-50 carousel-image "
              src="https://lh3.googleusercontent.com/pw/AL9nZEXb8FWUKm6nmqc5MgVpjBCy2yKukDV6H_FLZzjWo-ufjj3vEB_PCKaE0ywKo0ExlFjaP-5nS2IhSPPjm-ijk-CXbruqLk_Tn28sECdRqt_S3oL9J4IbbBn2Hvay4j7WY_VTP7KHarGlRJKEcCFeJPEJ=w680-h383-no?authuser=0"
              alt="joffrey-baratheon"
            />
          </Link>
        </Carousel.Item>

        {/* khal-drogo */}
        <Carousel.Item>
            <Link to={'/product/khal-drogo'}>
            <img  className="d-block w-50 carousel-image "
              src="https://lh3.googleusercontent.com/pw/AL9nZEV-agVfielz6WfXIpV8nCfV3Tff2SNBF-5vf44vaEBfqYR22zy2UoJM4uzKEuS5eGVlIkDpMogYgr8MVtNsIrFV_AaLejaiGZbuCLubpBgJ7bOLRvHOpsfy3cQh36A1RZnmimbZrt8zqGdfyeQIJ_Dh=w680-h383-no?authuser=0"
              alt="khal-drogo"
            />
            </Link>
        </Carousel.Item>

        {/* beric-dondarrion */}
        <Carousel.Item>
          <Link to={'/product/beric-dondarrion'}>
            <img  className="d-block w-50 carousel-image"
              src="https://lh3.googleusercontent.com/pw/AL9nZEV4BqRMUEtDN_NPw8pg2dAnaJTB8SnDUHpaRg04B8ZyjlvUjJ9hV4dkurqDsZY_yWXI_dPafbLjFrqP-JZAXKqc-BJlOmSKywB3hlzDdWF2Lnsxn0f4KAhYYhdvzn9Z8wAer8pyLvRorXGqq1tkuJUn=w680-h383-no?authuser=0"
              alt="beric-dondarrion"
            />
          </Link>
        </Carousel.Item>
      </Carousel>
    </div>
  )
};

export default Banner; 