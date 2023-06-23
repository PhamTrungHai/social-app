import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Button, Input, InputGroup } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { getError } from '../utils/getError';
import axios from '../utils/axios.js';
import { statusSlice } from '../slices/statusSlice';
import Carousel from '../components/Carousel';
import { userSlice } from '../slices/userSlice';

function CarouselTab(props) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const inputRef = useRef();

  const imgArr = [
    'https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/330289814_914772033077629_8359152264485511567_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=yMGELht5JpYAX9O6YuJ&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDvfT_KZU_Rbnzx5gVBEi1eKRAAdcYFR9j7LbD00nf_7g&oe=641F7069',
    'https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/330161911_582960937053342_1746712528588872870_n.jpg?stp=cp6_dst-jpg_s1080x2048&_nc_cat=111&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=qlgt-GeHGKkAX8v4Evp&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfDOluAGEM_SXlUd7dI9w8O_IzG8dJZPmEpEtrYyhgVQAg&oe=641F2ED1',
    'https://scontent.fsgn5-13.fna.fbcdn.net/v/t39.30808-6/330141121_735098778132549_1160787080892132424_n.jpg?stp=cp6_dst-jpg_s1080x2048&_nc_cat=106&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=BMNj3SXrj94AX9h0_ad&_nc_ht=scontent.fsgn5-13.fna&oh=00_AfA_hI52aaOiLeqYMQI98_1owd29Nb2YcB4XfVXvu-44zA&oe=641EA65B',
    'https://scontent.fsgn5-11.fna.fbcdn.net/v/t39.30808-6/330154627_1252709842018893_7412063113736672408_n.jpg?stp=cp6_dst-jpg_s1080x2048&_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=hJYgugu7-OoAX_HpRdI&_nc_ht=scontent.fsgn5-11.fna&oh=00_AfD_RAB-PDYE69rvD1CMBkHAb_0D5qOqGVoxs0Irco5ViA&oe=641EAE9F',
    'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/330171938_586167706391816_3985213606331137263_n.jpg?stp=cp6_dst-jpg_s1080x2048&_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=h5A-OjvH3ZIAX83Eyyw&_nc_ht=scontent.fsgn5-14.fna&oh=00_AfBfp9fFf4CBqvIrzq5B7f0Nq3i5zTfOPIvlYNu0SF2GKw&oe=641F159E',
    'https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/329241405_749645240081546_7723565347586107883_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=6JAhJvW7ZpUAX9nsRW8&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfBRKcF2svjqmRUuooTrRM1dYwbJK7jo6tIKU97jT62PxQ&oe=641ECD4F',
  ];
  const imgArr1 = [
    'https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/330289814_914772033077629_8359152264485511567_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=yMGELht5JpYAX9O6YuJ&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDvfT_KZU_Rbnzx5gVBEi1eKRAAdcYFR9j7LbD00nf_7g&oe=641F7069',
    'https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/329241405_749645240081546_7723565347586107883_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=6JAhJvW7ZpUAX9nsRW8&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfBRKcF2svjqmRUuooTrRM1dYwbJK7jo6tIKU97jT62PxQ&oe=641ECD4F',
    'https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/323645135_748455729756549_5968151818159808064_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=174925&_nc_ohc=v0GIUukwUS0AX_fv65F&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfCrgG1jxCyXcL5Df4PARZF0wzck-UNr4EH7mqEzNLIuYQ&oe=641F6677',
    'https://scontent.fsgn5-13.fna.fbcdn.net/v/t39.30808-6/327773334_1217114719229825_1049089476512692324_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=Zw5rN1CvkrEAX9xEKXD&_nc_ht=scontent.fsgn5-13.fna&oh=00_AfDL4_2UM4o0TMn-rYWTymT68-oDXwOwx8ccaYw3n6YAGQ&oe=641EEC2B',
    'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/314634929_1810294192650165_3082262800944566410_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=K9Uqpw3mgHQAX-T5y3l&_nc_oc=AQkKX9rV3TJ7JGMP9h6claOSB6HFQBfbr05yx34p2YfiZsQM0LKYF9uaKGa6_G5EPqE&_nc_ht=scontent.fsgn5-14.fna&oh=00_AfCssRYCNDfm6CZtiq2UDvEALyKUpPow5nWMKVvcIa2ARA&oe=641E7425',
    'https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/241050853_1502976370048617_8281862311103811856_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=lT-7BkfaMbIAX9eXD7h&_nc_ht=scontent.fsgn5-3.fna&oh=00_AfDCG891qfny6lEtqPt458TU1ijXPZfqHxEf-CpKbr14Xw&oe=64203065',
  ];

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const bodyFormData = new FormData();
      bodyFormData.append('avatar', file);
      try {
        dispatch(statusSlice.actions.UPDATE_REQUEST());
        const { data } = await axios.post(`api/upload`, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch(statusSlice.actions.UPDATE_SUCCESS());
        toast.success('Image uploaded successfully');
        props.onChange();
        dispatch(userSlice.actions.editProfilePic(data.secure_url));
      } catch (err) {
        dispatch(statusSlice.actions.UPDATE_FAIL(err));
        toast.error(getError(err));
      }
    } else {
      toast.warning('No image chosen');
    }
  };

  return (
    <div>
      <InputGroup onClick={handleClick}>
        <Input
          onChange={handleChange}
          multiple={false}
          type="file"
          id="avatar-pic"
          ref={inputRef}
          accept="image/*"
          hidden
        />
        <Button
          colorScheme="teal"
          variant="solid"
          w={'full'}
          leftIcon={<AddIcon />}
        >
          Tải ảnh lên
        </Button>
      </InputGroup>

      <Grid templateRows={'1fr'} marginTop={4}>
        <Carousel heading="Ảnh đã tải lên" imgArray={imgArr} />
        <Carousel heading=" Ảnh đại diện" imgArray={imgArr1} mt={6} />
      </Grid>
    </div>
  );
}

export default CarouselTab;
