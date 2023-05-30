import React from 'react';
import NavGrid from './NavGrid';
import ChatGrid from './ChatGrid';
import PostGrid from './PostGrid';
import { Grid, GridItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

function HomeTab() {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={4} h="full" marginTop={4}>
      <GridItem colSpan={2} marginLeft={'2.5'} marginRight={'2.5'}>
        <NavGrid userInfo={userInfo} />
      </GridItem>
      <GridItem colSpan={4} overflow={'scroll'}>
        <PostGrid userInfo={userInfo} />
      </GridItem>
      <GridItem colSpan={2} marginLeft={'2.5'} marginRight={'2.5'}>
        <ChatGrid />
      </GridItem>
    </Grid>
  );
}

export default HomeTab;
