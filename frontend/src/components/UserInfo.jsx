import { useState } from 'react';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  GridItem,
  Container,
  Box,
  VStack,
  Flex,
  Center,
  Image,
  Button,
  ButtonGroup,
  Heading,
  Text,
  AvatarGroup,
  Avatar,
  IconButton,
} from '@chakra-ui/react';

const fetcher = (url) => axios.get(url).then((res) => res.data);
function UserInfo(props) {
  const params = useParams();
  const { id: userId } = params;
  const { data, error, isLoading } = useSWR(`/api/social/${userId}`, fetcher);
  return (
    <VStack w={'80'} alignItems={'flex-start'}>
      <Heading as="h2" size="xl">
        {props.userName}
      </Heading>
      <Text fontSize="lg">
        {isLoading ? 'loading...' : data ? data.count : 0} bạn bè
      </Text>
      <AvatarGroup size="sm" max={5}>
        {isLoading
          ? 'loading...'
          : data.friends.map((friend) => (
              <Avatar
                key={friend.name}
                name={friend.name}
                src={friend.profile.avatarURL}
              />
            ))}
      </AvatarGroup>
    </VStack>
  );
}

export default UserInfo;
