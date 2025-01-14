import React from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { PeopleAltOutlined } from '@mui/icons-material'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { setToggleChat, setToggleUsers, setToggle, setToggleSaves } from '../Redux/slices/ToggleMessage';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import { setIsDarkMode } from '../Redux/slices/darkMode';

export default function UserFeatures() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.ToggleMessage.users);
  const chat = useAppSelector(state => state.ToggleMessage.chat);
  const saves = useAppSelector(state => state.ToggleMessage.saves);
  const isNewMeeting = useAppSelector(state => state.MeetingCode.isNewMeeting);
  const isDarkMode = useAppSelector(state => state.DarkMode.isDarkMode);

  const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    
    if (target.name === "isDarkMode") {
      dispatch(setIsDarkMode(!isDarkMode));
      return;
    }
    if (target.name === "users") {
      dispatch(setToggleUsers(true))
      dispatch(setToggleChat(false));
      dispatch(setToggleSaves(false));
    }
    if (target.name === "chat") {
      dispatch(setToggleChat(true));
      dispatch(setToggleUsers(false));
      dispatch(setToggleSaves(false));
    }
    if (target.name === "saves") {
      dispatch(setToggleSaves(true));
      dispatch(setToggleUsers(false));
      dispatch(setToggleChat(false));
    }

    dispatch(setToggle(true));
  }

  return (
    <>
      <section className={`${isDarkMode ? "bg-gray-800 shadow-none" : " bg-white shadow-sm shadow-gray-400"} flex justify-center items-start gap-4 w-fit h-fit px-10 py-2 absolute top-0 left-0 rounded-br-lg`}>
        {
          isNewMeeting &&
          <button className={`p-2 rounded-md ${chat ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='chat' onClick={handleActive}>
            <QuestionAnswerOutlinedIcon className={`pointer-events-none w-8 h-8 ${chat ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
          </button>
        }

        {
          isNewMeeting &&
          <button className={`p-2 rounded-md ${users ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='users' onClick={handleActive}>
            <PeopleAltOutlined className={`pointer-events-none w-8 h-8 ${users ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
          </button>
        }

        <button className={`p-2 rounded-md ${saves ? `${!isDarkMode ? "bg-blue-400" : "bg-gray-700"}` : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-200"}`}`} name='saves' onClick={handleActive}>
          <FolderSpecialRoundedIcon className={`pointer-events-none w-8 h-8 ${saves ? "text-white" : isDarkMode ? "text-white" : "text-black"}`} />
        </button>

        <button className={isDarkMode ? 'p-2 rounded-md' : 'p-2 rounded-md'} name='isDarkMode' onClick={handleActive}>
          <Brightness4OutlinedIcon className={`pointer-events-none w-8 h-8 ${isDarkMode ? "text-white" : "text-black"}`} />
        </button>
      </section>
    </>
  )
}
