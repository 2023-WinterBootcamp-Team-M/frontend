import React, { useState, useEffect } from 'react';
import NotificationItem from './notificationItem';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { alarmStoare, isAlarmStoare, optStore, userIdStore } from '../../store/store';
import { domain } from '../../domain/domain';

//알림 조회
export async function getAlarm(user_id, alarmList, setAlarmList) {
  try {
    const response = await axios.get(`${domain}/api/v1/reminders/list/${user_id}`);
    console.log('알림 조회 성공 :', response.data);
    setAlarmList(response.data);
    console.log('알람 리스트:', alarmList);
  } catch (err) {
    console.error('알림 조회 실패 :', err);
  }
}
//알림 유무 조회
export async function isAlarm(user_id, setIsAlarm) {
  try {
    const response = await axios.get(`${domain}/api/v1/reminders/status/${user_id}`);
    setIsAlarm(response.data);
    console.log('알람 유무 조회 성공 :', response.data);
  } catch (err) {
    console.error('알림 조회 실패 :', err);
  }
}

//해당 알림 삭제
export async function deleteAlarm(user_id, reminder_id, setAlarmList) {
  try {
    //알람 삭제 요청
    await axios.delete(`${domain}/api/v1/reminders/${reminder_id}`);
    const response = await axios.get(`${domain}/api/v1/reminders/list/${user_id}`);
    setAlarmList(response.data);

    console.log('알림개별삭제 성공 :', response.data);
  } catch (err) {
    console.error('알림개별삭제 실패 :', err);
  }
}

//알림 확인
export async function checkAlarm(user_id, setIsAlarm) {
  try {
    //알림확인 요청
    await axios.delete(`${domain}/api/v1/reminders/status/${user_id}`);
    const response = await axios.get(`${domain}/api/v1/reminders/status/${user_id}`);
    setIsAlarm(response.data);

    console.log('알림확인 성공', response.data);
  } catch (err) {
    console.error('알림확인실패 :', err);
  }
}

export default function alarmpage() {
  const { alarmList, setAlarmList } = alarmStoare();
  const { setIsAlarm } = isAlarmStoare();
  const [page, setPage] = useState(1); // 페이지 번호 초기값
  const [ref, inView] = useInView();
  const { userId } = userIdStore();
  const { opt_theme } = optStore();

  const loadMoreData = () => {
    //setNotificationData((prev) => [...prev, ...newData]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    checkAlarm(userId, setIsAlarm);

    loadMoreData();
  }, []);

  useEffect(() => {
    if (inView) {
      // ref가 화면에 노출되면 추가 데이터 로드
      console.log(inView, '무한 스크롤 요청!');
      loadMoreData();
    }
  }, [inView]);

  return (
    <div className="flex flex-col items-center h-screen relative px-5" style={{ overflowY: 'auto' }}>

      <div className="w-full h-[19%] absolute -z-20 rounded-b-md bg-cliptab-blue" />
      <div className="w-full h-[82%] bottom-0 rounded-t-lg bg-[#fcfcfc] absolute -z-10 shadow-top" />
      <img //로고 이미지
        className={`w-[11.75rem] h-[4.8125rem] z-10 ${opt_theme ? "desaturate":""} `}
        src={` ${opt_theme ? "https://i.ibb.co/YhgZ89r/Cliptab-1-4.png" : "https://i.ibb.co/d73mffp/clip-tab-3.png" }`}
        alt="clip_tab_logo"
      />
      <div className="h-full w-full">
        <p className={`self-start py-2 z-20 ${opt_theme ? "text-dark-text" : "text-cliptab-text"} `}>알림</p>
        <div //이미지 추출 창
          className={`w-full h-[10rem] rounded-[20px] shadow-lg mb-4 flex flex-col justify-center items-center z-20 ${opt_theme ? " bg-dark-component" : "bg-white"}`}
        >
          <img //작은 로고
            className={`size-24 animate-bounce ${opt_theme ? "desaturate" : ""}`}
            src="https://i.ibb.co/TkGRQ90/icon4-8-1-2.png"
          />
          <p className={`${opt_theme ? "text-dark-text" : "text-cliptab-blue"}`}>사용하지 않는 북마크를 알려드릴게요!</p>
        </div>
        {alarmList.length === 0 ? (
          <>
            <p className=" self-start py-2 z-20 text-gray-400 ">매세지</p>
            <div className={`w-full h-[65%] rounded-[20px] shadow-xl px-2 py-4 z-20 flex flex-col justify-evenly items-center ${opt_theme ? "bg-dark-component" : "bg-white "}`}>
              <img
                className="h-fit w-[80%]"
                src="https://i.ibb.co/hYCkJTV/free-sticker-reminder-13710879.png"
                alt="free-sticker-reminder-13710879"
              />
              <p className={`flex h-[20%] text-cliptab-blue text-lg items-center ${opt_theme ? "text-dark-text":"text-cliptab-blue"}`}>미접속 북마크가 없습니다</p>
            </div>
          </>
        ) : (
          alarmList.map((alarm) => <NotificationItem key={alarm.id} notification={alarm} />)

        )}
        {page > 1 && <div ref={ref} className="flex justify-center"></div>}
      </div>
    </div>
  );
}
