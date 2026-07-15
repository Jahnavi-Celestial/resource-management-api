import AppDataSource from "../config/db.ts";
import { Employee } from "../entities/Employee.ts";
import jwt from "jsonwebtoken";
import { Request } from "express";

export function authCheck(){
  return async function ({ req }: { req: Request }){
    const ioInstance = req.app.get("io")

    try{
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) return { user: null, io: ioInstance }

      const payload: any = jwt.verify(token, String(process.env.JWT_SECRET))

      const empRepo = AppDataSource.getRepository(Employee)

      const user = await empRepo.findOne({
        where: {
          id: payload.id,
        },
        relations: {
          userRoles: {
            role: true,
          },
        },
      })

      return { user, io: ioInstance }
    }catch(err){
      return { user: null, io: ioInstance }
    }
  }
}
