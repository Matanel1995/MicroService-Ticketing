import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose, { mongo } from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const mongoUrl = 'mongodb://auth-mongo-srv:27017/auth';


const app = express();
app.set('trust proxy', true); //data come through nginx proxy, here we make sure it trust the traffic.

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () =>{

  if(!process.env.JWT_KEY){
    throw new Error('Required JWT_KEY to run this website!');
  }

  try{
    await mongoose.connect(mongoUrl);
  }
  catch(err){
    console.log(err);
  }
  console.log('connected to mongoDB');
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
