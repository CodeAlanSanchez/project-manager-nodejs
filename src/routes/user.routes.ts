import {
  user,
  users,
  login,
  register,
  me,
  logout,
} from './../controllers/user.controller';
import auth from '../middleware/auth';
import express from 'express';

const router = express.Router();

router.get('/user', users);
router.get('/user/:id', user);
router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, me);
router.post('/logout', auth, logout);
// router.put('/user', );
// router.delete('/user', );

export default router;
