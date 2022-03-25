import {
  bug,
  bugs,
  createBug,
  updateBug,
  //   deleteBug,
} from './../controllers/bug.controller';
import express from 'express';
import auth from '../middleware/auth';
import paramId from '../middleware/paramId';

const router = express.Router();

router.get('/:id', auth, paramId, bug);
router.put('/:id', auth, paramId, updateBug);
// router.delete('/:id', auth, deleteBug);

export default router;
