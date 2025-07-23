const User = require('../model/user');


const GetAllUserInfo = async (req, res) => {
  try {
    const users = await User.find();
    res.render('index', { employees: users });
  } catch (err) {
    res.status(500).send('Server error');
  }
};


const RenderEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.render('edit', { employee: user });
  } catch (err) {
    res.status(500).send("Server error");
  }
};


const CreateUser = async (req, res) => {
  try {
    console.log('Request Body:', req.body); 
    const { firstName, lastName, email, gender, company } = req.body;
    const newUser = new User({ firstName, lastName, email, gender, company});
    await newUser.save();
    res.redirect('/users');
  } catch (err) {
    console.error('Error while creating user:', err);

    
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        const users= await User.find()
      return res.render('index',{employees:users,error:'Email already Exists'});
    }

    res.status(500).json({ error: 'Something went wrong' });
  }
};


const GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


const UpdateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Update failed');
  }
};


const DeleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).send('Deletion failed');
  }
};

module.exports = {
  GetAllUserInfo,
  RenderEditUser,
  CreateUser,
  GetUserById,
  UpdateUserById,
  DeleteUserById
};