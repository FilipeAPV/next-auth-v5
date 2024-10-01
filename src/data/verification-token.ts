import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEMail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const createVerificationToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  try {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
