import { useState, useLayoutEffect, memo } from 'react';
import {
  Box,
  Avatar,
  Text,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Icon,
} from '@chakra-ui/react';
import Posts from '../components/Posts';
import TabItems from '../components/TabItems';
import { MdOutlinePostAdd } from 'react-icons/md';
import { IoMdImages } from 'react-icons/io';

function PostTab(props) {
  let [value, setValue] = useState('');
  const { userInfo } = props;
  const [userName, setUserName] = useState(userInfo.name);
  const [userImg, setUserImg] = useState(userInfo.avatarURL);

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  useLayoutEffect(() => {
    const tx = document.getElementsByTagName('textarea');
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        'style',
        'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;'
      );
      tx[i].addEventListener('input', OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = this.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <VStack spacing={4} align="stretch">
      <Box
        bg="whitesmoke"
        p={4}
        color="black"
        display={'flex'}
        alignItems={'center'}
        borderRadius="lg"
      >
        <Avatar size="md" name={userName} src={userImg} />
        <Button
          onClick={onOpen}
          marginLeft={3}
          colorScheme="blackAlpha"
          width="90%"
          borderRadius={'2xl'}
        >
          <Text fontSize="md">Hi {userName},What are you thinking?</Text>
        </Button>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              borderBottom={'1px'}
              textAlign={'center'}
              as={'b'}
              fontWeight={'bold'}
            >
              Tạo bài viết
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TabItems tabName={userName} tabImage={userName} />
              <Input
                marginTop={3}
                value={value}
                as={'textarea'}
                variant="unstyled"
                minHeight={'12'}
                maxHeight={'60'}
                onChange={handleInputChange}
                placeholder={`Hi ${userName}, What are you thinking?`}
                size="md"
                resize={'none'}
              />
              <Icon as={IoMdImages} w={8} h={8} color="red.500" />
            </ModalBody>
            <ModalFooter>
              <Button
                width={'full'}
                onClick={onClose}
                variant="solid"
                colorScheme="teal"
                leftIcon={<MdOutlinePostAdd />}
              >
                Đăng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box h="40px">
        <Posts />
      </Box>
    </VStack>
  );
}

export default memo(PostTab);
