import {  Routes, Route } from 'react-router-dom';
import Landing from "../Pages/Landing";
import ChatPage from "../Pages/ChatPage";
import VCPage from "../Pages/VCPage";




const AppRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/chatpage" element={<ChatPage/>}/>
            <Route path="/vcpage" element={<VCPage/>}/>
        </Routes>
    )
}

export default AppRoutes