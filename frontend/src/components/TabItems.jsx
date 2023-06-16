import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { SettingsIcon } from '@chakra-ui/icons';
import {
  Box,
  Avatar,
  AvatarBadge,
  Text,
  LinkBox,
  LinkOverlay,
  Icon,
} from '@chakra-ui/react';

const TabItems = forwardRef(function TabItems(props, ref) {
  return (
    <LinkBox
      as={'button'}
      onClick={props.onClick}
      _hover={{ bg: ' rgb(140, 213, 156)' }}
      borderRadius={'xl'}
    >
      <Box
        display="flex"
        h="60px"
        padding={'0.5'}
        flexWrap
        overflow={'hidden'}
        alignItems={'center'}
        borderRadius="lg"
      >
        {props.tabImage ? (
          <Avatar
            margin={'1'}
            size="sm"
            name={props.tabName}
            src={props.tabImage}
          >
            {/* <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
          </Avatar>
        ) : (
          <Icon as={props.tabIcon} w={8} h={8} margin={'1'} color="darkgreen" />
        )}

        <LinkOverlay href={props.tabLink}>
          <Text as={'b'} paddingLeft={'1'} fontSize="15px">
            {props.tabName}
          </Text>
        </LinkOverlay>
      </Box>
    </LinkBox>
  );
});

TabItems.propTypes = {
  tabImage: PropTypes.string,
  tabName: PropTypes.string,
  tabLink: PropTypes.string,
  onClick: PropTypes.func,
};
TabItems.defaultProps = {
  tabName: 'John Doe',
  tabLink: '#',
};

export default TabItems;
