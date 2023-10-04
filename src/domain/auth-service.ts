import bcrypt from "bcrypt";
import {userAccountDBType} from "../db/types/user-types";
import {ObjectId} from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add'
import {usersRepositories} from "../repositories/users-db-repositories";
import {emailManager} from "../manegers/email-meneger";


export const authService = {
    async createUser(login: string, email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const user: userAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmation: false
            },
            token: {
                accessToken: null,
                refreshToken: null
            }
        }
        await usersRepositories.createAuthNewUser(user)
        try {
            await emailManager.sendConfirmationLink(email, user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.log('email send Error:', error)
            //await usersRepositories.deleteUserById(user._id.toString())
        }
return;
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
}