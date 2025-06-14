import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// Middleware : To authenticate the user
export const authenticate = async (req: Request, res : Response, next : NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer") 
                        && req.headers.authorization.split(" ")[1]


        if(!token) {
             res.status(401).json({
                message : "Unauthorized"
            })
            return
        }


        const decoded  = jwt.verify(token, process.env.JWT_SECRET_KEY as string)


        if(!decoded) {
             res.status(401).json({
                message : "Unauthorized"
            })
            return
        }

        const user = await prisma.users.findFirst({
            where : {
                // @ts-ignore
                id : decoded.userId
            }
        })


        if(!user) {
             res.status(401).json({
                message : "Unauthorized"
            })
            return
        }


        // @ts-ignore
        req.user = user;


        next()       
        
    } catch (error) {
         res.status(401).json({
            message : "Unauthorized"
        })
        return
    }
}

export const authorize = (RequiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // @ts-ignore - assuming req.user is added by authentication middleware
      if (RequiredRoles.includes(req.user.role)) {
        return next();
      }

      res.status(401).json({
        message: "Unauthorized",
      });
    } catch (error) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  };
};