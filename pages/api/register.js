import nc from 'next-connect';
import { sessionMiddleware } from '../../middlewares/session';
import { createStrapiAxios } from '../../utils/strapi';

export default nc()
  .use(sessionMiddleware)
  .post(async (req, res) => {
    const { email, password, name, surname } = req.body;

    try {
      const user = await createStrapiAxios()
        .post(`/auth/local/register`, {
          email: email,
          username: email,
          password,
          role: 3,
          name: name,
          surname,
        })
        .then((res) => res.data);
        
        req.session.set('user', user.jwt);
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

