let postHtml = ''
postHtml += `
             <div class="card bg-transparent border-0">
            <div class="row g-3">
              <div class="col-4">
                <!-- Blog image -->
                <img class="rounded" src="!{item.img}" alt="">
              </div>
              <div class="col-8">
                <!-- Blog caption -->
                <a href="#" class="badge bg-danger bg-opacity-10 text-danger mb-2 fw-bold">!{item.topic_name}</a>
                <h5><a href="/post/!{item.id_post}" class="btn-link stretched-link text-reset fw-bold">!{item.title}</a></h5>
                <div class="d-none d-sm-inline-block">
                  <p class="mb-2">!{words[0]}</p>
                  <!-- BLog date -->
                  <a class="small text-secondary" href="#!"> <i class="bi bi-calendar-date pe-1"></i>!{item.time}</a>
                </div>
                <form method="POST" onsubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                <input name="idDelete" type="hidden" value='!{item.id_post}'>
                <button type="submit" id="delete" class="btn btn-outline-warning">Delete</button>
                </form>
              </div>
          <!-- Blog item END -->
          <hr class="my-4">
            `
if (true) {
    let k = postHtml.indexOf(`id="delete"`);
    let postHtml_01 = postHtml.slice(0,k) + ` hidden='' `;
    let postHtml_02 = postHtml.slice(k);
    postHtml = postHtml_01 + postHtml_02;
}

console.log(postHtml);