import '../styles/LoginPage.css';
import { useEffect, useRef, useState } from 'react';
import { Box, Center, Text, VStack } from '@chakra-ui/react';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import 'animate.css';
import { animateCSS } from '../utils/animateCss';

function LogInPage() {
  const [slide, setSlide] = useState(false);
  const ref = useRef();
  const [animateClass, setAnimateClass] = useState(
    'animate__animated animate__flipInX'
  );
  const handlerSwitch = (slide) => {
    setAnimateClass('animate__animated animate__flipOutX');
    ref.current.click();
    setTimeout(() => {
      setAnimateClass('animate__animated animate__flipInX');
      setSlide(!slide);
    }, 500);
  };
  return (
    <VStack>
      <Center w="full" marginTop={10}>
        <Text
          fontWeight={'extrabold'}
          marginRight="14"
          onClick={() => {
            handlerSwitch(true);
          }}
        >
          SIGN IN
        </Text>
        <Text
          fontWeight={'extrabold'}
          marginLeft="14"
          onClick={() => handlerSwitch(false)}
        >
          SIGN UP
        </Text>
      </Center>
      <Center>
        <input
          className="checkbox"
          type="checkbox"
          id="reg-log"
          ref={ref}
          name="reg-log"
          value={slide}
          onChange={() => handlerSwitch(slide)}
        />
        <label htmlFor="reg-log"></label>
      </Center>
      <Center>
        <Box
          w="xl"
          p={8}
          backgroundColor="teal.800"
          backgroundImage={
            'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg'
          }
          backgroundRepeat="no-repeat"
          backgroundSize={'200%'}
          color={'whatsapp.400'}
          marginTop={'20'}
          border={'1px'}
          borderRadius="2xl"
          id="loginBox"
          className={animateClass}
        >
          <Center marginBottom={8}>
            <Text fontSize={'3xl'} fontWeight="extrabold">
              {slide ? 'Sign Up' : 'Sign In'}
            </Text>
          </Center>
          {slide ? <SignUp /> : <SignIn />}
        </Box>
      </Center>
    </VStack>
  );
}

export default LogInPage;
