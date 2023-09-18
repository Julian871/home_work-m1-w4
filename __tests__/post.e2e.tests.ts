import request from 'supertest'
import {app} from "../src/settings";
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const dbName = 'tests'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('only posts', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    // GET --- /posts

    it('should return status: 200 and empty array with a head', async () => {
        await request(app)
            .get('/posts')
            .expect({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    });

    // POST --- /posts

    it('should return 201 and empty newPost', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })
            .expect(201)
        expect(newPost.body).toEqual({
            id: expect.any(String),
            title: "test title",
            shortDescription: "test direction",
            content: "test content",
            blogId: newBlog.body.id,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
    });

    it('should return Errors message and status: 400', async () => {
        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
            title: "   ",
            shortDescription: 1,
            content: true,
            blogId: false
            })
            .expect(400)
        expect(newPost.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title',
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription',
                },
                {
                    message: expect.any(String),
                    field: 'content',
                },
                {
                    message: expect.any(String),
                    field: 'blogId',
                }
            ]})
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .post('/posts')
            .send({})
            .expect(401)
    });

    // GET --- /posts/:id

    it('should return 200 and empty newPost', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })

        await request(app)
            .get('/posts/' + newPost.body.id)
            .expect(200)
        expect(newPost.body).toEqual({
            id: expect.any(String),
            title: "test title",
            shortDescription: "test direction",
            content: "test content",
            blogId: newBlog.body.id,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
    });

    it('should return 200 and empty newPost', async () => {
        await request(app)
            .get('/posts/65035d195dad2805188f9617')
            .expect(404)
    });

    // PUT --- /posts/:id

    it('should return 204', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })

        await request(app)
            .put('/posts/' + newPost.body.id)
            .auth('admin', 'qwerty')
            .send({
                title: "test update",
                shortDescription: "test update",
                content: "test update",
                blogId: newBlog.body.id
            })

    });

    it('should return 400 and errorsMessages', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })

        const updatePost = await request(app)
            .put('/posts/' + newPost.body.id)
            .auth('admin', 'qwerty')
            .send({
                title: 1,
                shortDescription: "          ",
                content: "      ",
                blogId: 'newBlog.body.id'
            })
            .expect(400)
        expect(updatePost.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title',
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription',
                },
                {
                    message: expect.any(String),
                    field: 'content',
                },
                {
                    message: expect.any(String),
                    field: 'blogId',
                }
            ]})

    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .put('/posts/id')
            .send({})
            .expect(401)
    });

    it('should return 404 if incorrect ID', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .put('/posts/650364b1b16fb2f6014b877a')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })
            .expect(404)
    });

    // DELETE --- /posts/:id

    it('should return 204, after delete post', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test title",
                shortDescription: "test direction",
                content: "test content",
                blogId: newBlog.body.id
            })

        await request(app)
            .delete('/posts/' + newPost.body.id)
            .auth('admin', 'qwerty')
            .expect(204)
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .delete('/posts/id')
            .expect(401)
    });

    it('should return 404 if incorrect ID', async () => {
        await request(app)
            .delete('/posts/650364b1b16fb2f6014b877a')
            .auth('admin', 'qwerty')
            .expect(404)
    });
})