import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


const ResetPassword = () => {
    const { backendUrl } = useAppContext()
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [otp, setOtp] = useState(0)
    const [isOtpSubmit, setIsOtpSubmit] = useState(false)
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

    // const onSubmitHandler = async (e) => {
    //     try {
    //         e.preventDefault()
    //         const otpArray = inputRef.current.map(e => e.value)
    //         const otp = otpArray.join("")
    //         const { data } = await axios.post(backendUrl + "/api/auth/verify-account", { otp }, { withCredentials: true })
    //         if (data.success) {
    //             toast.success(data.message)
    //             getUserData()
    //             navigate("/")


    //         } else {
    //             toast.error(data.message)
    //         }

    //     } catch (error) {
    //         toast.error(error.message)

    //     }
    // }

    const onSubmitEmail = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp",
                { email }, { withCredentials: true })
            console.log(data);

            if (data?.success) {

                toast.success(data.message || "OTP sent");
                setIsEmailSent(true);
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message)

        }


    }

    const onSubmitOtp = async (e) => {
        e.preventDefault()
        const otpArray = inputRef.current.map(e => e.value)
        setOtp(otpArray.join(""))
        setIsOtpSubmit(true)
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        const otpValue = otp
        try {
            const { data } = await axios.post(
                backendUrl + "/api/auth/reset-password",
                { email, otp: otpValue, newPassword: password },
                { withCredentials: true }
            );
            console.log(email, password, otpValue);


            if (data?.success) {
                toast.success(data.message || "Password reset successfully");
                navigate("/login");
            } else {
                toast.error(data.message || "Something went wrong");
            }

        } catch (error) {
            const message = "Something went wrong";
            toast.error(message);
        }
    };




    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className='w-28 sm:w-32 absolute left-5 sm:left-20 top-5 cursor-pointer' />
            {/* Email form */}
            {
                !isEmailSent &&
                <form onSubmit={onSubmitEmail} className='bg-slate-900 w-96 p-8 rounded-xl shadow-xl text-sm'>
                    <h1 className='text-center text-white font-semibold text-2xl mb-4'>Reset Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                    <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full w-full bg-[#333A5C] '>
                        <img src={assets.mail_icon} />
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className='w-full outline-none text-indigo-300' placeholder='Enter email' />
                    </div>
                    <button type="submit"
                        className='w-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 rounded-full mt-3 text-white'>
                        Submit
                    </button>

                </form>
            }

            {/* OTP form */}
            {!isOtpSubmit && isEmailSent &&
                <form onSubmit={onSubmitOtp} className='bg-slate-900 w-96 p-8 rounded-xl shadow-xl text-sm'>
                    <h1 className='text-center text-white font-semibold text-2xl mb-4'>Reset Password OTP</h1>
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
                    <button type='submit' className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>Submit </button>
                </form>
            }
            {/* password form */}
            {isOtpSubmit && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 w-96 p-8 rounded-xl shadow-xl text-sm'>
                    <h1 className='text-center text-white font-semibold text-2xl mb-4'>New Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your new password below</p>
                    <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full w-full bg-[#333A5C] '>
                        <img src={assets.lock_icon} />
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className='w-full outline-none text-indigo-300' placeholder='New password' />
                    </div>
                    <button type="submit"
                        className='w-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 rounded-full mt-3 text-white'>
                        Submit
                    </button>

                </form>
            }

        </div>
    )
}

export default ResetPassword
