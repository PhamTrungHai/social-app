import React, {
  memo,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
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
  ButtonGroup,
  Image,
  Spinner,
  Input,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import {
  BiLike,
  BiChat,
  BiShare,
  BiDotsVertical,
  BiRightArrowAlt,
  BiImage,
  BiX,
} from 'react-icons/bi';
import { getTimePassed } from '../utils/dateUtil.js';
import { getError } from '../utils/getError.js';
import { toast } from 'react-toastify';
import axios from '../utils/axios.js';
import { useSelector } from 'react-redux';
import useSWR, { useSWRConfig } from 'swr';
import { notificationType } from '../utils/Enum.js';
import useNotify from '../hooks/useNotify';

function Posts({ post, socket }) {
  function reducer(state, action) {
    switch (action.type) {
      case 'LIKE':
        return {
          ...state,
          liked: true,
          likes: state.likes + 1,
          btnDisabled: true,
        };
      case 'UNLIKE':
        return {
          ...state,
          liked: false,
          likes: state.likes - 1,
          btnDisabled: true,
        };
      case 'SUCCESS':
        return {
          ...state,
          ...action.payload,
        };
      case 'FAIL':
        return {
          ...state,
          ...action.payload,
        };
      case 'SET_LIKE_ID':
        return {
          ...state,
          likeId: action.payload,
        };
      case 'SET_BTN_DISABLED':
        return {
          ...state,
          btnDisabled: action.payload,
        };
      default:
        return state;
    }
  }

  const [isDisplay, setIsDisplay] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [state, dispatch] = useReducer(reducer, {
    liked: post.Likes[0] ? true : false,
    likes: post._count.Likes,
    likeId: post.Likes[0]?.id,
    btnDisabled: false,
  });
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
  ] = useNotify(socket, userInfo);

  const handleLike = (postID, likeID) => {
    const handleLikePost = async () => {
      try {
        if (state.liked) {
          dispatch({ type: 'UNLIKE' });
          const { data } = await axios.delete(
            `api/posts/${postID}/unlike/${likeID}`,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          dispatch({
            type: 'SUCCESS',
            payload: {
              likeId: data.like ? data.like.id : null,
              likes: data?.postStat.Likes,
              btnDisabled: false,
            },
          });
        } else {
          dispatch({ type: 'LIKE' });
          requestHandler(post.Users.id, '', notificationType.POST_LIKE);
          const { data } = await axios.post(`api/posts/${postID}/like`, null, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({
            type: 'SUCCESS',
            payload: {
              likeId: data?.like.id,
              likes: data?.postStat.Likes,
              btnDisabled: false,
            },
          });
        }
      } catch (error) {
        dispatch({
          type: 'FAIL',
          payload: {
            liked: !state.liked,
            btnDisabled: false,
          },
        });
        toast.error(getError(error));
      }
    };
    handleLikePost();
  };

  return (
    <Card marginTop={2}>
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={post.Users.name}
              src={
                post.Users.profile.avatarURL ??
                'https://www.bing.com/images/search?view=detailV2&ccid=%2fS6CWPvq&id=401086B8664F7F68427A4E83582EA7EE515290BF&thid=OIP._S6CWPvqlA5exNtObCij-QAAAA&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.fd2e8258fbea940e5ec4db4e6c28a3f9%3frik%3dv5BSUe6nLliDTg%26riu%3dhttp%253a%252f%252fronaldmottram.co.nz%252fwp-content%252fuploads%252f2019%252f01%252fdefault-user-icon-8-300x300.jpg%26ehk%3d%252fS1gSKIqZvzeb%252fwfdAmhZtkKAmA%252fIYDlqLb8dA96Y%252fU%253d%26risl%3d%26pid%3dImgRaw%26r%3d0%26sres%3d1%26sresct%3d1%26srh%3d800%26srw%3d800&exph=300&expw=300&q=default+user&simid=608035965117479935&FORM=IRPRST&ck=D1D7FEFE7C1A04229E939E43CA1EA8C2&selectedIndex=2'
              }
            />
            <Box>
              <Heading size="sm">{post.Users.name}</Heading>
              <Text fontSize={'small'} fontWeight={'thin'}>
                {getTimePassed(post.date_posted)}
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
      {post.attachment && (
        <Image
          objectFit="cover"
          src={post.attachment}
          alt={`${post.Users.name}'s post`}
        />
      )}
      <CardBody>
        <Text>{post.content}</Text>
      </CardBody>

      <CardFooter justify="space-between" flexWrap="wrap">
        <Flex w={'full'} justifyContent={'space-between'}>
          <Text display={'inline-block'} fontSize={'sm'} fontWeight={'thin'}>
            {state.likes} likes
          </Text>
          <Text display={'inline-block'} fontSize={'sm'} fontWeight={'thin'}>
            {post._count.Comments} comments
          </Text>
        </Flex>
        <ButtonGroup
          w={'full'}
          borderTopWidth={'thin'}
          borderBottomWidth={'thin'}
        >
          <Button
            flex="1"
            variant="ghost"
            onClick={() => handleLike(post.id, state.likeId)}
            colorScheme={state.liked ? 'blue' : 'gray'}
            leftIcon={
              state.btnDisabled ? (
                <Spinner speed="0.25s" size="xs" />
              ) : (
                <BiLike fill={state.liked ? 'blue' : 'none'} />
              )
            }
            isDisabled={state.btnDisabled}
          >
            Like
          </Button>
          <Button
            flex="1"
            variant="ghost"
            onClick={() => setIsDisplay(!isDisplay)}
            leftIcon={<BiChat />}
          >
            Comment
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
            Share
          </Button>
        </ButtonGroup>
        <Flex
          w={'full'}
          justifyContent={'left'}
          display={isDisplay ? 'flex' : 'none'}
        >
          {isDisplay ? (
            <CommentSection postID={post.id} userInfo={userInfo} />
          ) : (
            ''
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}

const PostsList = ({ children }) => {
  return <Box>{children}</Box>;
};

const Comment = memo(({ comment }) => {
  return (
    <Flex alignItems={'center'}>
      <Avatar name={'Hai Pham'} src={'a'} size={'sm'} />
      <Flex
        flexDirection={'column'}
        background={'blackAlpha.200'}
        m={1}
        p={2}
        borderRadius={'3xl'}
      >
        <Text fontWeight={'bold'}>{comment.Users.name}</Text>
        <Text>{comment.content}</Text>
        {comment.attachment && (
          <Image
            boxSize="150px"
            objectFit="cover"
            src={comment.attachment}
            alt="Dan Abramov"
            borderRadius={'xl'}
          />
        )}
      </Flex>
    </Flex>
  );
});

const CommentInput = memo(({ postID }) => {
  const [value, setValue] = useState('');
  let [images, setImages] = useState('');
  const inputRef = useRef();
  const { userInfo } = useSelector((state) => state.user);

  const { mutate } = useSWRConfig();

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  useLayoutEffect(() => {
    const tx = document.getElementsByTagName('textarea');
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute(
        'style',
        'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;'
      );
      tx[i].addEventListener('input', OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = this.scrollHeight + 'px';
    }
  }, [value]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImages(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setImages('');
    inputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const { data } = await axios.post(
        `api/posts/${postID}/comment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      toast.success('Comment created successfully');
      value && setValue('');
      images && handleClose();
      mutate(`posts/${postID}/comments`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Flex alignItems={'center'}>
      <Avatar name={'Hai Pham'} src={'a'} size={'sm'} />
      <Flex
        flexDirection={'column'}
        background={'blackAlpha.200'}
        m={1}
        borderRadius={'3xl'}
        w={'full'}
        justifyContent={'center'}
      >
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              m={2}
              name="content"
              value={value}
              as={'textarea'}
              variant="unstyled"
              maxHeight={'32'}
              onChange={handleInputChange}
              placeholder={`Write your comments here...`}
              _placeholder={{ opacity: 1, color: 'gray.500' }}
              size="md"
              resize={'none'}
            />
            <InputRightElement
              marginLeft={2}
              justifyContent={'flex-end'}
              gap={1}
            >
              <Input
                name="attachments"
                type="file"
                id="avatar-pic"
                ref={inputRef}
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              <IconButton
                icon={<BiImage />}
                w={8}
                h={8}
                color="blue.500"
                onClick={handleClick}
              />
              <IconButton
                variant="ghost"
                borderRadius={'full'}
                colorScheme="blackAlpha"
                aria-label="sent comment"
                type="submit"
                isDisabled={value.length === 0}
                icon={<BiRightArrowAlt size={'24px'} color="blue" />}
              />
            </InputRightElement>
            {images && (
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent="center"
                borderRadius={'lg'}
                marginTop={12}
                marginBottom={4}
                mx={4}
                p={2}
                border={'1px'}
                position={'relative'}
              >
                <IconButton
                  position={'absolute'}
                  top={2}
                  right={2}
                  onClick={handleClose}
                  icon={<BiX />}
                  borderRadius={'full'}
                  color={'blackAlpha.900'}
                  zIndex={1}
                />
                <Image
                  src={images}
                  alt="attachments"
                  sx={{
                    aspectRatio: '16/9',
                  }}
                  objectFit={'contain'}
                  borderRadius={'md'}
                />
              </Box>
            )}
          </InputGroup>
        </form>
      </Flex>
    </Flex>
  );
});

const CommentsList = ({ children }) => {
  return <Box>{children}</Box>;
};

const CommentSection = memo(({ postID, userInfo }) => {
  const [comments, setComments] = useState([]);
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((res) => res.data)
      .then((data) => setComments(data));
  const { data, error, isLoading } = useSWR(
    `api/posts/${postID}/comments`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  if (error) toast.error(getError(error));
  return (
    <Box w={'full'}>
      <CommentInput postID={postID} />
      <CommentsList>
        {isLoading ? (
          <Spinner />
        ) : (
          comments.length != 0 &&
          comments.map((comment) => (
            <Comment key={comment.date_commented} comment={comment} />
          ))
        )}
      </CommentsList>
    </Box>
  );
});

export default Posts;
export { PostsList };
