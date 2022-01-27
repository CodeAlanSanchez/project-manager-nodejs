import { user, users, login, register } from './../controllers/user.controller';
import express from 'express';

const router = express.Router();

router.get('/user', users);
router.get('/user/:id', user);
router.post('/login', login);
router.post('/register', register);
// router.put('/user', );
// router.delete('/user', );

export default router;
