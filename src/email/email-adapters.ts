import nodemailer from 'nodemailer'

export const emailAdapters = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "julianmedvedev.rabota@gmail.com",
                pass: "dfxjlieukbzpjcxw"
            }
        })

        await transport.sendMail({
            from: 'Julian <julianmedvedev.rabota@gmail.com>',
            to: email,
            subject: subject,
            html: message
        })
    }
}