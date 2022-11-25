
import { createStrapiAxios } from './strapi';
import axios from 'axios';

export async function getLoggedUser() {
    await axios.post('/api/user')
    .then(async (user) => {

        const JWT = user.data.strapiToken;

        console.log('jwt from API (getLoggedUser)---------------', JWT);
        
        let response = await createStrapiAxios(JWT)
        .get(`/users/me`);
        
        let br = await response.data;
    
        console.log('USER fron getUserMe---------------------',br);
        return br;
  })
}  

