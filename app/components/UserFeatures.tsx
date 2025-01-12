import React from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { PeopleAltOutlined } from '@mui/icons-material'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { setToggleChat, setToggleUsers, setToggle, setToggleSaves } from '../Redux/slices/ToggleMessage';
// import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';

export default function UserFeatures() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.ToggleMessage.users);
  const chat = useAppSelector(state => state.ToggleMessage.chat);
  // const saves = useAppSelector(state => state.ToggleMessage.saves);

  const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    if (target.name === "users") {
      dispatch(setToggleUsers(true))
      dispatch(setToggleChat(false));
      dispatch(setToggleSaves(false));
    }
    if(target.name === "chat") {
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
      <section className='flex justify-center items-start gap-4 w-fit h-fit px-10 py-2 absolute top-0 left-0 rounded-br-lg bg-white shadow-sm shadow-gray-400'>
        <button className={chat ? 'bg-blue-400 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='chat' onClick={handleActive}>
          <QuestionAnswerOutlinedIcon className={!chat ? 'text-black pointer-events-none w-8 h-8' : 'text-white pointer-events-none w-8 h-8'} />
        </button>

        <button className={users ? 'bg-blue-400 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='users' onClick={handleActive}>
          <PeopleAltOutlined className={!users ? 'text-black pointer-events-none w-8 h-8' : 'text-white pointer-events-none w-8 h-8'} />
        </button>

        {/* <button className={saves ? 'bg-blue-400 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='saves' onClick={handleActive}>
          <FolderSpecialRoundedIcon className={!saves ? 'text-black pointer-events-none w-8 h-8' : 'text-white pointer-events-none w-8 h-8'} />
        </button> */}
      </section>
    </>
  )
}
