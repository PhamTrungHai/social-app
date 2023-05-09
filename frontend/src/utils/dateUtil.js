const convertTime = (time) => {
  const tod = time.trim().slice(8, time.length);
  var rtime = time.trim().slice(0, 8);
  if (tod == 'PM') {
    var rtime = rtime.split(':');
    rtime[0] = parseInt(rtime[0]) + 12;
    rtime = rtime.join(':');
  }
  return rtime;
};

const getTimePassed = (date) => {
  const now = new Date();
  const day = new Date(date);
  const round = (num) => Math.round(num);
  var time = round((now.getTime() - day.getTime()) / 60000);
  time > 1440
    ? (time = `${round(time / 1440)} ngày trước`)
    : time > 60
    ? (time = `${round(time / 60)} giờ trước`)
    : time >= 1
    ? (time = `${time} phút trước`)
    : (time = `vừa xong`);
  return time;
};

const getCurrentTime = () => {
  const dateArr = new Date().toLocaleString().split(',');
  const dateStrr = dateArr[0].split('/');
  const time = convertTime(dateArr[1]);
  const dateStr = `${dateStrr[2]}-${dateStrr[0]}-${dateStrr[1]} ${time}`;
  return dateStr;
};
export { convertTime, getTimePassed, getCurrentTime };
