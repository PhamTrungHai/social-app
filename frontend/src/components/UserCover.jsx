import { useEffect, useRef, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  GridItem,
  Container,
  Box,
  Center,
  Image,
  Button,
  ButtonGroup,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import { TiCamera } from 'react-icons/ti';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';
import axios from 'axios';
import { statusSlice } from '../slices/statusSlice';
import { userSlice } from '../slices/userSlice';

function UserCover(props) {
  const [imgURL, setImgURL] = useState('');
  const [positionY, setPositionY] = useState(0);
  const dispatch = useDispatch();
  const { userInfo } = props;
  const inputRef = useRef();
  const [editing, setEditing] = useState(false);

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const bodyFormData = new FormData();
      bodyFormData.append('avatar', file);
      try {
        dispatch(statusSlice.actions.UPDATE_REQUEST());
        const { data } = await axios.post('/api/upload', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        setImgURL(data.secure_url);
        setEditing(true);
        setPositionY(50);
        dispatch(statusSlice.actions.UPDATE_SUCCESS());
        toast.success('Image uploaded successfully');
        dispatch(userSlice.actions.editCoverPic(data.secure_url));
      } catch (err) {
        dispatch(statusSlice.actions.UPDATE_FAIL(err));
        toast.error(getError(err));
      }
    } else {
      toast.warning('No image chosen');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/users/${userInfo._id}`,
        {
          _id: userInfo._id,
          coverURL: { URL: userInfo.coverURL, position: positionY },
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setEditing(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const cancelHandler = () => {
    setImgURL('');
    setEditing(false);
    setPositionY(0);
    inputRef.current.value = '';
  };

  return (
    <GridItem>
      <Center position={'relative'}>
        {props.isSender && editing && (
          <ButtonGroup
            position={'absolute'}
            top={0}
            justifyContent={'flex-end'}
            alignItems={'center'}
            width={'full'}
            h={'16'}
            bg={'blackAlpha.400'}
            spacing="6"
            paddingRight={6}
          >
            <Button
              variant={'solid'}
              w={'24'}
              colorScheme="whiteAlpha"
              onClick={cancelHandler}
            >
              Hủy
            </Button>
            <Button
              variant={'solid'}
              colorScheme="teal"
              onClick={submitHandler}
            >
              Lưu thay đổi
            </Button>
          </ButtonGroup>
        )}
        {props.isSender && editing && (
          <Button
            top="10px"
            position={'absolute'}
            leftIcon={<ArrowUpIcon />}
            colorScheme="teal"
            variant="ghost"
            onClick={() => {
              if (positionY > 0) setPositionY(positionY - 50);
            }}
          />
        )}
        {props.isSender && editing && (
          <Button
            bottom="10px"
            position={'absolute'}
            leftIcon={<ArrowDownIcon />}
            colorScheme="teal"
            variant="ghost"
            onClick={() => {
              if (positionY < 600) setPositionY(positionY + 50);
            }}
          />
        )}
        <Box
          display={'flex'}
          h={'96'}
          w={'5xl'}
          alignItems={'flex-end'}
          justifyContent={'flex-end'}
          borderBottomRadius={'lg'}
          background={'blackAlpha.400'}
          backgroundImage={`${imgURL || props.bgURL}`}
          backgroundPosition={`center -${positionY || props.bgPosition}px`}
          backgroundSize="cover"
          backgroundRepeat={'no-repeat'}
        >
          {props.isSender && (
            <InputGroup w={'fit-content'}>
              <Input
                onChange={handleChange}
                multiple={false}
                type="file"
                id="avatar-pic"
                ref={inputRef}
                accept="image/*"
                hidden
              />

              <Button
                onClick={handleClick}
                marginBottom={4}
                marginRight={8}
                leftIcon={<TiCamera />}
                colorScheme="teal"
                variant="solid"
              >
                Thêm ảnh bìa
              </Button>
            </InputGroup>
          )}
        </Box>
      </Center>
    </GridItem>
  );
}

export default memo(UserCover);
