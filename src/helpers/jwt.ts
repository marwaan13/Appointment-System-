import jwt from "jsonwebtoken";

export const generateToken = (userId: number): string => {
  const payload = {
    userId,
  };
  // generated new token
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "3d",
  });
};
