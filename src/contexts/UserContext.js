import { React ,  createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState({});

    useEffect(() => {
        setActiveUser(JSON.parse(localStorage.getItem('user')) || {});
        console.log(activeUser)
    }, [])

    const values = {
        activeUser,
        setActiveUser
    }


    return (
        <UserContext.Provider value={values}>{children}</UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);

export default UserContext;