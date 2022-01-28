import {
  bug,
  bugs,
  createBug,
  updateBug,
  //   deleteBug,
} from './../controllers/bug.controller';
import express from 'express';
import auth from '../middleware/auth';
import id from '../middleware/bodyId';
import nameDesc from '../middleware/nameDesc';

const router = express.Router();

router.get('/', auth, id, bugs);
router.get('/:id', auth, bug);
router.post('/', auth, id, nameDesc, createBug);
router.put('/:id', auth, id, updateBug);
// router.delete('/:id', auth, deleteBug);

export default router;
