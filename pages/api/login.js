import nc from 'next-connect';
import { sessionMiddleware } from '../../middlewares/session';
import { createStrapiAxios } from '../../utils/strapi';

export default nc()
  .use(sessionMiddleware)
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await createStrapiAxios()
        .post(`/auth/local?populate=avatar`, {
          identifier: email,
          password,
        })
        .then((res) => res.data);
        // .then((data) => ({
        //     strapiToken: data.jwt,
        //   }));
        // );
       
     
      // if (!user.confirmed) {
      //   return res.status(401).json({
      //     statusCode: 401,
      //     message: 'User not confirmed'
      //   });
      // }

        req.session.set('user', user?.jwt);
        await req.session.save();
        res.json(user);
    } catch (error) {
      const { response: fetchResponse } = error;
      if (fetchResponse) {
        return res.status(fetchResponse?.status || 500).json(error.response?.data);
      }
      res.status(500).json(error);
    }
  });