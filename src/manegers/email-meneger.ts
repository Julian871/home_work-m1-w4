import {emailAdapters} from "../adapters/email-adapters";


export const emailManager = {
    async sendMessage(email: string, confirmationCode: string) {
        await emailAdapters.sendEmail(email, 'registration', `${confirmationCode} message`)
    }
}