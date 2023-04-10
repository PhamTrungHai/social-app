import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSignIn } from '../slices/userSlice';

import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Center,
  InputGroup,
  InputLeftElement,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';

function SignUp() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pswd, setPswd] = useState('');
  const [cfmPswd, setCfmPswd] = useState('');
  const isError = email === '';

  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (pswd !== cfmPswd) {
      toast.error('Password do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        pswd,
      });
      console.log(data);
      dispatch(userSignIn(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err), {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <form onSubmit={submitHandler}>
        <FormControl isInvalid={isError}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="whatsapp.400" />}
            />
            <Input
              placeholder="abc123@.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </InputGroup>

          {!isError ? (
            <FormHelperText color={'whatsapp.400'}>
              Enter the email you'd like to receive the newsletter on.
            </FormHelperText>
          ) : (
            <FormErrorMessage>Email is required.</FormErrorMessage>
          )}

          <InputGroup marginTop={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<InfoIcon color="whatsapp.400" />}
            />
            <Input
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />{' '}
          </InputGroup>

          <InputGroup marginTop={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<LockIcon color="whatsapp.400" />}
            />
            <Input
              type="password"
              value={pswd}
              autoComplete={'password'}
              onChange={(e) => {
                setPswd(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup marginTop={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<LockIcon color="whatsapp.400" />}
            />
            <Input
              type="password"
              value={cfmPswd}
              autoComplete={'password'}
              onChange={(e) => {
                setCfmPswd(e.target.value);
              }}
            />
          </InputGroup>
        </FormControl>
        <Center marginTop={6}>
          <Button type="submit" colorScheme="whatsapp" color={'teal.800'}>
            Sign Up
          </Button>
        </Center>
      </form>
    </div>
  );
}

export default SignUp;
