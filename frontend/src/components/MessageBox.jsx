import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

function MessageBox(props) {
  return (
    <Alert status={props.status || 'error'}>
      <AlertIcon />
      {props.children}
    </Alert>
  );
}

export default MessageBox;
