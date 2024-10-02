import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEMail,
} from "@/data/verification-token";
import { v4 as uuidV4 } from "uuid";
import { db } from "./db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEMail(email);

  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id);
  }

  const verificationToken = await createVerificationToken(
    email,
    token,
    expires
  );

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  // If a token already exists, delete it.
  // Happens when user requires to reset password multiple times.
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new token and add it to the Database.
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
