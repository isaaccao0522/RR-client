import Alert from 'react-bootstrap/Alert';

export const MessageBox = ( props) => {
  return (
    <Alert variant={ props.variant || 'info'}>
      {props.children}
    </Alert>
  )
};

export default MessageBox;