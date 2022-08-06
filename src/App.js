// import './App.css';
// import { Switch } from "react-router";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Auth/Login/Login'
import Register from "./Auth/Register/Register";
import Reset from "./Auth/ResetPassword/ResetPassword";
import Dashboard from "./Dashboard/Dashboard";
import Header from "./UI/Header";
import AddBlog from "./Blog/AddBlog";
import Blogs from "./Blog/Blogs";
import MyBlogs from "./Blog/MyBlogs";
import Editblog from "./Blog/EditBlog";

function App() {

  return (


    <Router>
      <Header />
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
    </Router>

  );
}

export default App;
