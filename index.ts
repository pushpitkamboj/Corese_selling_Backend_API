import express, { Application, NextFunction } from 'express';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin';
import userRouter from './routes/user';
import { Request, Response } from "express";


const app: Application = express()

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use((err: { stack: any; }, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
  });
  
app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});