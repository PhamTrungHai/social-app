import useSWR, { mutate } from 'swr';
import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios.js';
import { toast } from 'react-toastify';
import { getTimePassed, getCurrentTime } from '../utils/dateUtil';
import { getError } from '../utils/getError.js';
import useDebounce from '../hooks/useDebounce.js';

export default function useNotify(socket, userInfo) {
  const [newNotify, setNewNotify] = useState([]);
  const [isResponse, setIsResponse] = useState(true);
  const [count, setCount] = useState(0);
  const [debounce, setDebounce] = useState(false);

  const { data, error, isLoading } = useSWR(
    `api/social/notify/${userInfo._id}`,
    (url) => fetcher(url),
    {
      revalidateOnFocus: false,
    }
  );

  const fetcher = useCallback(
    (url) =>
      axios
        .get(url)
        .then((res) => res.data)
        .then((resdata) => {
          if (resdata.length > 0) {
            var isViewed = 0;
            resdata.map((item) => {
              const newType = getNoteType(item.type);
              const timePassed = getTimePassed(item.date);
              item.data.payload = `${item.data.sender.name} ${newType}`;
              item.date = timePassed;
              if (item.isViewed === false) {
                isViewed++;
              }
            });
            setCount(isViewed);
          }
          return resdata;
        })
        .catch((err) => {
          toast.error(getError(err));
        }),
    [setCount]
  );

  useDebounce(
    () => {
      clearNotify();
      refetchNotify();
    },
    2000,
    [socket, userInfo._id, debounce]
  );

  const postNotify = async (userId, type) => {
    const dateStr = getCurrentTime();
    const { data } = await axios
      .post(
        `api/social/${userId}`,
        {
          _id: userInfo._id,
          type: type,
          payload: `${userInfo._id} want to add friend`,
          date: dateStr,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  const clearNotify = async () => {
    const notifyIds = data.filter((item) => {
      if (item.isViewed == false) {
        return item.id;
      }
    });
    try {
      const { data } = await axios.patch(
        `api/social/notify/${userInfo._id}`,
        {
          notifyArray: notifyIds,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setCount(0);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const refetchNotify = () => {
    mutate(`api/social/notify/${userInfo._id}`);
  };

  const getNoteType = useCallback((type) => {
    switch (type) {
      case 'FRIEND-REQUESTED':
        return 'đã gửi cho bạn một lời mời kết bạn';
      case 'FRIEND-ACCEPTED':
        return 'đã chấp nhận lời mời kết bạn của bạn';
      case 'FRIEND-ADDED':
        return 'đã thêm bạn vào danh sách bạn bè';
      case 'POST-LIKED':
        return 'đã thích bài viết của bạn';
      case 'POST-COMMENTED':
        return 'đã bình luận bài viết của bạn';
      default:
        return 'đã gửi cho bạn một lời mời kết bạn';
    }
  });

  const onReceiveNotify = useCallback(
    (user, type, date) => {
      const newType = getNoteType(type);
      const timePassed = getTimePassed(date);
      setNewNotify([
        {
          userId: user?.id,
          data: {
            sender: { name: user?.name, avatar: user?.avatar },
            payload: `${user?.name} ${newType}`,
          },
          time: timePassed,
          type: type,
        },
        ...newNotify,
      ]);
      setCount(count + 1);
    },
    [newNotify, count]
  );

  useEffect(() => {
    socket.on('notify:receive', onReceiveNotify);

    return () => {
      socket.off('notify:receive', onReceiveNotify);
    };
  }, [socket]);

  const requestHandler = async (userId, choice, type) => {
    try {
      const dateStr = getCurrentTime();
      if (choice) {
        const { data } = await axios.put(
          `api/social/response/${userId}`,
          {
            _id: userInfo._id,
            type: type,
            payload: `${choice} ${userInfo._id} friend request`,
            reply: choice,
            date: dateStr,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
      }
      socket.emit('notify:create', userId, type, dateStr);
      setIsResponse(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err);
    }
  };

  return [
    data,
    isLoading,
    newNotify,
    count,
    isResponse,
    debounce,
    setDebounce,
    requestHandler,
    postNotify,
  ];
}
