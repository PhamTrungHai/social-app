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
import { ChatIcon, BellIcon, Search2Icon } from '@chakra-ui/icons';
import DropMenu from './DropMenu';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import useNotify from '../hooks/useNotify';
import { notificationType } from '../utils/Enum';

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
  const [
    data,
    isLoading,
    newNotify,
    count,
    isResponse,
    debounce,
    setDebounce,
    requestHandler,
    postNotify,
    getNoteType,
  ] = useNotify(socket, userInfo);

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

        <Menu isLazy>
          <Box>
            <NotifyBubble count={count} />
            <MenuButton
              as={IconButton}
              aria-label="Notification"
              icon={<BellIcon />}
              variant="outline"
              borderRadius={'full'}
              colorScheme="teal"
              onClick={() => {
                setDebounce(!debounce);
              }}
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
                        {notifie.type == notificationType.FRIEND_REQUESTED &&
                        isResponse ? (
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
                                  notificationType.FRIEND_ACCEPTED
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
                                  notificationType.FRIEND_DELETED
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
                        {notifie.type == notificationType.FRIEND_REQUESTED &&
                        isResponse ? (
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
                                  notificationType.FRIEND_ACCEPTED
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
                                  notificationType.FRIEND_DELETED
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
