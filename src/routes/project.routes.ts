import {
  project,
  projects,
  createProject,
  updateProject,
  deleteProject,
} from './../controllers/project.controller';
import express from 'express';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, projects);
router.get('/:id', auth, project);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

export default router;
