import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Layout from './components/Layout.jsx';
import NovoPaciente from './pages/NovoPaciente.jsx';
import PainelAdmin from './pages/PainelAdmin.jsx';
import AreaPsicologo from './pages/AreaPsicologo.jsx'
import AreaPaciente from './pages/AreaPaciente.jsx'
import Agenda from './pages/Agenda.jsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
    
          <Route element={<Layout />}>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
             <Route path="/painel-admin" element={<PainelAdmin />} />
             <Route path="/novo-paciente" element={<NovoPaciente />} />
             <Route path="/agendamento" element={<Agenda />} />
            <Route path="/area-paciente" element={<AreaPaciente />} />
            <Route path="/painel-psicologo" element={<AreaPsicologo />} />
             
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;