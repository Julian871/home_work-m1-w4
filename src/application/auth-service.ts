import bcrypt from "bcrypt";
import {userAccountDBType} from "../db/types/user-types";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {UsersRepository} from "../repositories/users-repository";
import {emailManager} from "../email/email-meneger";
import {ConnectRepository} from "../repositories/connect-repository";
import {injectable} from "inversify";


@injectable()
export class AuthService {

    constructor(protected usersRepositories: UsersRepository,
                protected connectRepositories: ConnectRepository) {}

    async createUser(login: string, email: string, password: string, deviceId: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const user: userAccountDBType = {
            _id: new ObjectId(),
            recoveryCode: null,
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
                accessToken: null
            }
        }
        await this.usersRepositories.createAuthNewUser(user)
        await this.connectRepositories.updateUserId(user._id, deviceId)
        try {
            await emailManager.sendConfirmationLink(email, user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.log('email send Error:', error)
        }
        return;
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}