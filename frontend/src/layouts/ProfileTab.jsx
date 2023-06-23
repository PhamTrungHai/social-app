import { useState } from 'react';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Center,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { BsMessenger } from 'react-icons/bs';
import { IoPersonAdd } from 'react-icons/io5';
import { MdBuild } from 'react-icons/md';
import '../styles/ProfileTab.css';
import UserAvatar from '../components/UserAvatar';
import UserInfo from '../components/UserInfo';
import UserCover from '../components/UserCover';

import { statusSlice } from '../slices/statusSlice';
import { userSlice } from '../slices/userSlice';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';
import axios from '../utils/axios.js';
import { useNavigate, useParams } from 'react-router-dom';
import { notificationType } from '../utils/Enum.js';
import useNotify from '../hooks/useNotify';

function ProfileTab({ socket }) {
  const params = useParams();
  const { id: userId } = params;
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [curUser, setCurUser] = useState({});
  const [isFriend, setIsFriend] = useState('no');
  const [
    notifyData,
    notifyIsLoading,
    newNotify,
    count,
    isResponse,
    debounce,
    setDebounce,
    requestHandler,
    postNotify,
  ] = useNotify(socket, userInfo);

  const fetcher = (url, token) => {
    dispatch(statusSlice.actions.FETCH_REQUEST());
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((data) => {
        const isSender = data.status == 'user';
        setIsFriend(data.status);
        setCurUser({ ...data, isSender });
        dispatch(statusSlice.actions.FETCH_SUCCESS());
        dispatch(userSlice.actions.viewUserProfile(curUser));
      })
      .catch((err) => {
        dispatch(statusSlice.actions.FETCH_FAIL(err));
        toast.error(getError(err));
      });
  };

  const { data, error, isLoading } = useSWR(
    [`api/users/${userId}`, userInfo.token],
    ([url, token]) => fetcher(url, token)
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      postNotify(userId, notificationType.FRIEND_REQUESTED);
      setIsFriend(data.state);
      toast.success(data.message);
      socket.emit('notify:create', curUser._id, 'FRIEND-REQUESTED', dateStr);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const friendRequestHandler = async (choice, type) => {
    try {
      requestHandler(userId, choice, type);
      setIsFriend(data.status);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Grid templateColumns={'1fr'}>
      <GridItem bg={'whatsapp.200'}>
        <Grid templateColumns={'1fr'}>
          <UserCover
            userInfo={userInfo}
            bgURL={curUser.coverURL ? curUser.coverURL.URL : ''}
            bgPosition={curUser.coverURL ? curUser.coverURL.position : 0}
            isSender={curUser.isSender || false}
          />
          <GridItem>
            <Center>
              <Box width={'60rem'} borderBottomWidth={'thin'}>
                <Grid
                  templateAreas={`"col1 col3 col4"`}
                  templateColumns={'190px 320px 1fr'}
                  justifyContent={'start'}
                  alignItems={'center'}
                >
                  <GridItem>
                    <UserAvatar
                      userInfo={userInfo}
                      picURL={curUser.avatarURL || ''}
                      isSender={curUser.isSender || false}
                    />
                  </GridItem>
                  <GridItem>
                    <UserInfo userInfo={userInfo} userName={curUser.name} />
                  </GridItem>
                  <GridItem>
                    <ButtonGroup
                      display={'flex'}
                      gap="1"
                      w={'full'}
                      justifyContent={'flex-end'}
                      alignItems={'flex-end'}
                      height={'118.2px'}
                    >
                      {curUser.isSender && (
                        <Button
                          leftIcon={<AddIcon />}
                          colorScheme="teal"
                          variant="solid"
                        >
                          Thêm vào tin
                        </Button>
                      )}
                      {curUser.isSender && (
                        <Button
                          leftIcon={<MdBuild />}
                          colorScheme="teal"
                          variant="outline"
                        >
                          Chỉnh sửa trang cá nhân
                        </Button>
                      )}

                      {isFriend == 'requesting' ? (
                        <Menu>
                          <MenuButton
                            as={Button}
                            colorScheme="teal"
                            rightIcon={<ChevronDownIcon />}
                          >
                            Đã gửi lời mời kết bạn
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                friendRequestHandler(
                                  'cancel',
                                  notificationType.FRIEND_DELETED
                                )
                              }
                            >
                              Thu hồi lời mời
                            </MenuItem>
                            <MenuItem>Bỏ theo dõi</MenuItem>
                          </MenuList>
                        </Menu>
                      ) : isFriend == 'requested' ? (
                        <Menu>
                          <MenuButton
                            as={Button}
                            colorScheme="teal"
                            rightIcon={<ChevronDownIcon />}
                          >
                            Chấp nhận lời mới kết bạn
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                friendRequestHandler(
                                  'accept',
                                  notificationType.FRIEND_ACCEPTED
                                )
                              }
                            >
                              Chấp nhập lời mời kết bạn
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                friendRequestHandler(
                                  'decline',
                                  notificationType.FRIEND_DECLINED
                                )
                              }
                            >
                              Hủy
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      ) : (
                        curUser.isSender ||
                        isFriend == 'friend' || (
                          <Button
                            leftIcon={<IoPersonAdd />}
                            colorScheme="teal"
                            variant="solid"
                            onClick={submitHandler}
                          >
                            Thêm bạn bè
                          </Button>
                        )
                      )}
                      {curUser.isSender || (
                        <Button
                          leftIcon={<BsMessenger />}
                          colorScheme="teal"
                          variant="outline"
                        >
                          Nhắn tin
                        </Button>
                      )}
                    </ButtonGroup>
                  </GridItem>
                </Grid>
              </Box>
            </Center>
            <Center>
              <Box width={'60rem'}>
                <ButtonGroup marginTop={1}>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Bài viết
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Giới thiệu
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Bạn bè
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Ảnh
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Video
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Reels
                  </Button>
                  <Button
                    as={'a'}
                    href={'#'}
                    _hover={{ bg: ' rgb(140, 213, 156)' }}
                    h={'12'}
                    _activeLink={{ color: ' blue' }}
                    className="nav-link"
                    color={'black'}
                    colorScheme=""
                  >
                    Xem thêm
                  </Button>
                </ButtonGroup>
              </Box>
            </Center>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem height={'60vh'}>
        <Box />
      </GridItem>
    </Grid>
  );
}

export default ProfileTab;
