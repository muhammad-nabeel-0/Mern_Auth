import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EmailVerified = () => {
    const navigate = useNavigate()

    const { backendUrl, setIsLogin, getUserData, isLogin, userData } = useAppContext()
    const inputRef = React.useRef([])
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRef.current[index - 1].focus();

        }

    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text")
        const pasteArray = paste.split("");
        pasteArray.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char
            }
        })
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const otpArray = inputRef.current.map(e => e.value)
            const otp = otpArray.join("")
            const { data } = await axios.post(backendUrl + "/api/auth/verify-account", { otp }, { withCredentials: true })
            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate("/")


            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }
    useEffect(() => {
        isLogin && userData && userData.isAccountVerified && navigate("/")

    }, [isLogin, userData])
    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className='w-28 sm:w-32 absolute left-5 sm:left-20 top-5 cursor-pointer' />
            <form onSubmit={onSubmitHandler} className='bg-slate-900 w-96 p-8 rounded-xl shadow-xl text-sm'>
                <h1 className='text-center text-white font-semibold text-2xl mb-4'>Verify OTP</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input type="text" maxLength={1} required key={index}
                            className='w-12 h-12 text-center outline-none border border-gray-300 text-white rounded-md text-xl bg-[#333A5C] '
                            ref={e => inputRef.current[index] = e}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)} />
                    ))}
                </div>
                <button type='submit' className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>Verify email</button>

            </form>
        </div>
    )
}

export default EmailVerified
