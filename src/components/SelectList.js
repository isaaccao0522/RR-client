import React from 'react'

//By SerachScreen


const reducer = (state, action) => {
  switch ( action.type) {
    case 'FETCH_REQUEST':
      return { 
        ...state, 
        loading: true 
     };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
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

export const SelectList = () => {
  const url = "https://rr-api.onrender.com";
  
  const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer ( reducer, {
    loading: true,
    error: '',
  });

  useEffect ( () => {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${ url}/api/products/search?page=${page}&query=${query}&category=${ category}&price=${ price}`
      );
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        payload: data 
      });
    } catch ( error) {
      dispatch({
        type: 'FETCH_FAIL',
        payload: getError ( error),
      });
    }
  };
  fetchData();
  }, [ category, error, page, price, query]);

  const [ categories, setCategories] = useState ([]);

  useEffect (() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${ url}/api/products/categories`);
        setCategories(data);
      } catch ( error) {
        toast.error ( getError ( error));
      }
    };
    fetchCategories ();
  }, [ dispatch]);

const getFilterUrl = ( filter) => {
  const filterPage = filter.page || page;
  const filterCategory = filter.category || category;
  const filterQuery = filter.query || query;
  const sortOrder = filter.order || order;
  return `/search?category=${ filterCategory}&query=${ filterQuery}&price=${ filterPrice}&page=${ filterPage}`;
};


return (
    <div>
      <Col className="text-end">
        Sort by{' '}
        <select
          value={ order}
          onChange={ ( e) => {
            navigate ( getFilterUrl ( { order: e.target.value }));
          }}
        >
          <option value="lowest">
            Price: Low to High
            </option>
          <option value="highest">
            Price: High to Low
          </option>
        </select>
      </Col>
    </div>
  )
}
