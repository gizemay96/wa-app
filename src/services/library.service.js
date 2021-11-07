import axios from 'axios';
import { getQuery } from './common.service';
import { getInfo } from './user.service';


const url = process.env.REACT_APP_PROD_ENV;


export const getLibraries = async (params) => {
     const query = getQuery(params);

     return await axios
          .get(`${url}/libraries?[users_permissions_user._id]=${getInfo('user').id}`, {
               headers: {
                    Authorization: `Bearer ${getInfo('token')}`,
               },
          })
}



