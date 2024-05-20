const express = require("express");

const route = express.Router();

const ds = require("../data/database");

route.get("/", function (req, res) {
  res.redirect("posts");
});

route.get("/posts", async function (req, res) {
  const [post_data] = await ds.query(
    "SELECT blog.post.*, blog.authors.name AS author_name FROM blog.post INNER JOIN blog.authors ON blog.post.author_id = blog.authors.id"
  );
  res.render("posts-list", { post: post_data });
});

route.get("/new-post", async function (req, res) {
  const [authors] = await ds.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors });
});

route.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await ds.query("INSERT INTO post(title,summary,body,author_id) VALUES(?)", [
    data,
  ]);
  res.redirect("posts");
});

route.get("/posts/:id", async function (req, res) {
  const query = `SELECT blog.post.*, blog.authors.name AS author_name ,blog.authors.email AS author_email 
                 FROM blog.post INNER JOIN blog.authors ON blog.post.author_id = blog.authors.id
                 WHERE blog.post.id=?`;
  const [post_detail]= await ds.query(query,[req.params.id])    
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  
  const post_detail1={
    ...post_detail,
    date1:post_detail[0].date.toISOString(),
    humanreadable:post_detail[0].date.toLocaleDateString("en-US", options)
  }
  console.log(post_detail1)
  res.render("post-detail",{post_detail:post_detail1});
});

route.get('/update/:id/edit',async function(req,res){
  const query=`SELECT * FROM blog.post WHERE id=?`
  console.log(req.params.id)
  const data=await ds.query(query,req.params.id)
  res.render('update-post',{update_data:data[0][0]})
})

route.post('/update/:id/edit',async function(req,res){
  const query=`UPDATE blog.post SET title =? ,summary=? ,body=? WHERE id=?`
  await ds.query(query,[ req.body.title,req.body.summary,req.body.content, req.params.id])
  res.redirect('/posts')
})

route.get('/post/:id/delete',async function(req,res){
  const query=`delete from post Where id=?`
  await ds.query(query,req.params.id)
  res.redirect('/posts')
})
module.exports = route;
