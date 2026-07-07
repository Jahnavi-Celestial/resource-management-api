import { Arg, Mutation, Resolver } from "type-graphql";
import { AuthService } from "../services/auth.service.ts";
import { Employee } from "../entities/Employee.ts";
import { LoginInput, RegisterInput } from "../dto/auth.input.ts";

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => Employee)
  async register(
    @Arg("input",()=>RegisterInput) input: RegisterInput
  ){
    return await this.authService.register(input);
  }

  @Mutation(() => String)
  async login(
    @Arg("input", ()=>LoginInput) input: LoginInput
  ){
    return await this.authService.login(input);
  }
}
