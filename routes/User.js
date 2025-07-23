const express = require('express');
const router = express.Router();
const User=require('../model/user')

const {
  GetAllUserInfo,
  RenderEditUser,
  CreateUser,
  GetUserById,
  UpdateUserById,
  DeleteUserById
} = require('../controller/user');


router.get('/', GetAllUserInfo); 
router.get('/edit/:id', RenderEditUser); 
router.post('/', CreateUser); 
router.patch('/:id', UpdateUserById);
router.delete('/:id', DeleteUserById); 

router.get('/api/:id', GetUserById); 

module.exports = router;