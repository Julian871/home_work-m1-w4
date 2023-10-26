import request from 'supertest'
import {app} from "../src/settings";
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const dbName = 'tests'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('home-work 9', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    // GET --- /device list

    it('', async () => {
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

})