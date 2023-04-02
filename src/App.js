import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />
        {user === null && <Route path="/login" element={<Login />} />}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}

export default App;
