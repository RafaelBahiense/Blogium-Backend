import express from 'express';
import cors from 'cors';

import { fileLoader, fileWrite, Data, Post, Comment, PostComments } from "./FileHandler";

const app = express();
app.use(cors());
app.use(express.json());

let data: Data = fileLoader()

app.get("/posts", (req, res) => {
  res.send(data.posts);
});

app.get("/posts/:id", (req, res) => {
  const id: number = Number(req.params.id);
  res.send(data.posts.find( (post) => post.id === id ));
});

app.post("/posts", (req, res) => {
  const post: Post =  req.body;
  post.id = ++data.counter;
  post.commentCount = 0;
  if (post.content.length > 53) {
    post.contentPreview = post.content.substring(0, 50) +  "...";
  } else {
    post.contentPreview = post.content;
  }
  data.comments.push({"postId": data.counter, "comments": [] })
  data.posts.push(post);
  fileWrite(data);
  res.send({id: data.counter});
});

app.get("/posts/:id/comments", (req, res) => {
  const id: number = Number(req.params.id);
  const postComments = data.comments.find( (postComments) => postComments.postId === id )
  res.send(postComments ? postComments.comments : []);
});

app.post("/posts/:id/comments", (req, res) => {
  const id: number = Number(req.params.id);
  const comment: Comment = req.body;
  const postIndex: number= data.posts.findIndex( (post) => post.id === id );
  const postCommentsIndex: number = data.comments.findIndex( (postComments) => postComments.postId === id );
  postCommentsIndex >= 0 
    ? data.comments[postCommentsIndex].comments.push(comment)
    : data.comments.push({ postId: id, comments: [comment] })
  data.posts[postIndex].commentCount += 1; 
  fileWrite(data);
  res.send("ok");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});