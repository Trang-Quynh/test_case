const fs = require('fs');
const qs = require('qs');
const topicService = require('../../service/topicService')
const userService = require('../../service/userService')
const guestController = require('./guestController')
const adminService = require("../../service/adminService");

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
                <a href="/post/${item.id_post}" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">${item.topic_name}</a>
                <h5><a class="btn-link stretched-link text-reset fw-bold">${item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">${words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="/post/${item.id_post}"> <i class="bi bi-calendar-date pe-1"></i>${item.time}</a>
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


    getAvatar= (user,userHtml) => {
        console.log(user)
        let avatarHtml = `
         <img className="avatar-img rounded-2"  width="20" height="20" src="${user[0].img}" alt="">
        `
        userHtml = userHtml.replace('{avatar}', avatarHtml)
        return userHtml
    }
    getStranger = (accounts, adminHtml) => {
        let accountHtml = '';
        accounts.map((item) => {
            accountHtml += `
             <div class="hstack gap-2">
                                    <!-- Avatar -->
                  <div class="avatar">
                      <img class="avatar-img rounded-circle" src="${item.avatar}" alt="">
                  </div>
                                    <!-- Title -->
                  <div class="overflow-hidden">
                      <a class="h6 mb-0" href="#!">${item.user_name}</a>
                  </div>
                                    <!-- Button -->
                  <a class="btn btn-primary rounded-circle icon-md ms-auto" href="#">
                  <form method="post">
                   <input name="idAddFriend" type="hidden" value='${item.id_user}'>
                   <button type="submit" class="btn btn-primary-soft rounded-circle icon-md ms-auto" href="#"><i class="fa-solid fa-plus"> </i></button>
                   </form>
                   </a>
                   
              </div>         
            `
        })
        adminHtml = adminHtml.replace('{Account2}', accountHtml)


        return adminHtml
    }
    getAccountFriends = (accounts, adminHtml) => {
        let accountHtml = '';
        accounts.map((item) => {
            accountHtml += `

             <div class="hstack gap-2">
                                    <!-- Avatar -->
                  <div class="avatar">
                      <img class="avatar-img rounded-circle" src="${item.avatar}" alt="">
                  </div>
                                    <!-- Title -->
                  <div class="overflow-hidden">
                      <a class="h6 mb-0" href="#!">${item.user_name}</a>
                  </div>
                                    <!-- Button -->
                  <a class="btn btn-primary rounded-circle icon-md ms-auto" href="#">
                  <form method="POST">
                   <input name="idUnFriend" type="hidden" value='${item.id_user}'>
                   <button type="submit" class="btn btn-primary-soft rounded-circle icon-md ms-auto" href="#"><i class="fa-solid fa-plus"> </i></button>
                   </form>
                   </a>
                   
              </div>         
            `
        })
        adminHtml = adminHtml.replace('{Account1}', accountHtml)


        return adminHtml
    }
    getPending = (accounts, adminHtml) => {
        let accountHtml = '';
        accounts.map((item) => {
            accountHtml += `
             <div class="hstack gap-2">
                                    <!-- Avatar -->
                  <div class="avatar">
                      <img class="avatar-img rounded-circle" src="${item.avatar}" alt="">
                  </div>
                                    <!-- Title -->
                  <div class="overflow-hidden">
                      <a class="h6 mb-0" href="#!">${item.user_name}</a>
                  </div>
                                    <!-- Button -->
                  <a class="btn btn-primary rounded-circle icon-md ms-auto" href="#">
                  <form method="POST">
                   <input name="accept" type="hidden" value='${item.id_user}'>
                   <button type="submit" class="btn btn-primary-soft rounded-circle icon-md ms-auto" href="#"><i class="fa-solid fa-plus"> </i></button>
                   </form>
                   <form method="POST">
                   <input name="refuse" type="hidden" value='${item.id_user}'>
                   <button type="submit" class="btn btn-primary-soft rounded-circle icon-md ms-auto" href="#"><i class="fa-solid fa-plus"> </i></button>
                   </form>
                   </a>
                   
              </div>         
            `
        })
        adminHtml = adminHtml.replace('{Account}', accountHtml)


        return adminHtml
    }


    blogUser = async (req, res, id) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                let generalPosts = await userService.getGeneralPost(id)
                userHtml = this.getGeneralPostHtml(generalPosts, userHtml)
                let privatePosts = await userService.getPrivatePost(id)
                userHtml = this.getPrivatePostHtml(privatePosts, userHtml)
                let user = await userService.findUserById(id)
                userHtml = this.getAvatar(user,userHtml);


                let friends = await  userService.getFriend(id)
                console.log(friends)
                userHtml = this.getAccountFriends(friends, userHtml)

                let pending = await  userService.getPending(id)
                console.log(pending)
                userHtml = this.getPending(pending, userHtml)

                let stranger = await  userService.getStranger(id)
                console.log(stranger)
                userHtml = this.getStranger(stranger, userHtml)







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
                if (receiveData.idDelete) {
                    let id_post = receiveData.idDelete
                    await userService.deleteAPost(id_post)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();
                } else if(receiveData.search) {
                    let keyword = receiveData.search;
                    let generalPostSearchByKeyword = await userService.findGeneralPostByKeyword(id,keyword);
                    let myPostSearchByKeyword = await userService.findMyPostByKeyword(id,keyword);
                    fs.readFile('./src/views/blog_user.html', 'utf-8', async (err, userHtml) => {
                        userHtml = this.getGeneralPostHtml(generalPostSearchByKeyword, userHtml);
                        userHtml = this.getPrivatePostHtml(myPostSearchByKeyword, userHtml);
                        res.write(userHtml);
                        res.end();
                    })
                } else if(receiveData.idAddFriend) {
                    let idPartner = receiveData.idAddFriend;
                    await userService.sendAddFriendRequest(id,idPartner)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();

                }else if(receiveData.accept) {
                    let idPartner = receiveData.accept;
                    console.log(idPartner)
                    await userService.acceptAddFriendRequets(id,idPartner)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();

                }else if(receiveData.refuse) {
                    let idPartner = receiveData.refuse;
                    await userService.denyAddFriendRequest(id,idPartner)
                    res.writeHead(301, {location: `/blogUser/${id}`})
                    res.end();

                }
            })
        }
    }




    editPost = async (req, res,id) => {

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
                let editPost = qs.parse(data);
                //dung id
                await userService.updateAPost(id,editPost)
                res.writeHead(301, {location: `/blogUser/${guestController.currentUserId}`})
                res.end();
            })
        }
    }

    editAccount = async (req, res) => {
        let id = guestController.currentUserId
        console.log(id)
        if (req.method === 'GET') {

            fs.readFile('./src/views/editAccount.html', 'utf-8', async (err, editHtml) => {
                let user = await userService.findUserById(id)
                console.log(user)
                editHtml = editHtml.replace('{user_name}', user[0].user_name);
                editHtml = editHtml.replace('{password}', user[0].password);
                res.write(editHtml);
                res.end()
            })
        } else {
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', async () => {
                let editUser = qs.parse(data);
                console.log(editUser)
                await userService.updateAccount(id, editUser)
                res.writeHead(301, {location: `/blogUser/${id}`})
                res.end();
            })
        }
    }

    addPost = async (req, res, id_user) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/addPost.html', 'utf-8', async (err, addHtml) => {
                let topics = await topicService.findAllTopic()
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