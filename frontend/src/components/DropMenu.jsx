import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  SettingsIcon,
  EditIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';
import { HiOutlineLogout } from 'react-icons/hi';
import { userSignOut } from '../slices/userSlice';

function DropMenu() {
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(userSignOut());
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Setting"
        icon={<HamburgerIcon />}
        variant="outline"
        borderRadius={'full'}
        colorScheme="teal"
      />
      <MenuList>
        <MenuItem icon={<SettingsIcon w={6} h={6} />}>Setting</MenuItem>
        <MenuItem icon={<ExternalLinkIcon w={6} h={6} />}>New Window</MenuItem>
        <MenuItem icon={<EditIcon w={6} h={6} />}>Open File...</MenuItem>
        <MenuItem
          icon={<Icon as={HiOutlineLogout} w={6} h={6} />}
          onClick={signoutHandler}
        >
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default DropMenu;
