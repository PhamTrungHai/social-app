import { useState, memo } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { VStack, Heading, Text, AvatarGroup, Avatar } from '@chakra-ui/react';

const fetcher = (url) => axios.get(url).then((res) => res.data);
function UserInfo(props) {
  const { userInfo } = props;
  const params = useParams();
  const { id: userId } = params;
  const { data, error, isLoading } = useSWR(`/api/social/${userId}`, fetcher);
  return (
    <VStack w={'80'} alignItems={'flex-start'}>
      <Heading as="h2" size="xl">
        {userInfo.name}
      </Heading>
      <Text fontSize="lg">
        {isLoading ? 'loading...' : data ? data.count : 0} bạn bè
      </Text>
      <AvatarGroup size="sm" max={5}>
        {isLoading
          ? 'loading...'
          : data.friends.map((friend) => (
              <Avatar
                key={friend.users.id}
                name={friend.users.name}
                src={friend.users.profile.avatarURL}
              />
            ))}
      </AvatarGroup>
    </VStack>
  );
}

export default memo(UserInfo);
