import React from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks'
import { PeopleAltOutlined } from '@mui/icons-material'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { setFunctionality } from '../Redux/slices/functionality';
import { setToggle } from '../Redux/slices/toggle';

export default function UserFeatures() {
  const functionality = useAppSelector(state => state.Functionality.functionality);
  const dispatch = useAppDispatch();
  
  const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    let target = e.target as HTMLButtonElement;
    dispatch(setFunctionality(target.name))
    dispatch(setToggle(true));
}

  return (
    <>
      <section className='flex justify-center items-start gap-4 w-fit h-fit px-10 py-2 absolute top-0 left-0 rounded-br-lg bg-white shadow-sm shadow-gray-400'>
        <button className={functionality === "chat" ? 'bg-blue-400 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='chat' onClick={handleActive}>
          <QuestionAnswerOutlinedIcon className={functionality !== "chat" ? 'text-black pointer-events-none w-8 h-8' : 'text-white pointer-events-none w-8 h-8'} />
        </button>

        <button className={functionality === "users" ? 'bg-blue-400 p-2 rounded-md' : 'hover:bg-blue-200 p-2 rounded-md'} name='users' onClick={handleActive}>
          <PeopleAltOutlined className={functionality !== "users" ? 'text-black pointer-events-none w-8 h-8' : 'text-white pointer-events-none w-8 h-8'} />
        </button>
      </section>
    </>
  )
}
