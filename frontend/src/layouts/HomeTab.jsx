import React from 'react';
import NavGrid from './NavGrid';
import ChatGrid from './ChatGrid';
import PostGrid from './PostGrid';
import { Grid, GridItem, Container, Box, VStack, Flex } from '@chakra-ui/react';

function HomeTab() {
  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={4} h="full" marginTop={4}>
      <GridItem colSpan={2} marginLeft={'2.5'} marginRight={'2.5'}>
        <NavGrid />
      </GridItem>
      <GridItem colSpan={4} overflow={'scroll'}>
        <PostGrid />
      </GridItem>
      <GridItem colSpan={2} marginLeft={'2.5'} marginRight={'2.5'}>
        <ChatGrid />
      </GridItem>
    </Grid>
  );
}

export default HomeTab;
