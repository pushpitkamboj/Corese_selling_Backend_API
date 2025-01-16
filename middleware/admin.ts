import { Request, Response, NextFunction } from "express";

import{Admin} from "../db"
const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const username = req.headers.username; // harkirat@gmail.com
    const password = req.headers.password; /// 123456

    Admin.findOne({
        username: username,
        password: password
    })
    .then(function(value: any) {
        if (value) {
            next();
        } else {
            res.status(403).json({
                msg: "Admin does not exist"
            })
        }
    })
}


export default adminMiddleware;