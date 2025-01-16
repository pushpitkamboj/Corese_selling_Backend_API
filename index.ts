import express, { Application } from 'express';
import bodyParser from 'body-parser';
import adminRouter from './routes/admin';
import userRouter from './routes/user';

const app: Application = express()

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});