import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from ".";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const displayName = profile.displayName || "";
        const profilePicture = profile.photos?.[0]?.value || "";

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        // Check if user exists with this Google ID
        const googleUser = await userRepository.getUserByGoogleId(googleId);

        if (googleUser) {
          return done(null, googleUser);
        }

        // Check if user exists with this email (link account)
        const existingUser = await userRepository.getUserByEmail(email);

        if (existingUser) {
          // Link Google account to existing user
          const updatedUser = await userRepository.updateUser(existingUser._id.toString(), {
            googleId,
            profilePicture: profilePicture || existingUser.profilePicture,
          });
          if (!updatedUser) {
            return done(new Error("Failed to link Google account"), undefined);
          }
          return done(null, updatedUser);
        }

        // Create a new user with Google profile info
        const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 6);
        const newUser = await userRepository.createUser({
          firstName,
          lastName,
          username,
          email,
          phoneNumber: "",
          profilePicture,
          googleId,
          role: "user",
          password: undefined,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
