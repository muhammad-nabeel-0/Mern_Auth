import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'


const Login = () => {
    const navigate = useNavigate()
    const [state, setState] = useState("Login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { backendUrl, setIsLogin, getUserData, userData } = useAppContext()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (state === "Sign Up") {
                response = await axios.post(backendUrl + "/api/auth/register", {
                    name, email, password
                }, { withCredentials: true });
                toast.success("Create account successfully")
            } else {
                response = await axios.post(backendUrl + "/api/auth/login", {
                    email, password
                }, { withCredentials: true });
                toast.success("Login successfully")
            }



            const { data } = response;

            if (data.success) {

                setIsLogin(true);
                getUserData()
                navigate("/");
            } else {
                toast.error(data.message || "Something went wrong");
            }

        } catch (error) {

            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
            <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className='w-28 sm:w-32 absolute left-5 sm:left-20 top-5 cursor-pointer' />
            <div className='bg-slate-900 rounded-xl p-10 sm:w-96 w-full shadow-xl text-sm text-indigo-300'>
                <h2 className='text-3xl font-semibold text-center mb-3 text-white'>
                    {state === "Sign Up" ? "Creat Account" : "Login"}</h2>
                <p className='text-center mb-6 text-sm'>
                    {state === "Sign Up" ? "Create your account" : "login to your account"}</p>
                <form onSubmit={onSubmitHandler}>
                    {state === "Sign Up" && (
                        <div className='rounded-full bg-[#333A5C] flex mb-4 items-center gap-4 w-full px-5 py-2.5'>
                            <img src={assets.person_icon} alt="icons" />
                            <input type="text" required placeholder='Full Name'
                                className='bg-transparent outline-none w-full '
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    )}
                    <div className='rounded-full bg-[#333A5C] flex mb-4 items-center gap-4 w-full px-5 py-2.5'>
                        <img src={assets.mail_icon} alt="icons" />
                        <input type="email" required placeholder='Email'
                            className='bg-transparent outline-none w-full'
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='rounded-full bg-[#333A5C] flex mb-4 items-center gap-4 w-full px-5 py-2.5'>
                        <img src={assets.lock_icon} alt="icons" />
                        <input type="password" required placeholder='Password'
                            className='bg-transparent outline-none w-full  '
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <p onClick={() => navigate("/reset-password")} className='text-indigo-500 mb-4 cursor-pointer'>forget password?</p>
                    <button type='submit'
                        className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-sm text-white font-medium cursor-pointer'>
                        {state}</button>
                </form>
                {state === "Sign Up" ?
                    (<p className='text-center mt-4 text-gray-400'>Already have an account?
                        <span onClick={() => setState("Login")} className='text-blue-400 cursor-pointer underline'>Login here</span>
                    </p>)
                    :
                    (
                        <p className='text-center mt-4 text-gray-400'>Don't have an account?
                            <span onClick={() => setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign up</span>
                        </p>
                    )}



            </div>
        </div>
    )
}

export default Login
