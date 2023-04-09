const connection = require('../entity/connection');

class AdminService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }

    getFounder(){
        return new Promise((resolve, reject) => {
            this.connect.query(`select avatar, user_name from account where power = 1`, (err, admins) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(admins)
                }
            })
        })
    }
    getAllAccount(){
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from account where power = 0`, (err, admins) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(admins)
                }
            })
        })
    }

    getAllPost(){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, id_post, topic_name, topic.id_topic, time from posts inner join topic where posts.id_topic = topic.id_topic;`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }

    deleteAPost(post_id){
        return new Promise((resolve, reject) => {
            this.connect.query(`delete from posts where id_post=${post_id}`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('xoa thanh cong')
                }
            })
        })
    }

    findPostByKeyword(keyword){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, id_post, topic_name, topic.id_topic, time from posts inner join topic on posts.id_topic = topic.id_topic where content like '%${keyword}%';`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    findPostByTopic(topic_id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from posts where id_topic = ${topic_id} `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    findUserByUserName(user_name){
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from account where user_name like '%${user_name}%'`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}
module.exports = new AdminService();