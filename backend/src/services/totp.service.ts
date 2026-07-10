import {
  generateSecret,
  generateURI,
  verifySync,
} from "otplib";
import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";

const APP_NAME = "GharCare";

let userRepository = new UserRepository();

export class TotpService {
  /**
   * Generate a TOTP secret and otpauth URI for QR code.
   */
  async setupTotp(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (user.totpEnabled) {
      throw new HttpError(400, "TOTP is already enabled");
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: APP_NAME,
      label: user.email,
      secret,
    });

    return { secret, otpauthUrl };
  }

  /**
   * Verify a TOTP setup code and enable TOTP for the user.
   */
  async verifyAndEnable(userId: string, token: string, secret: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (user.totpEnabled) {
      throw new HttpError(400, "TOTP is already enabled");
    }

    const result = verifySync({ token, secret });
    if (!result.valid) {
      throw new HttpError(400, "Invalid TOTP code");
    }

    await userRepository.updateUser(userId, {
      totpSecret: secret,
      totpEnabled: true,
    });

    return { message: "TOTP enabled successfully" };
  }

  /**
   * Disable TOTP for a user.
   */
  async disableTotp(userId: string, password: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (!user.totpEnabled) {
      throw new HttpError(400, "TOTP is not enabled");
    }

    if (!user.password) {
      throw new HttpError(400, "Cannot disable TOTP on a Google-linked account");
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      throw new HttpError(401, "Invalid password");
    }

    await userRepository.updateUser(userId, {
      totpSecret: undefined,
      totpEnabled: false,
    });

    return { message: "TOTP disabled successfully" };
  }

  /**
   * Verify a TOTP code during login.
   */
  verifyToken(token: string, secret: string) {
    const result = verifySync({ token, secret });
    return result.valid;
  }
}
