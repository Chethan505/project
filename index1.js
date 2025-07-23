
const express=require('express')
const User=require('./model/user')
const session=require('express-session')

const methodOverride=require('method-override')
const path=require('path')


const userRouter=require('./routes/User')

const {connectMongoDb}=require('./connection')

const {logreqres}=require('./middlewares')


const app=express()
const port=8000

function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/login');
}

app.use(session({
    secret:'mongo123',
    resave:false,
    saveUninitialized:false


}))

app.use(express.urlencoded({ extended: true }));
connectMongoDb("mongodb://127.0.0.1:27017/My-Project1")


app.use (logreqres('log.txt'))

app.use(methodOverride('_method'))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))




app.use('/users', isAdmin, userRouter);
app.use(express.static(path.join(__dirname,'views')))

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '12345';

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.redirect('/users');
  }

  res.render('login', { error: 'Invalid credentials' });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.get('/',async(req,res)=>{
    try{
        const employees=await User.find()
        res.render('index',{employees})
    }
    catch(err){
        res.status(500).send('Failed to load employees')
    }
})


app.listen(port,()=>console.log(`New server Created:${port}`))