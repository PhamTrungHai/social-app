import { useRef, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Button,
  ButtonGroup,
  Box,
  HStack,
  Heading,
  Text,
  AvatarGroup,
  Avatar,
  IconButton,
  useDisclosure,
  Input,
  InputGroup,
  FormLabel,
  FormControl,
  ModalFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { TiCamera } from 'react-icons/ti';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';
import axios from 'axios';
import MessageBox from './MessageBox';
import { statusSlice } from '../slices/statusSlice';
import CarouselTab from '../layouts/CarouselTab';

function UserAvatar(props) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { UPDATE } = useSelector((state) => state.status);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgURL, setImgURL] = useState('');

  const [isOpenAlert, setisOpenAlert] = useState(false);
  function onOpenAlert() {
    setisOpenAlert(true);
  }
  function onCloseAlert() {
    setisOpenAlert(false);
  }

  const cancelRef = useRef();
  const [posting, setPosting] = useState(false);
  const [value, setValue] = useState('');
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/users/${userInfo._id}`,
        {
          _id: userInfo._id,
          avatarURL: userInfo.avatarURL,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      setImgURL(userInfo.avatarURL);
      onClose();
      setPosting(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Grid
      templateAreas={`"col1 col2 "`}
      templateColumns={'190px 1px'}
      justifyContent={'start'}
      alignItems={'center'}
    >
      <GridItem>
        <Image
          m={2}
          border={'4px'}
          borderColor={'whatsapp.200'}
          _hover={{ opacity: 0.8, transition: '0.3s ease' }}
          transform={'auto'}
          translateY={'-20px'}
          borderRadius="full"
          boxSize="160px"
          objectFit={'cover'}
          src={imgURL || props.picURL}
          fallbackSrc="https://via.placeholder.com/160"
          alt="User"
        />
      </GridItem>
      {props.isSender && (
        <GridItem>
          <IconButton
            onClick={() => {
              onOpen();
            }}
            transform={'auto'}
            translateY={'40px'}
            translateX={'-65px'}
            variant="solid"
            size={'md'}
            borderRadius={'full'}
            colorScheme="teal"
            aria-label="Change Picture"
            icon={<TiCamera />}
          />
        </GridItem>
      )}
      {props.isSender && (
        <Modal onClose={onClose} size={'3xl'} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent bgColor={'whatsapp.200'}>
            <ModalHeader textAlign={'center'} borderBottomWidth={'thin'}>
              <Heading as={'h3'} size={'md'}>
                Cập nhật ảnh đại diện
              </Heading>
            </ModalHeader>
            <ModalCloseButton borderRadius={'full'} />
            <ModalBody>
              {UPDATE ? (
                <MessageBox status="loading">Updating...</MessageBox>
              ) : posting ? (
                <FormControl marginTop={2}>
                  <Input
                    value={value}
                    as={'textarea'}
                    placeholder={'Mô tả'}
                    // _placeholder={{
                    //   transition: '0.5s ease',
                    //   transformOrigin: 'left top',
                    //   transform: 'scale(0.)',
                    // }}
                    variant="outline"
                    minHeight={'12'}
                    maxHeight={'60'}
                    w="full"
                    resize={'none'}
                    onChange={handleInputChange}
                  />
                  <Box
                    display={'flex'}
                    padding={8}
                    w="full"
                    justifyContent={'center'}
                  >
                    <Image
                      width={'550px'}
                      height={'300px'}
                      objectFit={'cover'}
                      src={userInfo.avatarURL}
                      alt="user"
                    />
                  </Box>
                </FormControl>
              ) : (
                <CarouselTab
                  onChange={() => {
                    setPosting(true);
                  }}
                />
              )}
            </ModalBody>
            {posting && (
              <ModalFooter borderTopWidth={'thin'}>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onCloseAlert}
                  isOpen={isOpenAlert}
                  isCentered
                >
                  <AlertDialogOverlay />

                  <AlertDialogContent>
                    <AlertDialogHeader
                      textAlign={'center'}
                      borderBottomWidth={'thin'}
                    >
                      Bỏ thay đổi?
                    </AlertDialogHeader>
                    <AlertDialogCloseButton borderRadius={'full'} />
                    <AlertDialogBody>
                      Bạn có chắc chắn muốn bỏ các thay đổi không?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button
                        variant="ghost"
                        colorScheme="teal"
                        ref={cancelRef}
                        onClick={onCloseAlert}
                      >
                        Hủy
                      </Button>
                      <Button colorScheme="teal" ml={3} onClick={onClose}>
                        Bỏ
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <ButtonGroup spacing="2" colorScheme="teal">
                  <Button variant="ghost" onClick={onOpenAlert}>
                    Hủy
                  </Button>
                  <Button onClick={submitHandler}>Lưu</Button>
                </ButtonGroup>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </Grid>
  );
}

export default UserAvatar;
