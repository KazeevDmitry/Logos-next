
import { createStrapiAxios } from './strapi';

export async function getUser() {
    await axios.post('/api/user').then((user) => {

        const JWT = user.data.strapiToken;

      if (JWT) {
        console.log('jwt from API ---------------', JWT);
        const currUser = getUserMe(JWT);
        console.log('user/me from getUser---------------', currUser);

      }
      else {
        console.log('Not authenticated (AppHaeder)');
      }

      //setCurrentUser(user);
      
    })
    .catch(error => console.log(error))
  }

async function getUserMe(strapiToken) {

    const user = await createStrapiAxios(strapiToken)
    .get(`/users/me`)
    .then((res) => res.data)
    .catch(()=> null);

return user;
    
}