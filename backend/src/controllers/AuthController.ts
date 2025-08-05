import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../email/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static creacteAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      const error = new Error("El usuario Ya existe");
      return res.status(409).json({ message: error.message });
    }

    try {
      const newUser = await User.create(req.body);
      newUser.password = await hashPassword(password);
      newUser.token = generateToken();
      await newUser.save();
      await AuthEmail.sendConfirmationEmail({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token,
      });
      res.status(201).json({ message: "Cuenta creada exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Hubo un error inesperado" });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Token no valido");

      return res.status(401).json({ message: error.message });
    }
    user.confirmed = true;
    user.token = null;
    await user.save();
    res.json({ message: "Cuenta Confirmada Correctamente" });
  };
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("El usuario no encontrado");
      return res.status(404).json({ message: error.message });
    }

    if (!user.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      return res.status(403).json({ message: error.message });
    }
    const isValidPassword = await checkPassword(password, user.password);
    if (!isValidPassword) {
      const error = new Error("La cuenta no ha sido confirmada");
      return res.status(401).json({ message: error.message });
    }

    const token = generateJWT(user.id);

    res.json({ token });
  };
  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ message: error.message });
    }
    user.token = generateToken();

    await user.save();

    await AuthEmail.sendPaswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res.json({ message: "revisa tu email para reestablecer tu contraseña" });
  };
  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    const IsTokenExist = await User.findOne({ where: { token } });
    if (!IsTokenExist) {
      const error = new Error("Token no encontrado");
      return res.status(404).json({ message: error.message });
    }
    res.json({ message: "Token valido" });
  };
  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Token no valido");
      return res.status(404).json({ message: error.message });
    }
    user.password = await hashPassword(password);
    user.token = null;
    await user.save();
    res.json({ message: "El password se modifico correctamente" });
  };
  static user = async (req: Request, res: Response) => {
    const user = req.user;
    res.json({ user });
  };
}
