import {emailAdapters} from "../adapters/email-adapters";


export const emailManager = {
    async sendConfirmationLink(email: string, confirmationCode: string) {
        await emailAdapters.sendEmail(email, 'registration-confirmation', `<h1>Thanks for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>`)
    },

    async sendRecoveryCode(email: string, recoveryCode: string) {
        await emailAdapters.sendEmail(email, 'recovery code', `<h1>Thanks for your registration</h1>
 <p>To finish password recovery please follow the link below:
     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
 </p>`)
    }
}