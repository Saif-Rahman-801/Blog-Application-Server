import jwt from "jsonwebtoken";
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
};

export default generateToken;
