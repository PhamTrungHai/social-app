import { useState } from 'react';
import { useSelector } from 'react-redux';
import { VStack, Box } from '@chakra-ui/react';
import TabItems from '../components/TabItems';
import { FaUserFriends } from 'react-icons/fa';

function NavTab() {
  const { userInfo } = useSelector((state) => state.user);
  const [userName, setUserName] = useState(userInfo.name);
  const [userImg, setUserImg] = useState(userInfo.avatarURL);

  const items = [
    { tabName: 'Bạn Bè', tabImg: '', tabIcon: FaUserFriends, tabLink: '/' },
  ];
  return (
    <VStack spacing={'-0.5'} align="stretch">
      <TabItems
        tabName={userName}
        tabImage={userImg}
        tabLink={`/${userInfo._id}`}
      />
      {items.map((item) => (
        <TabItems
          key={item.tabName}
          tabName={item.tabName}
          tabImage={item.tabImg}
          tabIcon={item.tabIcon}
          tabLink={item.tabLink}
        />
      ))}
    </VStack>
  );
}

export default NavTab;
