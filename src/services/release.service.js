import axios from 'axios';
import { getQuery } from './common.service';
import { getInfo } from './user.service';


const url = process.env.REACT_APP_PROD_ENV;


export const getReleases = async (params) => {
     const query = getQuery(params);

     return await axios
          .get(`${url}/releases?${query}&[users_permissions_user._id]=${getInfo('user').id}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}

export const getReleaseById = async (id) => {
     return await axios
          .get(`${url}/releases/${id}?[users_permissions_user._id]=${getInfo('user').id}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}

export const createRelease = async (params) => {
     params.users_permissions_user = getInfo('user').id;
     return await axios
          .post(`${url}/releases`, params, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}


export const updateRelease = async (params) => {
     return await axios
          .put(`${url}/releases/${params.id}`, params, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}

export const deleteRelease = async (id) => {
     return await axios
          .delete(`${url}/releases/${id}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}