const connection = require('../entity/connection');

class UserService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }
    findAPost = (id) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select title, content, img, status, topic_name, posts.id_topic from posts inner join topic on posts.id_topic = topic.id_topic where id_post = '${id}';`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(post)
                }
            })
        })
    }

    getUser = (user) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from users where user_name = '${user.user_name}'and password = '${user.password}';`, (err, users) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
        })
    }
    updateAccount = (user) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`update account set user_name = '${user.user_name}', password = '${user.password}', avatar = '${user.img}'`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }

    // Hien thi bai viet pucbic va status friend cua friend
    getGeneralPost(id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time, id_post, topic_name, status, id_user from posts inner join topic on posts.id_topic = topic.id_topic where (id_user <> ${id} and status = 'public') or ((select check_friend from friend_manager where id_user_01 = id_user and id_user_02 = ${id}) = 1 and status = 'friend');`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    getPrivatePost(id){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time, id_post, topic_name, status, id_user from posts inner join topic on posts.id_topic = topic.id_topic where id_user = ${id} `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }


    // Tim cac bai viet theo tu khoa
    findGeneralPostByKeyword(id_user, keyword){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title,id_user, time, id_post, topic_name from posts inner join topic on posts.id_topic = topic.id_topic where content like '%${keyword}%' and ((status = 'public' and id_user <> '${id_user}' ) or ((select check_friend from friend_manager where id_user_01 = id_user and id_user_02 = '${id_user}') = 1 and status = 'friend'));`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                    console.log(posts)
                }
            })
        })
    }

    findMyPostByKeyword(id_user, keyword){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title,id_user, time, id_post, topic_name from posts inner join topic on posts.id_topic = topic.id_topic where content like '%${keyword}%' and id_user = '${id_user}'`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                    console.log(posts)
                }
            })
        })
    }
    // Tim cac bai viet cua minh
    findMyPost(id_user){
        return new Promise((resolve, reject) => {
            this.connect.query(`select content, img, title, time from posts where id_user = ${id_user}`, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(posts)
                }
            })
        })
    }
    // Gui loi moi ket ban
    sendAddFriendRequest(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into friend_manager values(${id_user},${id_partner},0)`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('sent successfully')
                }
            })
        })
    }
    // Chap nhan loi moi ket ban
    acceptAddFriendRequets(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into friend_manager values(${id_user},${id_partner},1)
            update friend_manager set check_friend = 1 where id_user_01 = ${id_partner} and id_user_02 = ${id_user}
            `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('accepted add friend request')
                }
            })
        })
    }
    // Check xem da la friend chua neu 1: friend;  0: da gui; null: chua gui
    checkRelationship(id_user, id_partner){
        return new Promise((resolve, reject) => {
            this.connect.query(`select check_friend from friend_manager where id_user_01 = '${id_user}' and id_user_02 = ${id_partner}`, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    // Tu choi loi moi ket ban



    //Xoa mot bai viet cua minh
    deleteAPost( id_post){
        return new Promise((resolve, reject) => {
            this.connect.query(`delete from posts where id_post=${id_post} `, (err, posts) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('accepted add friend request')
                }
            })
        })
    }

    // Sua bai viet
    updateAPost(id,editPost){
        return new Promise((resolve, reject) => {
            this.connect.query(`update posts set content = '${editPost.content}', img = '${editPost.img}', title = '${editPost.title}', id_topic= '${editPost.topic}', status= '${editPost.status}' where id_post = '${id}'`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(post)
                }
            })
        })
    }

    // Tao bai viet
    createAPost(id_user, post){
        return new Promise((resolve, reject) => {
            this.connect.query(`Insert into posts (id_user, content, img, title, time, id_topic, status)
 VALUES ('${id_user}', '${post.content}', '${post.img}', '${post.title}', now(), '${post.id_topic}' ,'${post.status}');
`, (err, post) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(post)
                }
            })
        })
    }

    createUser= (user) =>{
        return new Promise((resolve, reject) => {
            this.connect.query(`insert into account(user_name, password, power, avatar) values('${user.user_name}','${user.password}', 0, '${user.image}')`, (err, user) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }
}
module.exports = new UserService();