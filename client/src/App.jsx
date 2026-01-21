import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/dashboards/UserDashboard";
import useUiStore from "./stores/useUiStore";

  

const App = () => { 
  const {setShowHeader} = useUiStore();
  return (
    <div onClick={()=>setShowHeader(false)}>
      <BrowserRouter>
      <Toaster/>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashboard" element={<UserDashboard/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
