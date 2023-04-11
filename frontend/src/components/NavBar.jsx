import {
  Flex,
  Box,
  Spacer,
  IconButton,
  Avatar,
  AvatarBadge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ChatIcon, BellIcon } from '@chakra-ui/icons';
import SearchBox from './SearchBox';
import DropMenu from './DropMenu';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function NavBar({ socket }) {
  const { userInfo } = useSelector((state) => state.user);
  const [notify, setNotify] = useState([]);
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
    socket.on('notify:read', notifieListener);
    socket.on('notify:delete', deleteNotifieListener);
    socket.emit('notify:read', userInfo._id);

    return () => {
      socket.off('notify:read', notifieListener);
      socket.off('notify:delete', deleteNotifieListener);
    };
  }, [socket]);

  return (
    <Flex padding={[2, 5]}>
      <a href="/">
        <Avatar
          h="10"
          w="10"
          name="HBook"
          src="https://res-console.cloudinary.com/dmh5zjb5c/thumbnails/v1/image/upload/v1680598139/bG9nb19kMmRoMWk=/as_is"
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
          <MenuButton
            as={IconButton}
            aria-label="Setting"
            icon={<BellIcon />}
            variant="outline"
            borderRadius={'full'}
            colorScheme="teal"
          />
          <MenuList maxWidth="360px" maxHeight="500px" overflow={'scroll'}>
            <Heading as="h4" size="md" margin={3}>
              Thông báo
            </Heading>
            <MenuGroup title="Mới" fontSize={17}>
              {notify ? (
                [...notify].map((notifie) => (
                  <MenuItem key={notifie.data.payload}>
                    <Flex w={'full'} flexWrap={'wrap'}>
                      <Box>
                        <Avatar>
                          <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                      </Box>
                      <Box flex="1" marginLeft={2}>
                        <Text fontSize="sm">{notifie.data.payload}</Text>
                        <Text fontSize="xs">{notifie.data.sender}</Text>
                      </Box>
                    </Flex>
                  </MenuItem>
                ))
              ) : (
                <div>loading...</div>
              )}
            </MenuGroup>
            <MenuGroup title="Trước đó" fontSize={17}>
              <MenuItem>
                <Flex w={'full'}>
                  <Box>
                    <Avatar>
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </Avatar>
                  </Box>
                  <Box flex="1" marginLeft={2}>
                    <Text fontSize="sm">(sm) In love with React & Next</Text>
                    <Text fontSize="xs">19 giờ trước</Text>
                  </Box>
                </Flex>
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <DropMenu />
      </Box>
    </Flex>
  );
}
