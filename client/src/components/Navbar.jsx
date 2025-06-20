import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'

const Navbar = () => {
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(false)
    const { backendUrl, userData, setUserData, setIsLogin } = useAppContext()
    const logout = async () => {
        try {

            const { data } = await axios.post(backendUrl + "/api/auth/logout", {
                withCredentials: true
            })
            data.success && setIsLogin(false)
            data.success && setUserData(false)
            navigate("/")
            toast.success("User Logout Successfully")

        } catch (error) {
            toast.error(error.message)

        }

    }
    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp", {}, { withCredentials: true })
            if (data.success) {
                navigate("/email-verify")
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }


    return (
        <div className='w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />
            {userData ?
                <div onClick={() => setToggle(!toggle)} className='h-8 w-8 rounded-full flex items-center justify-center bg-black text-white relative group'>
                    {userData.name[0].toUpperCase()}
                    <div className={`absolute ${toggle ? "block" : "hidden"} sm:hidden  sm:group-hover:block top-0 right-0 z-10 text-black rounded pt-10`}>
                        <ul className='list-none m-0 bg-gray-100 text-sm p-2 rounded'>
                            {!userData.isAccountVerified &&
                                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}

                            <li onClick={logout} className='py-1  hover:bg-gray-200 cursor-pointer px-6'>Logout</li>
                        </ul>

                    </div>
                </div>
                :
                <button onClick={() => navigate("/login")} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer group transition-all '>Login
                    <img className='group-hover:translate-x-2 transition-all duration-500' src={assets.arrow_icon} alt="arrow_icon" /></button>
            }
        </div>
    )
}

export default Navbar
