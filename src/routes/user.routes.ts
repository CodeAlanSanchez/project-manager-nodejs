import { user, users, login, register, me } from './../controllers/user.controller';
import express from 'express';

const router = express.Router();

router.get('/user', users);
router.get('/user/:id', user);
router.post('/login', login);
router.post('/register', register);
router.get('/me', me)
// router.put('/user', );
// router.delete('/user', );

export default router;
