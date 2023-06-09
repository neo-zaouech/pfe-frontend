import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import About from './Pages/About'
import DashboardAdmin from './Pages/Admin'
import Bureaux from './Pages/Admin/Bureaux'
import Login from './Pages/Login'
import FormBureau from './Pages/Admin/FormBureau'
import Services from './Pages/Admin/Services'
import LocalServices from './Pages/chef_service/Services'
import Users from './Pages/Admin/Users'
import Chef_service from './Pages/chef_service'
import LocalUsers from './Pages/chef_service/Users'
import Anonyme from './Pages/Anonyme'
import Guichier from './Pages/Guichier'
import Reclamation from './Pages/Anonyme/Reclamation'
import Reclamations from './Pages/Admin/Reclamations'
import ShowReclamation from './Pages/Admin/ShowReclamation'
import Discussions from './Pages/Message'

function App() {
  const user = useSelector((state) => state.user)

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {user === null ? (
          <>
            <Route path="/" element={<Anonyme />} />
            <Route path="/reclamation" element={<Reclamation />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="message" element={<Discussions />} />
            {user.role === 'admin' ? (
              <>
                <Route path="/" element={<DashboardAdmin />} />
                <Route path="/bureaux" element={<Bureaux />} />
                <Route path="/edit_bureau" element={<FormBureau />} />
                <Route
                  path="/add_bureau"
                  element={<FormBureau type={'add'} />}
                />
                <Route path="/services" element={<Services />} />
                <Route path="/users" element={<Users />} />
                <Route path="/reclamations" element={<Reclamations />} />
                <Route path="/reclamation" element={<ShowReclamation />} />
              </>
            ) : user.role === 'chef_service' ? (
              <>
                <Route path="/" element={<Chef_service />} />
                <Route path="/services" element={<LocalServices />} />
                <Route path="/users" element={<LocalUsers />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Guichier />} />
                <Route path="/add_actualite" element={<Guichier />} />
              </>
            )}
          </>
        )}
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  )
}

export default App
