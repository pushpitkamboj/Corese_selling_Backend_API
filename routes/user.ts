import { Router, Request, Response } from "express";
import userMiddleware from "../middleware/user";
import { z } from "zod";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

if (!process.env.SECRET_KEY) {
    throw new Error("Environment variable SECRET_KEY must be defined");
}

const SECRET_KEY = process.env.SECRET_KEY;
const router = Router();

import {User, Course} from "../db"

const signupSchema = z.object({
    username: z.string().min(2, {message: "name must have atleast 2 characters"}),
    password: z.string().min(8, {message: "password must be at least 8 characters long"})
})


router.post('/signup', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const check = signupSchema.safeParse({
        username,
        password
    })
    
    if (!check.success) {
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    const existingUser = await User.findOne({ username })

    if (existingUser)  {
        res.status(400).json({
            message: "username already exists",
        })
        return;
    }
    // const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username: username,
        password: password
    })

    res.status(201).json({message: "user signed in successfully"})
});

router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await User.find({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({
            username
        }, SECRET_KEY, {expiresIn: '1h'})

        res.json({
            token
        })
    }
    else {
        res.status(411).json({
            message: "incorrect username or password"
        })
    }
    
})
router.get('/courses', async (req: Request, res: Response) => {
    const allCourses = await Course.find({});
    res.json({
        message: "all courses showed successfully",
        courses: allCourses
    })    
});

router.post('/courses/:courseId', userMiddleware, async (req: Request, res: Response) => {
    const courseId = (req as any).params.courseId;
    const name_user = (req as any).user.username; //took from user middleware
    
    const user = await User.findOne({ username: name_user });

    if (user && Array.isArray(user.purchasedCourse)) {
        if (user.purchasedCourse.includes(courseId)) {
            res.json({
                message: "The course is already purchased by you"
            });
            return;
        }
    }
    

        const result = await User.updateOne({
        username: name_user
    }, {
        "$push": {
            purchasedCourse: courseId
        }
    })

    if (result.modifiedCount === 1) {
        res.json({
            message: "Purchase complete!"
        });
        return;
    } else {
        res.status(500).json({
            message: "Failed to update the user. Please try again."
        });
    }

});

router.get('/purchasedCourse', async (req: Request, res: Response) => {

    const user = await User.findOne({
        username: (req as any).user.username 
    });

    if (user) {
    const courses = await Course.find({
        _id: { 
            $in: user.purchasedCourse 
        },
    });

    if (!courses) {
        res.json({
            message: "the user has not purchased any courses"
        })
    }
    res.json({
        courses: courses
    })
    } else {
        res.json({
            message: "the user doesnt exist"
        })
    }
});

export default router;

