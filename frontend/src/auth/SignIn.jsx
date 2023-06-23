import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSignIn } from '../slices/userSlice';
import Axios from '../utils/axios.js';
import { toast } from 'react-toastify';

import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Center,
  InputGroup,
  InputLeftElement,
  Button,
} from '@chakra-ui/react';

function SignIn() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [email, setEmail] = useState('');
  const [pswd, setPswd] = useState('');
  const isError = email === '';

  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post(`api/users/signin`, {
        email,
        pswd,
      });
      console.log(data);
      dispatch(userSignIn(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(err, {
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
              children={<LockIcon color="whatsapp.400" />}
            />
            <Input
              type="password"
              value={pswd}
              onChange={(e) => {
                setPswd(e.target.value);
              }}
            />
          </InputGroup>
        </FormControl>
        <Center marginTop={6}>
          <Button type="submit" colorScheme="whatsapp" color={'teal.800'}>
            Sign In
          </Button>
        </Center>
      </form>
    </div>
  );
}

export default SignIn;
