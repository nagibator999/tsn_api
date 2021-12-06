const db = require('../db')

class PostsController {
    async createPost(req, res) {
        const {userId, postText, likeCount} = req.body
        const newPost = await db.query(`INSERT INTO posts (user_id, posttext, likecount) values ($1, $2, $3) RETURNING *`,
        [userId, postText, likeCount])
        res.json(newPost.rows[0])
    }

    async getPosts(req, res) {
        let {current, size} = req.query;
        size = size || 5;
        current = current || 1;
        const users = await db.query(`SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2`, [size, (current - 1) * (size)]);
        const count = await db.query(`SELECT count(*) FROM users`);
        res.json({count: count.rows[0].count, users: users.rows});
    }

    async getOnePost(req, res) {
        const id = req.params.id
        const user = await db.query(`SELECT * FROM users WHERE id = ${id}`)
        res.json(user.rows[0])
    }

    async updatePost(req, res) {
        const {id, userName, country} = req.body
        console.log(id, userName, country) 
        const user = await db.query(`UPDATE users set userName = $1, country = $2 WHERE id = $3 RETURNING *`, [userName, country, id])
        res.json(user.rows[0])     
    }

    async deletePost(req, res) {
        const id = req.params.id
        const user = await db.query(`DELETE FROM users WHERE id = $1`, [id])
        res.json(user.rows[0])
    }

}

module.exports = new PostsController()