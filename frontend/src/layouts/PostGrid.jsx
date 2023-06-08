import { useState, useLayoutEffect, memo, useRef, useEffect } from 'react';
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
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  InputGroup,
  IconButton,
  Image,
  Icon,
} from '@chakra-ui/react';
import Posts from '../components/Posts';
import TabItems from '../components/TabItems';
import {
  MdOutlinePostAdd,
  MdOutlineClose,
  MdOutlineFace,
} from 'react-icons/md';
import { IoMdImages } from 'react-icons/io';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';
import axios from 'axios';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function PostTab(props) {
  const { userInfo } = props;
  const inputRef = useRef();
  let [value, setValue] = useState('');
  let [images, setImages] = useState('');
  let [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const { data } = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      toast.success('Post created successfully');
      setValue('');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImages(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setImages('');
    inputRef.current.value = '';
  };

  function handleClickOutside(event) {
    const emojiPicker = document.querySelector('em-emoji-picker');
    if (emojiPicker) {
      const isClickInsideEmojiPicker = emojiPicker.contains(event.target);

      if (!isClickInsideEmojiPicker) {
        const modalClass = '#chakra-modal-\\:r3\\:';
        const modal = document.querySelector(modalClass);
        modal.removeEventListener('click', handleClickOutside);
        setShowEmojiPicker((prevState) => !prevState);
      }
    }
  }

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
    if (setShowEmojiPicker) {
      const modalClass = '#chakra-modal-\\:r3\\:';
      const modal = document.querySelector(modalClass);
      modal.addEventListener('click', handleClickOutside);
    }
  };

  // const handleSelectEmoji = () => {};

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
        <Avatar size="md" name={userInfo.name} src={userInfo.avatarURL} />
        <Button
          onClick={onOpen}
          marginLeft={3}
          p={1}
          colorScheme="blackAlpha"
          width="90%"
          borderRadius={'2xl'}
          fontSize={'sm'}
          sx={{
            '@media screen and (min-width: 800px)': {
              fontSize: 'md',
            },
          }}
        >
          New Post
        </Button>
        <Modal size={'md'} onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent borderRadius={'2xl'}>
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
              <TabItems tabName={userInfo.name} tabImage={userInfo.name} />
              <form onSubmit={handleSubmit}>
                <Input
                  marginTop={3}
                  name="content"
                  value={value}
                  as={'textarea'}
                  variant="unstyled"
                  minHeight={'12'}
                  maxHeight={'56'}
                  onChange={handleInputChange}
                  placeholder={`Hi ${userInfo.name}, What are you thinking?`}
                  _placeholder={{ opacity: 1, color: 'gray.500' }}
                  size="md"
                  resize={'none'}
                />
                <InputGroup w={'fit-content'} gap={2} position={'relative'}>
                  <Input
                    // multiple={true}
                    name="images"
                    type="file"
                    id="avatar-pic"
                    ref={inputRef}
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  <IconButton
                    as={IoMdImages}
                    w={8}
                    h={8}
                    color="red.500"
                    onClick={handleClick}
                  />
                  {showEmojiPicker && (
                    <Box position={'absolute'} top={'100%'}>
                      <Picker
                        data={data}
                        onEmojiSelect={(data, e) => {
                          setValue(value + data.native);
                        }}
                        onClickOutside={console.log}
                        maxFrequentRows={0}
                        searchPosition={'none'}
                        previewPosition={'none'}
                        perLine={8}
                      />
                    </Box>
                  )}
                  <IconButton
                    as={MdOutlineFace}
                    w={8}
                    h={8}
                    color="red.500"
                    onClick={handleToggleEmojiPicker}
                  />
                </InputGroup>
                {images && (
                  <Box
                    display={'flex'}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={'lg'}
                    marginY={4}
                    p={2}
                    border={'1px'}
                    position={'relative'}
                  >
                    <IconButton
                      position={'absolute'}
                      top={2}
                      right={2}
                      onClick={handleClose}
                      icon={<MdOutlineClose />}
                      borderRadius={'full'}
                      color={'blackAlpha.900'}
                      zIndex={1}
                    />
                    <Image
                      src={images}
                      alt="attachments"
                      sx={{
                        aspectRatio: '16/9',
                      }}
                      objectFit={'contain'}
                      borderRadius={'md'}
                    />
                  </Box>
                )}
                <Button
                  type="submit"
                  width={'full'}
                  marginTop={3}
                  onClick={onClose}
                  variant="solid"
                  colorScheme="teal"
                  leftIcon={<MdOutlinePostAdd />}
                >
                  Đăng
                </Button>
              </form>
            </ModalBody>
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
