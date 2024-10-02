"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "./../data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      // Why do we have the following line?
      // During the registration process, it is not needed. But it is needed for when the user wants to modify their email address.
      // When the user modifies their email in the seetings page, we are not going to immediately update the email in the DB.
      // Instead, we are going to create a token with that email and we will send a verification email to the new email address.
      // When the user clicks on the verification link, we are going to update the email in the DB.
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
