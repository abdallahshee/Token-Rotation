import { User, UserModel } from "@/database/user.models";
import { LoginSchema, UserSchema } from "@/schemas/account.schema";
import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { connectDb } from "@/database/Db";
import jwt from "jsonwebtoken";
import { RefreshToken, RefreshTokenModel } from "@/database/refreshtoken.models";

export const addUserServerFn = createServerFn({ method: "POST" })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const newUser: User = {
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        password: await bcrypt.hash(data.password, 10),
      };

      await UserModel.create(newUser);

      // ✅ Return success response
      return new Response(
        JSON.stringify({ message: "User created successfully" }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      // ✅ Handle errors and return proper Response
      if (err instanceof Error) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Fallback
      return new Response(JSON.stringify({ error: "Unknown server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  });

export const userLoginServerFn = createServerFn({ method: "POST" })
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    try {
      const user = await UserModel.findOne({ email: data.email });
      if (!user) {
        throw new Response("Invalid email or password", { status: 401 });
      }
      const valid = await bcrypt.compare(data.password, user.password!);
      if (!valid) {
        throw new Response("Invalid email or password", { status: 401 });
      }
      const accessToken = jwt.sign({ userId: user._id }, "accessTokenString", {
        expiresIn: "15min",
      });
      const refreshToken = jwt.sign(
        { userId: user._id },
        "refreshTokenString",
        { expiresIn: "15d" },
      );
      const hashedRefreshToken=await bcrypt.hash(refreshToken,10)
      const newRefreshToken:RefreshToken={
        userId:user._id,
        tokenHash:hashedRefreshToken,
        expiresAt:new Date(Date.now()+15*24*60*60),
        revoked:false
      }
      await RefreshTokenModel.create(newRefreshToken)
      const { password, ...safeUser } = user;
      return new Response(
        JSON.stringify({
          user: safeUser,
          accessToken: accessToken,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": [
              `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
                15 * 24 * 60 * 60
              }; SameSite=Strict; Secure`,
            ].join(", "),
          },
        },
      );
    } catch (err) {
      if (err instanceof Response) {
        throw err;
      }

      if (err instanceof Error) {
        throw new Response(err.message, { status: 500 });
      }

      throw new Response("Server error", { status: 500 });
    }
  });
