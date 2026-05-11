import { useState } from "react";
import estilos from '../css/Cadastro.module.css';
import logo from '../assets/psico.png';
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const navegar = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
 
  const [tipoUsuario, setTipoUsuario] = useState('paciente');

  const aplicarMascaraTelefone = (valor) => {
    if (!valor) return "";
    
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    
    return valor.substring(0, 15);
  };

  const lidarComTelefone = (evento) => {
    const valorDigitado = evento.target.value;
    const valorComMascara = aplicarMascaraTelefone(valorDigitado);
    setTelefone(valorComMascara);
  };

  const realizarCadastro = async (evento) => {
    evento.preventDefault(); 
    
    console.log("Dados capturados: ", { nome, email, telefone, senha, tipoUsuario });

    const telefoneLimpo = telefone.replace(/\D/g, "");

    const dados = {
      nome,
      email,
      telefone: telefoneLimpo,
      senha,
      tipoUsuario
    };

    try {
       const resposta = await fetch('http://localhost:5632/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
      });

       if (!resposta.ok) {
        const erroDoServidor = await resposta.json();
        throw new Error(erroDoServidor.mensagem || 'Erro ao realizar cadastro.');
      }

      alert("Cadastro feito com sucesso!");

       setNome(''); setEmail(''); setSenha(''); setTelefone('');

       navegar('/login');
       
    } catch (error) {
      console.log("Erro ao enviar pro banco", error);
      setErro(error.message);
    }

    
  };

  return (
    <div className={estilos.pagina}>
      <div className={estilos.cartao}>
        <img src={logo} alt="Logo" />
        <h2>Crie sua conta</h2>
        
        <form onSubmit={realizarCadastro}>
          <input 
            type="text" 
            placeholder="Digite seu nome" 
            value={nome} 
            onChange={(evento) => setNome(evento.target.value)}
            required 
          />
          
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email} 
            onChange={(evento) => setEmail(evento.target.value)}
            required 
          />
          
          <input 
            type="tel" 
            placeholder="(00) 00000-0000" 
            value={telefone} 
            onChange={lidarComTelefone} 
            required 
          />

         
          <select 
            value={tipoUsuario} 
            onChange={(evento) => setTipoUsuario(evento.target.value)}
            required
          >
            <option value="paciente">Paciente</option>
            <option value="psicologo">Psicólogo</option>
            <option value="adminClinica">Administrador da Clínica</option>
          </select>

          <input 
            type="password" 
            placeholder="Crie uma senha" 
            value={senha} 
            onChange={(evento) => setSenha(evento.target.value)}
            required 
          />
          
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;