import "reflect-metadata";
import AppDataSource from "./database/db.ts";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Employee } from "./entities/Employee.ts";
import { AdminResolver } from "./resolvers/mutations/AdminResolver.ts";
import { AuthResolver } from "./resolvers/mutations/AuthResolver.ts";
import { EmployeeResolver } from "./resolvers/mutations/EmployeeResolver.ts";
import { ManagerResolver } from "./resolvers/mutations/ManagerResolver.ts";
import { GeneralQueries } from "./resolvers/queries/GeneralQueries.ts";
import { ReportQueries } from "./resolvers/queries/ReportQueries.ts";

dotenv.config();

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        const schema = await buildSchema({
            resolvers: [AuthResolver, AdminResolver, EmployeeResolver, ManagerResolver, GeneralQueries, ReportQueries],
            validate: true, 
            authChecker: ({ context }, roles) => {
                if (!context.user) return false;
                if (roles.length === 0) return true;
                return roles.includes(context.user.role);
            }
        }); 

        const server = new ApolloServer({
            schema,
            context: async ({ req }) => {
                try {
                    const token = req.headers.authorization?.split(" ")[1];
                    if (!token) return { user: null };

                    const payload: any= jwt.verify(token, String(process.env.JWT_SECRET));
                    
                    const empRepo = AppDataSource.getRepository(Employee);
                    const user = await empRepo.findOne({ 
                        where: { id: payload.id } 
                    });

                    return { user }; 
                } catch (err) {
                    return { user: null };
                }
            }
        });

        const { url } = await server.listen(4000);

        console.log(`Server ready at ${url}graphql`);
    } catch (err) {
        console.log("Error in initialization", err);
    }
}

main();
