import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import FileUpload from "./pages/FileUpload";
import FileDetails from "./pages/FileDetails";
import BlockDetailsPage from "./pages/BlockDetails";

function App() {
  return (
    <div className="container">
    <Router>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/" element={<Navigate to="/upload" />} /> */}
         <Route path="/upload" element={<FileUpload />} />
         {/* <Route path="/blocks" element={<BlockListPage />} /> */}
        <Route path="/block/:id" element={<BlockDetailsPage />} /> 
         <Route path="/file/:id" element={<FileDetails />} />
        FileDetails
      </Routes>
    </Router>
    </div>
  );
}

export default App;