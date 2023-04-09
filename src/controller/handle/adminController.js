
const fs = require('fs');
const qs = require('qs');
const adminService = require("../../service/adminService");
const userService = require("../../service/userService");

class AdminController {
    getBlogAdminHtml = (posts, adminHtml) => {
        let postHtml = '';
        let words = '';
        posts.map((item) => {
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
            </div>
            <form method="POST">
            <input name="idDelete" type="hidden" value='${item.id_post}'>
            <button type="submit" class="btn btn-outline-warning">Delete</button>
            </form>
            </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
        })
        adminHtml = adminHtml.replace('{posts}', postHtml)
        return adminHtml
    }



    getAccountHtml = (accounts, adminHtml) => {
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
                   <input name="idAddFriend" type="hidden" value='${item.id_user}'>
                   <button type="submit" class="btn btn-primary-soft rounded-circle icon-md ms-auto" href="#"><i class="fa-solid fa-plus"> </i></button>
                   </form>
                   </a>
                   
              </div>         
            `
        })
        adminHtml = adminHtml.replace('{Account}', accountHtml)
        return adminHtml
    }




    blogAdmin = async (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./src/views/blog_admin.html', 'utf-8', async (err, adminHtml) => {
                let posts = await adminService.getAllPost()
                adminHtml = this.getBlogAdminHtml(posts, adminHtml)
                let accounts = await adminService.getAllAccount()
                adminHtml = this.getAccountHtml(accounts, adminHtml)
                console.log()
                res.write(adminHtml);
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
                    let post_id = receiveData.idDelete
                    console.log(post_id, 1111111)
                    await  adminService.deleteAPost(post_id);
                    res.writeHead(301, {location: '/blogAdmin'})
                    res.write('Success')
                    res.end();
                }else if(receiveData.search) {
                    let keyword = receiveData.search;
                    let publicPostSearchByKeyword = await adminService.findPostByKeyword(keyword)
                    console.log(publicPostSearchByKeyword)
                    fs.readFile('./src/views/blog_admin.html', 'utf-8', async (err, adminHtml) => {
                        adminHtml = this.getBlogAdminHtml(publicPostSearchByKeyword, adminHtml);
                        let accounts = await adminService.getAllAccount()
                        adminHtml = this.getAccountHtml(accounts, adminHtml)
                        res.write(adminHtml);
                        res.end();
                    })
                }
            })
            // const buffers = [];
            // for await (const chunk of req){
            //     buffers.push(chunk)
            // }
            // const data = Buffer.concat(buffers).toString();
            // const product = qs.parse(data);
            // if(product.idDelete){
            //     let id = product.idDelete
            //     await adminService.deleteAPost(id)
            //     res.writeHead(301, {location: '/home'})
            //     res.end();
            // }
        }
    }
}
module.exports = new AdminController()
