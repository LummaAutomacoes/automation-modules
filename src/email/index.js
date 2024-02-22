
import nodemailer from 'nodemailer';
import path from 'path';

export async function sendEmailOutlook(subject, users, text, attachments = [], sender, pass) {
    try {
        // Configuração do transporter para usar o SMTP do Outlook
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // Servidor SMTP do Outlook
            port: 587, // Porta padrão
            secure: false, // true para 465, false para outras portas
            auth: {
                user: sender, // Seu endereço de email do Outlook
                pass: pass  // Sua senha do email
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        const adjustedAttachments = attachments.map(attachment => ({
            filename: path.basename(attachment.path), // Utiliza apenas o nome do arquivo, removendo o caminho
            path: attachment.path
        }));

        // Opções de email
        let mailOptions = {
            from: sender, // Endereço do remetente
            to: users, // Destinatário
            subject: subject, // Assunto do email
            text: text, // Corpo do email em texto plano
            attachments: adjustedAttachments // Anexos (opcional)
        };

        // Enviar o email
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Erro ao enviar o email: ', error);
    }
}

export async function sendEmailGmail(subject, users, text, attachments = [], sender, password) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender, //  email
                pass: password  //  senha
            }
        });

        let mailOptions = {
            from: sender,
            to: users,
            subject: `${subject}`,
            text: `${text}`,
            attachments: attachments // Adiciona anexos aqui
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Erro ao enviar o email: ', error);
    }
}