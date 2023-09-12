import request from 'supertest'
import {app} from "../src/settings";


describe('/blogs', () => {
    let newBlog;
    beforeAll(async ()=> {
        await request(app).delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect([])
    });

    it('should return 404, if ID incorrect', async () => {
        await request(app)
            .get('/blogs/0')
            .expect(404)
    });

    it('should return 401', async () => {
        await request(app)
            .post('/blogs')
            .send({name: ''})
            .expect(401)
    });

    it('should not creat blogs with incorrect request', async () => {
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

    it('should return 200, get blog by ID', async () => {
        newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'new name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })
        const blog = await request(app)
            .get('/blogs/' + newBlog.body.id)
             .expect(200)

        expect(blog.body).toEqual({
            id: expect.any(String),
            name: blog.body.name,
            description: blog.body.description,
            websiteUrl: blog.body.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })
    });

    it('should return 200, get ubdateBlog by ID', async () => {
        newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'new name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })

        await request(app)
            .put('/blogs/' + newBlog.body.id)
            .auth('admin', 'qwerty')
            .send({
                name: 'update name',
                description: 'update',
                websiteUrl: 'https://web.update.org/k'
            })
        const blog = await request(app)
            .get('/blogs/' + newBlog.body.id)
            .expect(200)

        expect(blog.body).toEqual({
            id: expect.any(String),
            name: blog.body.name,
            description: blog.body.description,
            websiteUrl: blog.body.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })
    });

    it('should return 204, after delete blog by ID', async () => {
        newBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: 'new name',
                description: 'test',
                websiteUrl: 'https://web.telegram.org/k'
            })
        await request(app)
            .delete('/blogs/' + newBlog.body.id)
            .auth('admin', 'qwerty')
            .expect(204)
    });
})