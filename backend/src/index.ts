import "reflect-metadata";
import AppDataSource from "./config/db.ts";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from '@as-integrations/express5';
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
import { RoleResolver } from "./resolvers/role.resolver.ts";
import { PermissionResolver } from "./resolvers/permission.resolver.ts";
import { authCheck } from "./middleware/auth.middleware.ts";

dotenv.config();

export interface AppContext {
  user: Employee | null; 
  io: Server;
}

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        const schema = await buildSchema({
            resolvers: [AuthResolver, EmployeeResolver, MeetingRoomResolver, EquipmentResolver, BookingResolver, ReportResolver, RoleResolver, PermissionResolver],
            validate: true,
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
                context: authCheck()
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
