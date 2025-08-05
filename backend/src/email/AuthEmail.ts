import { transport } from "../config/nodeMailer";

type EmailTypes = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailTypes) => {
    const email = await transport.sendMail({
      from: "pintogerman281@gmail.com",
      to: user.email,
      subject: "Confirm your email",
      text: `Confirma tu cuenta en CashTracker`,
      html: `
        <p>HOla ${user.name}, has creado tu cuenta en CashTracker ya esta:
        <p>Visita el siguiente enlace:</p>
        <a href="#">Confirmar Cuenta</a>
        <p>e ingresa el codigo: <b>${user.token}</b></p>
        `,
    });
    console.log(email);
  };
  static sendPaswordResetToken = async (user: EmailTypes) => {
    const email = await transport.sendMail({
      from: "pintogerman281@gmail.com",
      to: user.email,
      subject: "Restablece tu password",
      text: `Confirma tu cuenta en CashTracker`,
      html: `
        <p>HOla ${user.name}, has solicitado reestablecer tu password
        <p>Visita el siguiente enlace:</p>
        <a href="#">Reestablecer password</a>
        <p>e ingresa el codigo: <b>${user.token}</b></p>
        `,
    });
    console.log(email);
  };
}
