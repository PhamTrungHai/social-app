import React from 'react';
import { Box, Avatar } from '@chakra-ui/react';

function ChatBubble() {
  return (
    <Box w="full" display={'flex'} flexDirection={'column'}>
      <Box w="full" display={'flex'} alignItems={'center'}>
        <Avatar
          marginRight={'1'}
          size="sm"
          name="Kent Dodds"
          src="https://bit.ly/kent-c-dodds"
        />
        <Box
          marginBottom={1}
          flexWrap={'wrap'}
          bg="tomato"
          w="fit-content"
          p={2}
          color="white"
          borderRadius={'2xl'}
        >
          This is the Box
        </Box>
      </Box>
      <Box
        display={'flex'}
        alignSelf={'end'}
        marginBottom={1}
        flexWrap={'wrap'}
        bg="tomato"
        w="fit-content"
        p={2}
        color="white"
        borderRadius={'2xl'}
      >
        This is the Box
      </Box>
    </Box>
  );
}

export default ChatBubble;
