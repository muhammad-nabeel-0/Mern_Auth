import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'


const Header = () => {
    const { userData } = useAppContext()
    return (
        <div className='flex items-center gap-2 mt-20 px-4 text-center text-gray-800 flex-col ' >
            <img src={assets.header_img} alt="image"
                className='w-36 h-36 rounded-full mb-6 animate-bounce  ' />
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : "Developer"} !
                <img src={assets.hand_wave} alt="hand"
                    className='w-8 aspect-square' />
            </h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
            <p className='mb-8 max-w-md'>Let's start with product tour and we will have you up and running in on time!</p>
            <button className='cursor-pointer border border-gray-500  px-6 py-2 rounded-full hover:bg-gray-100 transition-all'>Get Started</button>
        </div>
    )
}

export default Header
