import request from 'supertest'
import {app} from "../src/settings";
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const dbName = 'tests'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('only auth', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    // POST --- /auth

    it('should return 204 if login and password are correct', async () => {
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: "2u6qMYS532",
                password: "string",
                email: "MqF7.S@X0i8DFvah.HBU"
            })

        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: "2u6qMYS532",
                password: "string"
            })
            .expect(204)
    });

    it('should return 400 and errorsMessages', async () => {
        const auth = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 1,
                password: 1
            })
            .expect(400)
        expect(auth.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'loginOrEmail',
                },
                {
                    message: expect.any(String),
                    field: 'password',
                }
            ]})
    });

    it('should return 401 if incorrect password', async () => {
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: "2u6qMYS532",
                password: "string",
                email: "MqF7.S@X0i8DFvah.HBU"
            })

        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: "incorrect login",
                password: "string"
            })
            .expect(401)
    });
})