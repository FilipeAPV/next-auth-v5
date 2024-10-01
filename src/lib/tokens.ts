import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEMail,
} from "@/data/verification-token";
import { v4 as uuidV4 } from "uuid";

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
