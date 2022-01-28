import {
  invite,
  invites,
  createInvite,
  updateInvite,
  declineInvite,
  acceptInvite,
} from './../controllers/invite.controller';
import express from 'express';
import auth from '../middleware/auth';
import id from '../middleware/bodyId';
import nameDesc from '../middleware/nameDesc';

const router = express.Router();

router.get('/', auth, id, invites);
router.get('/:id', auth, invite);
router.post('/', auth, id, nameDesc, createInvite);
router.put('/:id', auth, id, updateInvite);
router.post('/:id', auth, id, acceptInvite);
router.post('/:id', auth, id, declineInvite);

export default router;
