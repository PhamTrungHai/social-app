import {
  Flex,
  Box,
  Spacer,
  IconButton,
  Avatar,
  AvatarBadge,
  InputGroup,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Heading,
  Text,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { ChatIcon, BellIcon, Search2Icon } from '@chakra-ui/icons';
import DropMenu from './DropMenu';
import { useSelector } from 'react-redux';
import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getTimePassed, getCurrentTime } from '../utils/dateUtil';
import { getError } from '../utils/getError.js';

const SearchBox = memo(() => {
  return (
    <InputGroup width={300}>
      <IconButton
        colorScheme="gray"
        aria-label="Search database"
        icon={<Search2Icon />}
      />
      <Input type="text" placeholder="Search..." />
    </InputGroup>
  );
});

const NotifyBubble = memo(({ count }) => {
  const display = count > 0 ? 'block' : 'none';
  return (
    <Text
      className="notify-bubble animate__animated animate__bounceIn"
      position={'absolute'}
      fontSize="sm"
      backgroundColor={'red'}
      color="white"
      zIndex={1}
      display={display}
      marginLeft={6}
      marginTop={-2}
      w={6}
      h={6}
      borderRadius={'full'}
      textAlign={'center'}
      fontWeight={'extrabold'}
    >
      {count}
    </Text>
  );
});

