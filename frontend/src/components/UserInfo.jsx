import { useState, memo } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios.js';
import { VStack, Heading, Text, AvatarGroup, Avatar } from '@chakra-ui/react';

const fetcher = (url) => axios.get(url).then((res) => res.data);
function UserInfo(props) {
  const { userInfo } = props;
  const params = useParams();
  const { id: userId } = params;
  const { data, error, isLoading } = useSWR(`api/social/${userId}`, fetcher);
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
                src={
                  friend.users.profile.avatarURL ??
                  'https://www.bing.com/images/search?view=detailV2&ccid=%2fS6CWPvq&id=401086B8664F7F68427A4E83582EA7EE515290BF&thid=OIP._S6CWPvqlA5exNtObCij-QAAAA&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.fd2e8258fbea940e5ec4db4e6c28a3f9%3frik%3dv5BSUe6nLliDTg%26riu%3dhttp%253a%252f%252fronaldmottram.co.nz%252fwp-content%252fuploads%252f2019%252f01%252fdefault-user-icon-8-300x300.jpg%26ehk%3d%252fS1gSKIqZvzeb%252fwfdAmhZtkKAmA%252fIYDlqLb8dA96Y%252fU%253d%26risl%3d%26pid%3dImgRaw%26r%3d0%26sres%3d1%26sresct%3d1%26srh%3d800%26srw%3d800&exph=300&expw=300&q=default+user&simid=608035965117479935&FORM=IRPRST&ck=D1D7FEFE7C1A04229E939E43CA1EA8C2&selectedIndex=2'
                }
              />
            ))}
      </AvatarGroup>
    </VStack>
  );
}

export default memo(UserInfo);
