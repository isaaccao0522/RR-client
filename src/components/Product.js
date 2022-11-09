import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';


export const Product = ( props) => {


  const { product } = props;
  const navigate = useNavigate ();

  return (
    <Card className="mb-2 border-0 product-card"
      onClick={() => navigate ( `/product/${ product.slug}`)} >
      <img src={ product.image} 
        className="card-img-top" 
        alt={ product.name} 
      />
      <Card.Body className="border-0 text-center text-dark">
        <Card.Title className="mb-2" >
          { product.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}
export default Product;