import React from 'react';
import {
  Grid,
  GridItem,
  Image,
  Button,
  ButtonGroup,
  Box,
  HStack,
  Heading,
} from '@chakra-ui/react';

function Carousel(props) {
  return (
    <GridItem marginTop={props.mt}>
      <Heading as={'h4'} size={'sm'} w={'full'}>
        {props.heading}
      </Heading>
      <HStack
        w={'full'}
        marginTop={2}
        borderRadius="xl"
        justifyContent={'space-between'}
        overflow="hidden"
      >
        {props.imgArray.map((url) => (
          <Box>
            <Image
              _hover={{ opacity: 0.5, transition: '0.5s ease' }}
              src={url}
              key={url}
              alt="User Image"
              w="108px"
              h="110px"
              objectFit="cover"
            />
          </Box>
        ))}
      </HStack>
      <Button colorScheme="whatsapp" variant="solid" w={'full'} marginTop={'4'}>
        Xem thêm
      </Button>
    </GridItem>
  );
}

export default Carousel;
