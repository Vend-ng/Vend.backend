import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
// import { Lazy } from "../../lib/helpers";
import { IContext } from "../../lib/interfaces";
// import { Permission } from "../Permission";
import { User } from "./entity";
// import { UserCreateInput, UserDeletePayload, UserUpdateInput } from "./input";

// const resource = User;
// type resourceType = User;

/**
 * UserResolver for graphql
 */
@Resolver((returns: void) => User)
export class UserResolver {
  private userRepo: Repository<User> = getRepository(User);
  // Workaround waiting for
  // https://github.com/19majkel94/type-graphql/issues/351
  @Authorized()
  @FieldResolver((returns: void) => String, { nullable: true })
  public isSuperAdmin(
    @Root() user: User,
    @Ctx() context: IContext
  ): boolean | undefined {
    const curUser = context.state.user;
    if (curUser && user.id === curUser.id) {
      return user.isSuperAdmin;
    }

    return undefined;
  }

  @Query((returns: void) => User, { nullable: true })
  public getUserById(@Arg("id") id: string): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }

  @Query((returns: void) => User, { nullable: true })
  public getUserBySub(@Arg("sub") sub: string): Promise<User | undefined> {
    return this.userRepo.findOne({ sub });
  }

  // Workaround waiting for
  // https://github.com/19majkel94/type-graphql/issues/351
  // @Authorized()
  // @FieldResolver((returns: void) => String, { nullable: true })
  // public permissions(
  //   @Root() user: User,
  //   @Ctx() context: IContext
  // ): Lazy<Permission[]> | undefined {
  //   const curUser = context.state.user;
  //
  //   if (curUser && user.id === curUser.id) {
  //     return user.permissions;
  //   }
  //
  //   return undefined;
  // }

  @Query((returns: void) => User, { name: `me`, nullable: true })
  protected async me(@Ctx() context: IContext) {
    const user: User | undefined = context.state.user;
    if (!user) {
      return undefined;
    }

    return user;
  }
}