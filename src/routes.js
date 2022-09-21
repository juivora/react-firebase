import React from 'react';
import { Route, Routes } from "react-router-dom";
const Login = React.lazy(() => import('./Auth/Login/Login'));
const Register = React.lazy(() => import("./Auth/Register/Register"));
const Reset = React.lazy(() => import("./Auth/ResetPassword/ResetPassword"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));
const AddBlog = React.lazy(() => import("./Blog/AddBlog"));
const Blogs = React.lazy(() => import("./Blog/Blogs"));
const MyBlogs = React.lazy(() => import("./Blog/MyBlogs"));
const Editblog = React.lazy(() => import("./Blog/EditBlog"));

function NewRoutes() {
    return (
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/blog" element={<Blogs />} />
            <Route exact path="/blog/add" element={<AddBlog />} />
            <Route exact path="/blog/edit/:id" element={<Editblog />} />
            <Route exact path="/myblog" element={<MyBlogs />} />
        </Routes>
    )
}

export default NewRoutes;
