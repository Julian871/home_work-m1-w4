import request from 'supertest'
import {app} from "../src/settings";
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";

dotenv.config()

const dbName = 'tests'
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`

describe('only blogs', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    afterAll(async () => {
        await client.close()
    })

    // GET --- /blogs

    it('should return status: 200 and empty array with a head', async () => {
        await request(app)
            .get('/blogs')
            .expect({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    });

    // POST --- /blogs

    it('should return 201 and empty newBlog', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })
            .expect(201)
            expect(newBlog.body).toEqual({
                id: expect.any(String),
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k',
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
    });

    it('should return Errors message and status: 400', async () => {
        const blog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: '  ',
                description: 11,
                websiteUrl: 'string'
            })
            .expect(400)
        expect(blog.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name',
                },
                {
                    message: expect.any(String),
                    field: 'description',
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl',
                },
            ]})
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .post('/blogs')
            .send({})
            .expect(401)
    });

    // GET --- /blogs/{blogID}/posts

    it('should return status: 200 and empty array with a head', async () => {
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
                title: "test",
                shortDescription: "test",
                content: "test",
                blogId: newBlog.body.id
            })

        await request(app)
            .get('/blogs/' + newPost.body.blogId + '/posts')
            .expect({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{
                    id: newPost.body.id,
                    title: 'test',
                    shortDescription: "test",
                    content: "test",
                    blogId: newPost.body.blogId,
                    blogName: newPost.body.blogName,
                    createdAt: newPost.body.createdAt
                }]
            })
    });

    it('should return status: 404, If specified blog is not exists', async () => {

        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .get('/blogs/' + newBlog.body.id + '/posts')
            .expect(404)

    });

    // POST --- /blogs/{blogID}/posts

    it('should return status: 201 and newPost', async () => {
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
                title: "test",
                shortDescription: "test",
                content: "test",
                blogId: newBlog.body.id
            })
            .expect(201)
        expect(newPost.body).toEqual({
            id: expect.any(String),
            title: "test",
            shortDescription: "test",
            content: "test",
            blogId: newBlog.body.id,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
    });

    it('should return status: 400 and errorsMessages', async () => {
        const newPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: true,
                shortDescription: false,
                content: true,
                blogId: 'string'
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
            .post('/blogs/id/posts')
            .send({})
            .expect(401)
    });

    it('should return 404 If specified blog doesn\'t exists', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .post('/blogs/65057b9ecefa1448994fd9a4/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "test",
                shortDescription: "test",
                content: "test",
                blogId: newBlog.body.id
            })
            .expect(404)
    });

    // GET --- /blogs/:id

    it('should return 200 and empty newBlog', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .get('/blogs/' + newBlog.body.id)
            .expect(200)
            expect(newBlog.body).toEqual({
                id: expect.any(String),
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k',
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
    });

    it('should return 404', async () => {
        await request(app)
            .get('/blogs/incorrectId')
            .expect(404)
    });

    // PUT --- /blogs/:id

    it('should return 204', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .put('/blogs/' + newBlog.body.id)
            .auth('admin', 'qwerty')
            .send({
                name: 'test update',
                description: 'update',
                websiteUrl: 'https://web.telegram.org/k'
            })
            .expect(204)
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

        const updateBlog = await request(app)
            .put('/blogs/' + newBlog.body.id)
            .auth('admin', 'qwerty')
            .send({
                name: '  ',
                description: 11,
                websiteUrl: 'string'
            })
            .expect(400)
        expect(updateBlog.body).toEqual({errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name',
                },
                {
                    message: expect.any(String),
                    field: 'description',
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl',
                },
            ]})
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .put('/blogs/id')
            .send({})
            .expect(401)
    });

    it('should return 404 if incorrect ID', async () => {
        await request(app)
            .put('/blogs/650364b1b16fb2f6014b877a')
            .auth('admin', 'qwerty')
            .send({
                name: 'test update',
                description: 'update',
                websiteUrl: 'https://web.telegram.org/k'
            })
            .expect(404)
    });

    // DELETE --- /blogs/:id

    it('should return 204, after delete blog', async () => {
        const newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'test name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })
        await request(app)
            .delete('/blogs/' + newBlog.body.id)
            .auth('admin', 'qwerty')
            .expect(204)
    });

    it('should return 401: Unauthorized', async () => {
        await request(app)
            .delete('/blogs/id')
            .expect(401)
    });

    it('should return 404 if incorrect ID', async () => {
        await request(app)
            .delete('/blogs/650364b1b16fb2f6014b877a')
            .auth('admin', 'qwerty')
            .expect(404)
    });
})