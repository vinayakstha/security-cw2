import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import z from "zod";
import { verifyCaptcha } from "../utils/recaptcha";
import passport from "passport";
import { CLIENT_URL } from "../config";
import { IUser } from "../models/user.model";

let userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      // Verify CAPTCHA token
      const captchaToken = req.body.captchaToken;
      await verifyCaptcha(captchaToken);

      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }
      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);
      return res
        .status(201)
        .json({ success: true, message: "User Created", data: newUser });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Verify CAPTCHA token
      const captchaToken = req.body.captchaToken;
      await verifyCaptcha(captchaToken);

      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }
      const loginData: LoginUserDTO = parsedData.data;
      const result = await userService.loginUser(loginData);

      // If TOTP is required, return the temp token
      if ((result as any).requiresTotp) {
        return res.status(200).json({
          success: true,
          requiresTotp: true,
          tempToken: (result as any).tempToken,
          message: "TOTP verification required",
        });
      }

      const { token, user } = result as { token: string; user: any };
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      // Verify CAPTCHA token
      const captchaToken = req.body.captchaToken;
      await verifyCaptcha(captchaToken);

      const email = req.body.email;
      const user = await userService.sendResetPasswordEmail(email);
      return res.status(200).json({
        success: true,
        data: user,
        message: "If the email is registered, a reset link has been sent.",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      // Verify CAPTCHA token
      const captchaToken = req.body.captchaToken;
      await verifyCaptcha(captchaToken);

      const token = req.params.token as string;
      const { newPassword } = req.body;
      await userService.resetPassword(token, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // Google OAuth - initiate
  async googleAuth(req: Request, res: Response, next: any) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })(req, res, next);
  }

  // Google OAuth - callback
  async googleCallback(req: Request, res: Response, next: any) {
    passport.authenticate(
      "google",
      { session: false },
      async (err: Error | null, user: IUser | null) => {
        try {
          if (err || !user) {
            const errorMessage = err?.message || "Google authentication failed";
            return res.redirect(
              `${CLIENT_URL}/login?error=${encodeURIComponent(errorMessage)}`,
            );
          }

          const result = await userService.googleLogin(user);
          const { token } = result;

          // Redirect to frontend with token
          const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            profilePicture: user.profilePicture,
          };

          return res.redirect(
            `${CLIENT_URL}/google-callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`,
          );
        } catch (error: any) {
          return res.redirect(
            `${CLIENT_URL}/login?error=${encodeURIComponent(error.message || "Google authentication failed")}`,
          );
        }
      },
    )(req, res, next);
  }
}
