import request from 'supertest'
import {app} from "../src/settings";
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const dbName = 'tests'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('only users', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    // GET --- /users

    it('should return status: 200 and empty array with a head', async () => {
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    });

    it('should return status: 401', async () => {
        await request(app)
            .get('/users')
            .expect({})
    });

    // POST --- /users

    it('should return 201 and empty newPost', async () => {
        const newUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: "2u6qMYS532",
                password: "string",
                email: "MqF7.S@X0i8DFvah.HBU"
            })
            .expect(201)
        expect(newUser.body).toEqual({
                id: expect.any(String),
                login: "2u6qMYS532",
                email: "MqF7.S@X0i8DFvah.HBU",
                createdAt: expect.any(String)
        })
    });

    it('should return 400 and errorsMessages', async () => {
        const newUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: true,
                password: 2023,
                email: "MqF7.S@X0i8DFvah"
            })
            .expect(400)
        expect(newUser.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'login',
                },
                {
                    message: expect.any(String),
                    field: 'password',
                },
                {
                    message: expect.any(String),
                    field: 'email',
                }
            ]})
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .post('/users')
            .send({})
            .expect(401)
    });

    // DELETE --- /users/:id

    it('should return 204 after delete User', async () => {
        const newUser = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send({
                login: "2u6qMYS532",
                password: "string",
                email: "MqF7.S@X0i8DFvah.HBU"
            })
        await request(app)
            .delete('/users/' + newUser.body.id)
            .auth('admin', 'qwerty')
            .expect(204)
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .delete('/users/id')
            .expect(401)
    });

    it('should return 404 if incorrect ID', async () => {
        await request(app)
            .delete('/users/650364b1b16fb2f6014b877a')
            .auth('admin', 'qwerty')
            .expect(404)
    });
})