function NavBar({ socket }) {
  const { userInfo } = useSelector((state) => state.user);
  const [notify, setNotify] = useState([]);
  const [newNotify, setNewNotify] = useState([]);
  const [isResponse, setIsResponse] = useState(true);
  const [count, setCount] = useState(0);
  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .then((resdata) => {
        if (resdata.length > 0) {
          var isViewed = 0;
          resdata.map((item) => {
            const newType = getNoteType(item.type);
            const timePassed = getTimePassed(item.date);
            item.data.payload = `${item.data.sender.name} ${newType}`;
            item.date = timePassed;
            if (item.isViewed === false) {
              isViewed++;
            }
          });
          setCount(isViewed);
        }
        return resdata;
      });

  const { data, error, isLoading } = useSWR(
    `/api/social/notify/${userInfo._id}`,
    (url) => fetcher(url)
  );

  const getNoteType = (type) => {
    switch (type) {
      case 'FRIEND-REQUESTED':
        return 'đã gửi cho bạn một lời mời kết bạn';
      case 'FRIEND-ACCEPTED':
        return 'đã chấp nhận lời mời kết bạn của bạn';
      case 'FRIEND-ADDED':
        return 'đã thêm bạn vào danh sách bạn bè';
      default:
        return 'đã gửi cho bạn một lời mời kết bạn';
    }
  };

  const onReceiveNotify = (user, type, date) => {
    const newType = getNoteType(type);
    const timePassed = getTimePassed(date);
    setNewNotify([
      {
        userId: user?.id,
        data: {
          sender: { name: user?.name, avatar: user?.avatar },
          payload: `${user?.name} ${newType}`,
        },
        time: timePassed,
        type: type,
      },
      ...newNotify,
    ]);
    setCount(count + 1);
  };

  useEffect(() => {
    const notifieListener = (notiList) => {
      setNotify([...notiList]);
    };

    const deleteNotifieListener = (notifieID) => {
      setNotify((prevNotifies) => {
        const newNotifies = { ...prevNotifies };
        delete newNotifies[notifieID];
        return newNotifies;
      });
    };
    // socket.on('notify:read', notifieListener);
    socket.on('notify:receive', onReceiveNotify);
    // socket.on('notify:delete', deleteNotifieListener);

    return () => {
      // socket.off('notify:read', notifieListener);
      socket.off('notify:receive', onReceiveNotify);
      // socket.off('notify:delete', deleteNotifieListener);
    };
  }, [socket]);

  const requestHandler = async (userId, choice, type) => {
    try {
      const dateStr = getCurrentTime();
      const { data } = await axios.put(
        `/api/social/response/${userId}`,
        {
          _id: userInfo._id,
          type: type,
          payload: `${choice} ${userInfo._id} friend request`,
          reply: choice,
          date: dateStr,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      socket.emit('notify:create', userId, type, dateStr);
      setIsResponse(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err);
    }
  };

  const getNotifyDebounce = debounce((socket) => {
    socket.emit('notify:read', userInfo._id);
  });

  function debounce(cb, delay = 2000) {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  const clearNotify = async () => {
    const notifyIds = data.filter((item) => {
      if (item.isViewed == false) {
        return item.id;
      }
    });
    try {
      const { data } = await axios.patch(
        `/api/social/notify/${userInfo._id}`,
        {
          notifyArray: notifyIds,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setCount(0);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Flex padding={[2, 5]}>
      <a href="/">
        <Avatar
          h="10"
          w="10"
          name="HBook"
          src="https://res.cloudinary.com/dmh5zjb5c/image/upload/v1680598139/logo_d2dh1i.png"
          marginRight="2"
        />
      </a>
      <SearchBox />
      <Spacer />
      <Box w="170px" h="10">
        <a href="abc.com" target={'_blank'}></a>
      </Box>
      <Spacer />
      <Box w="170px" h="10" display={'flex'} justifyContent={'right'} gap={2}>
        <a href="abc.com" target={'_blank'}>
          <IconButton
            variant="outline"
            borderRadius={'full'}
            colorScheme="teal"
            icon={<ChatIcon />}
          />
        </a>

        <Menu isLazy onOpen={clearNotify}>
          <Box>
            <NotifyBubble count={count} />
            <MenuButton
              as={IconButton}
              aria-label="Notification"
              icon={<BellIcon />}
              variant="outline"
              borderRadius={'full'}
              colorScheme="teal"
              onClick={() => socket.emit('notify:read', userInfo._id)}
            />
          </Box>
          <MenuList maxWidth="360px" maxHeight="500px" overflow={'scroll'}>
            <Heading as="h4" size="md" margin={3}>
              Thông báo
            </Heading>
            {newNotify.length != 0 ? (
              <MenuGroup title="Mới" fontSize={17}>
                {[...newNotify].map((notifie) => (
                  <MenuItem
                    key={notifie.data.payload}
                    as="a"
                    href={window.location.origin + '/' + notifie.userId}
                  >
                    <Flex w={'full'} flexWrap={'wrap'}>
                      <Box>
                        <Avatar src={notifie.data.sender.avatar}>
                          <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                      </Box>
                      <Box flex="1" marginLeft={2}>
                        <Text fontSize="sm">{notifie.data.payload}</Text>
                        <Text fontSize="xs">
                          {notifie.time >= 1
                            ? `${notifie.time} phút trước`
                            : `Vừa xong`}
                        </Text>
                        {notifie.type == 'FRIEND-REQUESTED' && isResponse ? (
                          <ButtonGroup
                            display={'flex'}
                            gap="1"
                            marginTop={2}
                            w={'full'}
                            justifyContent={'flex-start'}
                            alignItems={'flex-end'}
                          >
                            <Button
                              w={24}
                              colorScheme="teal"
                              variant="solid"
                              onClick={() => {
                                requestHandler(
                                  notifie.userId,
                                  'accept',
                                  'FRIEND-ACCEPTED'
                                );
                              }}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              w={24}
                              colorScheme="blackAlpha"
                              variant="solid"
                              onClick={() =>
                                requestHandler(
                                  notifie.userId,
                                  'decline',
                                  'FRIEND-DELETED'
                                )
                              }
                            >
                              Xóa
                            </Button>
                          </ButtonGroup>
                        ) : (
                          <div></div>
                        )}
                      </Box>
                    </Flex>
                  </MenuItem>
                ))}
              </MenuGroup>
            ) : (
              <Text fontSize="sm" textAlign="center">
                Bạn không có thông báo mới
              </Text>
            )}
            <MenuGroup title="Trước đó" fontSize={17}>
              {isLoading ? (
                <p>loading...</p>
              ) : data.length > 0 ? (
                data.map((notifie) => (
                  <MenuItem
                    key={notifie.data.payload}
                    as="a"
                    href={`${window.location.origin}/${notifie.data.sender.id}`}
                  >
                    <Flex w={'full'} flexWrap={'wrap'}>
                      <Box>
                        <Avatar src={notifie.data.sender.avatar}>
                          <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                      </Box>
                      <Box flex="1" marginLeft={2}>
                        <Text fontSize="sm">{`${
                          notifie.data.sender.name
                        } ${getNoteType(notifie.type)}`}</Text>
                        <Text fontSize="xs">{notifie.date}</Text>
                        {notifie.type == 'FRIEND-REQUESTED' && isResponse ? (
                          <ButtonGroup
                            display={'flex'}
                            gap="1"
                            marginTop={2}
                            w={'full'}
                            justifyContent={'flex-start'}
                            alignItems={'flex-end'}
                          >
                            <Button
                              w={24}
                              colorScheme="teal"
                              variant="solid"
                              onClick={() =>
                                requestHandler(
                                  notifie.data.sender.id,
                                  'accept',
                                  'FRIEND-ACCEPTED'
                                )
                              }
                            >
                              Xác nhận
                            </Button>
                            <Button
                              w={24}
                              colorScheme="blackAlpha"
                              variant="solid"
                              onClick={() =>
                                requestHandler(
                                  notifie.data.sender.id,
                                  'decline',
                                  'FRIEND-DELETED'
                                )
                              }
                            >
                              Xóa
                            </Button>
                          </ButtonGroup>
                        ) : (
                          <div></div>
                        )}
                      </Box>
                    </Flex>
                  </MenuItem>
                ))
              ) : (
                <Text fontSize="sm" textAlign="center">
                  Bạn chưa có thông báo nào
                </Text>
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
        <DropMenu />
      </Box>
    </Flex>
  );
}

export default memo(NavBar);
