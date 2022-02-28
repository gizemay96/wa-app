import axios from 'axios';
import { getQuery } from './common.service';
import { getInfo } from './user.service';


const url = process.env.REACT_APP_PROD_ENV;


export const getWorks = async (params) => {
     const query = getQuery(params);

     return await axios
          .get(`${url}/works?${query}&[users_permissions_user._id]=${'617006d7bdbce900164f4636'}&_sort=createdAt:DESC`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}

export const getWorkById = async (id) => {
     return await axios
          .get(`${url}/works/${id}?[users_permissions_user._id]=${'617006d7bdbce900164f4636'}&_sort=createdAt:DESC`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}


export const getWorksCountWithDate = (ltDate, gtDate, params) => {
     const query = getQuery(params);

     return axios
          .get(`${url}/works/count?[createdAt_lt]=${ltDate}&[createdAt_gt]=${gtDate}&[users_permissions_user._id]=${'617006d7bdbce900164f4636'}&${query}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
          .then(response => {
               return response;
          });
}

export const getWorksCount = async (params) => {
     const query = getQuery(params);

     return await axios
          .get(`${url}/works/count?[users_permissions_user._id]=${'617006d7bdbce900164f4636'}&${query}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}


export const createWork = (params) => {
     params.users_permissions_user = '617006d7bdbce900164f4636';
     return axios
          .post(`${url}/works`, params, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
          .then(response => {
               return response;
          });
}

export const updateWork = async (params, updateId) => {
     return await axios
          .put(`${url}/works/${updateId}`, params, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
          .then(response => {
               return response;
          });
}

export const deleteWork = async (id) => {
     return await axios
          .delete(`${url}/works/${id}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}
