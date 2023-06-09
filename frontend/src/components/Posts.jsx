import React from 'react';
import {
  Box,
  Avatar,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Flex,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { BiLike, BiChat, BiShare, BiDotsVertical } from 'react-icons/bi';

function Posts({ post }) {
  return (
    <Card marginTop={2}>
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post.Users.name} src={post.Users.profile.avatarURL} />
            <Box>
              <Heading size="sm">{post.Users.name}</Heading>
              <Text fontSize={'small'} fontWeight={'thin'}>
                {post.date_posted}
              </Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BiDotsVertical />}
          />
        </Flex>
      </CardHeader>
      <Image
        objectFit="cover"
        src={post.attachment}
        alt={`${post.Users.name}'s post`}
      />
      <CardBody>
        <Text>{post.content}</Text>
      </CardBody>

      <CardFooter justify="space-between" flexWrap="wrap">
        <Flex w={'full'} justifyContent={'space-between'}>
          <Text display={'inline-block'} fontSize={'sm'} fontWeight={'thin'}>
            {post._count.Likes} likes
          </Text>
          <Text display={'inline-block'} fontSize={'sm'} fontWeight={'thin'}>
            {post._count.Comments} comments
          </Text>
        </Flex>
        <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
          Like
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
          Comment
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

const PostsList = ({ children }) => {
  return <Box>{children}</Box>;
};
export default Posts;
export { PostsList };
