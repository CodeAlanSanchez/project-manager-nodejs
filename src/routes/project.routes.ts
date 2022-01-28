import {
  project,
  projects,
  createProject,
  updateProject,
  deleteProject,
} from './../controllers/project.controller';
import express from 'express';
import auth from '../middleware/auth';
import id from '../middleware/bodyId';
import nameDesc from '../middleware/nameDesc';

const router = express.Router();

router.get('/', auth, id, projects);
router.get('/:id', auth, id, project);
router.post('/', auth, id, nameDesc, createProject);
router.put('/:id', auth, id, nameDesc, updateProject);
router.delete('/:id', auth, id, deleteProject);

export default router;
