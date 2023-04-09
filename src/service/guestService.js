const connection = require('../entity/connection');

class GuestService {
    connect;


    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }

    getGuest = (user) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from account where user_name = '${user.user_name}'and password = '${user.password}';`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }

    getPublicPost(){
        return new Promise((resolve, reject) => {
            this.connect.query(`SELECT id_post, content, title, img, time, topic_name FROM posts inner join topic on topic.id_topic = posts.id_topic where status = 'public' order by time desc;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    getPublicPostByKeyword(keyword){
        return new Promise((resolve, reject) => {
            this.connect.query(`SELECT id_post, content, title, img, time, topic_name FROM posts inner join topic on topic.id_topic = posts.id_topic where status = 'public'  and (content like '%${keyword}%' or title like '%${keyword}%') order by time desc;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    getOldPublicPost(){
        return new Promise((resolve, reject) => {
            this.connect.query(`SELECT id_post, content, title, img, time, topic_name FROM posts inner join topic on topic.id_topic = posts.id_topic where status = 'public' limit 5;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })

    }

    getDetailPost(id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time, id_post, topic_name, status, id_user from posts inner join topic on posts.id_topic = topic.id_topic where id_post = ${id} ;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }


}
module.exports = new GuestService();