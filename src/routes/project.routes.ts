import {
  project,
  projects,
  createProject,
  updateProject,
  deleteProject,
} from './../controllers/project.controller';
import express from 'express';
import auth from '../middleware/auth';
import nameDesc from '../middleware/nameDesc';
import paramId from '../middleware/paramId';
import { bugs, createBug } from '../controllers/bug.controller';

const router = express.Router();

router.get('/', auth, projects);
router.get('/:id', auth, paramId, project);
router.post('/', auth, nameDesc, createProject);
router.put('/:id', auth, paramId, nameDesc, updateProject);
router.delete('/:id', auth, paramId, deleteProject);

router.get('/:id/bug', auth, paramId, bugs);
router.post('/', auth, paramId, nameDesc, createBug);

export default router;
