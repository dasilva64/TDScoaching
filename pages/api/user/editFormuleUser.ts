import { withIronSessionApiRoute } from "iron-session/next";
import prisma from "../../../lib/prisma";
import { validationBody } from "../../../lib/validation";
import validator from "validator";
import nodemailer from "nodemailer";

export default withIronSessionApiRoute(
  async function editFormuleUser(req, res) {
    if (req.method === "POST") {
      if (req.session.user) {
        const { formule, pseudo } = await req.body;
        let arrayMessageError = validationBody(req.body);
        if (arrayMessageError.length > 0) {
          return res.status(400).json({
            status: 400,
            message: arrayMessageError,
          });
        }
        let user = await prisma.user.findUnique({
          where: { id: req.session.user.id },
        });
        if (user === null) {
          return res.status(400).json({
            status: 400,
            message: "L'utilisateur n'as pas été trouvé, veuillez réessayer",
          });
        } else {
          let copyFormule: any = user.typeMeeting;
          let data;
          if (copyFormule.type === "découverte") {
            if (user.meetingId !== null) {
              return res.status(400).json({
                status: 400,
                message:
                  "Vous ne pouvez pas changer d'offre car vous avez déjà un rendez-vous, veuillez l'annuler",
              });
            } else if (formule === "unique") {
              data = { type: validator.escape(formule.trim()) };
            } else if (formule === "flash") {
              data = {
                type: validator.escape(formule.trim()),
                number: 3,
              };
            } else if (formule === "longue") {
              data = {
                type: validator.escape(formule.trim()),
                number: 10,
              };
            }
          } else if (copyFormule.type === "unique") {
            if (user.meetingId !== null) {
              return res.status(400).json({
                status: 400,
                message:
                  "Vous ne pouvez pas changer d'offre car vous avez déjà un rendez-vous, veuillez l'annuler",
              });
            } else if (formule === "flash") {
              data = {
                type: validator.escape(formule.trim()),
                number: 3,
              };
            } else if (formule === "longue") {
              data = {
                type: validator.escape(formule.trim()),
                number: 10,
              };
            }
          } else if (copyFormule.type === "flash") {
            if (user.meetingId !== null) {
              return res.status(400).json({
                status: 400,
                message:
                  "Vous ne pouvez pas changer d'offre car vous avez déjà un rendez-vous, veuillez l'annuler",
              });
            } else if (copyFormule.number === 3) {
              if (formule === "unique") {
                data = { type: validator.escape(formule.trim()) };
              } else if (formule === "longue") {
                data = {
                  type: validator.escape(formule.trim()),
                  number: 10,
                };
              }
            } else {
              return res.status(404).json({
                status: 404,
                message:
                  "Vous ne pouvez pas changer d'offre en cours, veuillez d'abord l'annuler",
              });
            }
          } else if (copyFormule.type === "longue") {
            if (user.meetingId !== null) {
              return res.status(400).json({
                status: 400,
                message:
                  "Vous ne pouvez pas changer d'offre car vous avez déjà un rendez-vous, veuillez l'annuler",
              });
            } else if (copyFormule.number === 10) {
              if (formule === "unique") {
                data = { type: validator.escape(formule.trim()) };
              } else if (formule === "flash") {
                data = {
                  type: validator.escape(formule.trim()),
                  number: 3,
                };
              }
            } else {
              return res.status(404).json({
                status: 404,
                message:
                  "Vous ne pouvez pas changer d'offre en cours, veuillez d'abord l'annuler",
              });
            }
          }
          let editUser = await prisma.user.update({
            where: {
              id: req.session.user.id,
            },
            data: {
              typeMeeting: data,
            },
          });
          if (editUser === null) {
            return res.status(404).json({
              status: 404,
              message:
                "Une erreur est survenue lors du choix de la formule, veuillez réessayer",
            });
          } else {
            const allMeeting = await prisma.meeting.findMany({
              where: { startAt: { gte: new Date() } },
              select: {
                startAt: true,
              },
            });
            let meeting;
            if (editUser.meetingId === null) {
              meeting = null;
            } else {
              meeting = await prisma.meeting.findUnique({
                where: {
                  id: editUser.meetingId,
                },
              });
            }
            let smtpTransport = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: process.env.SECRET_SMTP_EMAIL,
                pass: process.env.SECRET_SMTP_PASSWORD,
              },
            });
            let mailOptions = {
              from: process.env.SECRET_SMTP_EMAIL,
              to: process.env.SECRET_SMTP_EMAIL,
              subject: "Validation de votre compte",
              attachements: [
                {
                  filename: `contrat-${editUser.firstname}-${editUser.lastname}.pdf`,
                  path: `https://tds-lilac.vercel.app/assets/pdf/contrat-${editUser.firstname}-${editUser.lastname}.pdf`,
                },
              ],
            };
            smtpTransport.sendMail(mailOptions);
            let userObject = {
              meetings: allMeeting,
              meeting: meeting,
              typeMeeting: editUser.typeMeeting,
              discovery: editUser.discovery,
            };
            return res.status(200).json({
              status: 200,
              body: userObject,
              message: "Votre formule a été mis à jours avec succès",
            });
          }
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Vous n'êtes pas connecté, veuillez réessayer",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: "Une erreur est survenue, veuillez réessayer",
      });
    }
  },
  {
    password:
      "tesdfjklsjtesdfjktesdfjklsjdfljslkdfjlsjdflslqfdjkstlsjdfljslkdfjlsjdflslqfdjkstdfljslkdfjlsjdflslqfdjkst",
    cookieName: "test",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
