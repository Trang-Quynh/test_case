const fs = require('fs');
const qs = require('qs');
const topicService = require('../../service/topicService')
const userService = require('../../service/userService')
const guestController = require('./guestController')

class UserController {
    getGeneralPostHtml = (generalPosts, userHtml) => {
        let postHtml = '';
        let words = '';
        generalPosts.map((item) => {
            words = item.content.split('.')
            postHtml += `
             <div class="card bg-transparent border-0">
            <div class="row g-3">
              <div class="col-4">
                <!-- Blog image -->
                <img class="rounded" src="${item.img}" alt="">
              </div>
              <div class="col-8">
                <!-- Blog caption -->
                <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">${item.topic_name}</a>
                <h5><a href="/post/${item.id_post}" class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
                </div>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        userHtml = userHtml.replace('{generalPosts}', postHtml)
        return userHtml
    }

    getPrivatePostHtml = (privatePosts, userHtml) => {
        let postHtml = '';
        let words = '';
        privatePosts.map((item) => {
            words = item.content.split('.')
            postHtml += `
             <div class="card bg-transparent border-0">
            <div class="row g-3">
              <div class="col-4">
                <!-- Blog image -->
                <img class="rounded" src="${item.img}" alt="">
              </div>
              <div class="col-8">
                <!-- Blog caption -->
                <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">${item.topic_name}</a>
                <h5><a class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
                </div>
                <form method="POST" onSubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                <input name="idDelete" type="hidden" value='${item.id_post}'>
                <button type="submit" class="btn btn-outline-warning">Delete</button>
                </form>
                <a type="button" class="btn btn-outline-success" href="/editPost/${item.id_post}">Update</a>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        userHtml = userHtml.replace('{privatePosts}', postHtml)
        return userHtml
    }





    blogUser = async (req, res, id) => {
        console.log(req.method)
        if (req.method === 'GET') {
            fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                let generalPosts = await userService.getGeneralPost(id)
                userHtml = this.getGeneralPostHtml(generalPosts, userHtml)
                let privatePosts = await userService.getPrivatePost(id)
                userHtml = this.getPrivatePostHtml(privatePosts, userHtml)
                res.write(userHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', async () => {
                let receiveData = qs.parse(data);
                console.log(receiveData)
                if (receiveData.idDelete) {
                    let id_post = receiveData.idDelete
                    await userService.deleteAPost(id_post)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();
                }
                    else if(receiveData.search) {
                    let keyword = receiveData.search;
                    console.log(id + 'id user') // van dung
                    let generalPostSearchByKeyword = await userService.findGeneralPostByKeyword(id,keyword);
                    console.log(generalPostSearchByKeyword)

                    let myPostSearchByKeyword = await userService.findMyPostByKeyword(id,keyword);

                    fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                        userHtml = this.getGeneralPostHtml(generalPostSearchByKeyword, userHtml);
                        userHtml = this.getPrivatePostHtml(myPostSearchByKeyword, userHtml);
                        console.log(111)

                        // for(let i = 0;i<postByKeyword.length;i++){
                        //     console.log(postByKeyword[i].id_user)
                        //     if(postByKeyword[i].id_user === id_user) {
                        //         console.log("post by me")
                        //         userHtml = this.getPrivatePostHtml(postByKeyword, userHtml)
                        //     } else {
                        //         console.log("post public")
                        //
                        //         userHtml = this.getGeneralPostHtml(postByKeyword, userHtml)
                        //     }
                        // }
                        // res.writeHead(301, {location: `/blogUser/${id}`})
                        res.write(userHtml);
                        res.end();
                    })
                }
            })
        }
    }


    editPost = async (req, res, id) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/editPost.html', 'utf-8', async (err, editHtml) => {
                let post = await userService.findAPost(id)
                let topics = await topicService.findAllTopic()
                editHtml = editHtml.replace('{title}', post[0].title)
                editHtml = editHtml.replace('{content}', post[0].content)
                let htmlTopic = '';
                topics.map(item => {
                    htmlTopic += `<option value="${item.id_topic}">${item.topic_name}</option>`
                })
                editHtml = editHtml.replace('{topics}', htmlTopic)
                res.write(editHtml);
                res.end()
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })

            req.on('end', async () => {
                console.log(data)
                let editPost = qs.parse(data);
                console.log(editPost)
                console.log(id)
                //dung id
                await userService.updateAPost(id,editPost)
                res.writeHead(301, {location: `/blogUser/${guestController.currentUserId}`})
                res.end();
            })
        }
    }

    addPost = async (req, res, id_user) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/addPost.html', 'utf-8', async (err, addHtml) => {
                let topics = await topicService.findAllTopic()
                console.log(topics)
                let htmlTopics = ''
                topics.map(item => {
                    htmlTopics += `
                  <option value="${item.id_topic}">${item.topic_name}</option>
                  `
                })
                addHtml = addHtml.replace('{topics}', htmlTopics);
                res.write(addHtml);
                res.end()
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', () => {
                let addPost = qs.parse(data);
                let id_user = guestController.currentUserId
                userService.createAPost(id_user,addPost)
                res.writeHead(301, {location: `/blogUser/${id_user}`})
                res.end();
            })
        }
    }
}

module.exports = new UserController