import "reflect-metadata";
import AppDataSource from "./config/db.ts";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from '@as-integrations/express5';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Employee } from "./entities/Employee.ts";
import { AuthResolver } from "./resolvers/auth.resolver.ts";
import { EmployeeResolver } from "./resolvers/employee.resolver.ts";
import { MeetingRoomResolver } from "./resolvers/meetingRoom.resolver.ts";
import { EquipmentResolver } from "./resolvers/equipment.resolver.ts";
import { BookingResolver } from "./resolvers/booking.resolver.ts";
import { ReportResolver } from "./resolvers/report.reolver.ts";
import bookingCron from "./jobs/bookingCron.ts";
import express from "express";
import cors from "cors"; 
import { createServer } from "http";
import { Server } from "socket.io";
import { registerNotificationHandlers } from "./sockets/notification.socket.ts";

dotenv.config();

export interface AppContext {
  user: Employee; 
  io: Server;
}

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        const schema = await buildSchema({
            resolvers: [AuthResolver, EmployeeResolver, MeetingRoomResolver, EquipmentResolver, BookingResolver, ReportResolver],
            validate: true, 
            authChecker: ({ context }, roles) => {
                if (!context.user) return false;
                if (roles.length === 0) return true;
                return roles.includes(context.user.role);
            }
        }); 

        const app = express();
        app.use(
            cors({
                origin: process.env.FRONTEND_URL,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'apollo-require-preflight',
                    'x-apollo-operation-name'
                ],
                credentials: true,
                optionsSuccessStatus: 200,
            }),
        );
        const httpServer = createServer(app); 

        const io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                credentials: true,
            },
            transports: ["websocket", "polling"]
        });

        io.on("connection", (socket) => {
            const employeeId = socket.handshake.query.employeeId as string;
    
            if (employeeId) {
                socket.join(`employee_${employeeId}`);
                console.log(`Employee connected: ${employeeId}`);

                registerNotificationHandlers(io, socket, Number(employeeId));
            }

            socket.on("disconnect", () => {
                console.log(`Socket disconnected: ${socket.id}`);
            });
        });

        app.set("io", io);

        const server = new ApolloServer({ schema });
        await server.start();

        app.use(express.json());
        
        app.use(
            "/graphql",
            cors({ origin: process.env.FRONTEND_URL, credentials: true }),
            expressMiddleware(server, {
                context: async ({ req }) => {
                    const ioInstance = req.app.get("io");
                    try {
                        const token = req.headers.authorization?.split(" ")[1];
                        if (!token) return { user: null, io: ioInstance };

                        const payload: any = jwt.verify(token, String(process.env.JWT_SECRET));

                        const empRepo = AppDataSource.getRepository(Employee);
                        const user = await empRepo.findOne({ where: { id: payload.id } });

                        return { user, io: ioInstance }; 
                    } catch (err) {
                        return { user: null, io: ioInstance };
                    }
                }
            })
        );

        bookingCron(io);

        const PORT = process.env.PORT || 10000;

        httpServer.listen(PORT, () => {
            console.log(`Server ready at http://localhost:${PORT}/graphql`);
        });

    } catch (err) {
        console.log("Error in initialization", err);
    }
}

main();
