import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';


export const SearchBox = () => {
  const navigate = useNavigate ();
  const [ query, setQuery] = useState ('');
  
  const submitHandler = ( e) => {
    e.preventDefault ();
    navigate  ( 
      query ? `/search/?query=${ query}` : '/search'
    );
  };


  return (
    <Form className="d-flex mx-auto w-100 my-3" 
      onSubmit={ submitHandler}>
      <InputGroup>
        <FormControl  type="text"
          name="q"
          id="q"
          onChange={ ( e) => setQuery ( e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        >
        </FormControl>
        <Button type="submit" 
          variant="outline-warning"  
          id="button-search"
        >
          <i class="bi bi-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};


export default SearchBox;