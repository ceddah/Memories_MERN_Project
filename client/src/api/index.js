import axios from "axios";

const API = axios.create({ baseURL: "/api" });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
  }
  return req;
});

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const comment = (comment, postId) => API.post(`/posts/${postId}/commentPost`, { comment });

export const fetchPostsBySearch = (searchQuery) =>
  API.get(`/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${searchQuery.tags}`);

export const fetchPost = (id) => API.get("/posts/" + id);

export const createPost = (newPost) => API.post("/posts", newPost);

export const updatePost = (id, data) => API.patch("/posts" + `/${id}`, data);

export const deletePost = (id) => API.delete("/posts" + `/${id}`);

export const likePost = (id) => API.patch("/posts" + `/${id}/likePost`);

export const signin = (formData) => API.post("/user/signin", formData);

export const signup = (formData) => API.post("/user/signup", formData);
