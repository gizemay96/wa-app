import axios from 'axios';

const url = process.env.REACT_APP_PROD_ENV;

export const login = (params) => {
    return axios
        .post(`${url}/auth/local`, params)
        .then(response => {
            // Handle success.
            if (response.data.jwt) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('jwt', JSON.stringify(response.data.jwt));
            }
            return response.data.user;
        });
}

export const register = (params) => {
    return axios
        .post(`${url}/auth/local/register`, params)
        .then(response => {
            // Handle success.
            if (response.data.jwt) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('jwt', JSON.stringify(response.data.jwt));
            }
            return response.data.user;
        });
}

export const getInfo = (type) => {
    return type === 'user' ? JSON.parse(localStorage.getItem('user')) : JSON.parse(localStorage.getItem('jwt'));;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
}
