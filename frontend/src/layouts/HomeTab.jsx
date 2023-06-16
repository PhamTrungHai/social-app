import React from 'react';
import NavGrid from './NavGrid';
import ChatGrid from './ChatGrid';
import PostGrid from './PostGrid';
import { Grid, Box, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

function HomeTab({ socket }) {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <Flex gap={4} h="full" m={2} marginTop={4}>
      <Box
        width={'20%'}
        marginLeft={'2.5'}
        marginRight={'2.5'}
        sx={{
          '@media screen and (max-width: 600px)': {
            display: 'none',
          },
        }}
      >
        <NavGrid userInfo={userInfo} />
      </Box>
      <Box
        width={'60%'}
        overflow={'scroll'}
        sx={{
          '@media screen and (max-width: 600px)': {
            width: '100%',
          },
        }}
      >
        <PostGrid userInfo={userInfo} socket={socket} />
      </Box>
      <Box
        width={'20%'}
        marginLeft={'2.5'}
        marginRight={'2.5'}
        sx={{
          '@media screen and (max-width: 600px)': {
            display: 'none',
          },
        }}
      >
        <ChatGrid />
      </Box>
    </Flex>
  );
}

export default HomeTab;
