import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'





const AppContext = createContext()



export const AppContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const backendUrl = "https://mernauth-backend.up.railway.app"
    // const backendUrl = "http://localhost:4000"
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState(false)
    const navigate = useNavigate()

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/user/data", {}, { withCredentials: true })
            console.log(data);

            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
                withCredentials: true,
            });
            if (data.success) {
                setIsLogin(true);
                getUserData();
            } else {
                setIsLogin(false);
            }
        } catch (error) {
            setIsLogin(false);
            console.log(error.message);
        } finally {
            setLoading(false); // Mark loading done
        }
    };


    useEffect(() => {
        getAuthState();
    }, [])
    // req.user = { id: tokenDecode.id };
    const values = {
        backendUrl,
        isLogin, setIsLogin,
        userData, setUserData,
        getUserData

    }
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}


// create custom hook from appcontext 

export const useAppContext = () => {
    return useContext(AppContext)
}