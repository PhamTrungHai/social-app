import { forwardRef } from 'react';
import {
  VStack,
  Stack,
  Text,
  Box,
  Avatar,
  AvatarBadge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Input,
  Icon,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import TabItems from '../components/TabItems';
import { IoMdImages } from 'react-icons/io';
import { RiGhostSmileFill, RiSendPlane2Fill } from 'react-icons/ri';
import ChatBubble from '../components/ChatBubble';

const TextInput = forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

const Form = ({ firstFieldRef, onCancel }) => {
  return (
    <Stack spacing={4}>
      <TextInput
        label="First name"
        id="first-name"
        ref={firstFieldRef}
        defaultValue="John"
      />

      <Button colorScheme="teal">Save</Button>
    </Stack>
  );
};

function ChatTab() {
  return (
    <VStack spacing={'-0.5'} align="stretch">
      <Popover placement="top" closeOnBlur={false}>
        <PopoverTrigger>
          <TabItems tabImage={'AAA'} tabName={'AAA'} />
        </PopoverTrigger>
        <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
          <PopoverHeader
            pt={4}
            fontWeight="bold"
            display={'flex'}
            alignItems={'center'}
          >
            <Avatar
              marginRight={'1'}
              size={'sm'}
              name="Kent Dodds"
              src="https://bit.ly/kent-c-dodds"
            >
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            UserName
          </PopoverHeader>

          <PopoverCloseButton />
          <PopoverBody height={'sm'}>
            <ChatBubble />
          </PopoverBody>
          <PopoverFooter
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pb={4}
          >
            <Icon margin={1} as={IoMdImages} w={6} h={6} color="red.500" />
            <InputGroup>
              <InputRightElement
                children={
                  <Icon as={RiGhostSmileFill} w={6} h={6} color="red.500" />
                }
              />
              <Input
                variant="filled"
                placeholder="Filled"
                borderRadius={'3xl'}
              />
            </InputGroup>
            <Icon
              margin={1}
              as={RiSendPlane2Fill}
              w={6}
              h={6}
              color="red.500"
            />
          </PopoverFooter>
        </PopoverContent>
        <PopoverAnchor>
          <Input
            bottom={0}
            right={'28'}
            position={'fixed'}
            w="auto"
            height={'0.5'}
            display="inline-flex"
          />
        </PopoverAnchor>
      </Popover>
    </VStack>
  );
}

export default ChatTab;
