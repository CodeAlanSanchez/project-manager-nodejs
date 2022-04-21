import {
  bug,
  updateBug,
  deletebug,
} from './../controllers/bug.controller';
import express from 'express';
import auth from '../middleware/auth';
import paramId from '../middleware/paramId';

const router = express.Router();

router.get('/:id', auth, paramId, bug);
router.put('/:id', auth, paramId, updateBug);
router.delete('/:id', auth, paramId, deletebug)

export default router;
