import {emailAdapters} from "../adapters/email-adapters";


export const emailManager = {
    async sendConfirmationCode(email: string, confirmationCode: string) {
        await emailAdapters.sendEmail(email, 'registration', `Confirmation code: ${confirmationCode}`)
    },

    async sendConfirmationLink(email: string, confirmationCode: string) {
        await emailAdapters.sendEmail(email, 'registration-confirmation', `https://somesite.com/confirm-email?code=${confirmationCode}`)
    }
}