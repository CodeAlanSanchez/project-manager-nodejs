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

const router = express.Router();

router.get('/', auth, invites);
// router.get('/:id', auth, invite);
router.post('/', auth, createInvite);
// router.put('/:id', auth, id, updateInvite);
router.post('/:id/accept', auth, acceptInvite);
router.post('/:id/decline', auth, declineInvite);

export default router;
