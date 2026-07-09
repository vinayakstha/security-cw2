import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TotpService } from "../services/totp.service";
import { UserService } from "../services/user.service";
import { IUser } from "../models/user.model";
import { JWT_SECRET } from "../config";

let totpService = new TotpService();
let userService = new UserService();

export class TotpController {
  /**
   * Generate TOTP secret and QR URI for setup.
   */
  async setup(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await totpService.setupTotp(userId);
      return res.status(200).json({
        success: true,
        message: "TOTP setup data generated",
        data,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Verify a TOTP setup code and enable TOTP for the user.
   */
  async verifyAndEnable(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { token, secret } = req.body;

      if (!token || !secret) {
        return res.status(400).json({
          success: false,
          message: "Token and secret are required",
        });
      }

      const result = await totpService.verifyAndEnable(userId, token, secret);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Disable TOTP for a user.
   */
  async disable(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required to disable TOTP",
        });
      }

      const result = await totpService.disableTotp(userId, password);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Verify TOTP code during login (step 2 after email+password).
   */
  async loginVerify(req: Request, res: Response) {
    try {
      const { tempToken, token } = req.body;

      if (!tempToken || !token) {
        return res.status(400).json({
          success: false,
          message: "Temp token and TOTP code are required",
        });
      }

      // Verify the temp token
      let decoded: any;
      try {
        decoded = jwt.verify(tempToken, JWT_SECRET);
      } catch {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired temp token. Please login again.",
        });
      }

      if (decoded.type !== "totp_verify") {
        return res.status(401).json({
          success: false,
          message: "Invalid token type",
        });
      }

      const userId = decoded.id;
      const user = (await userService.getUserById(userId)) as IUser & {
        totpSecret?: string;
        totpEnabled?: boolean;
      };

      if (!user || !user.totpSecret || !user.totpEnabled) {
        return res.status(400).json({
          success: false,
          message: "TOTP is not enabled for this user",
        });
      }

      const isValid = totpService.verifyToken(token, user.totpSecret);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid TOTP code",
        });
      }

      // Generate the full JWT
      const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      const fullToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token: fullToken,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
