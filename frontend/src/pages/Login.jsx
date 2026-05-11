import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import estilos from '../css/Cadastro.module.css';
import logo from '../assets/psico.png'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {

    const navegar = useNavigate();
    
    const [error, setError] = useState(null);

    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');

    const { loginContext } = useContext(AuthContext);

    const fazerLogin = async (evento) => {
    evento.preventDefault(); 
    setError(null); 

    const dados = { email, senha };

    try {
      const resposta = await fetch('http://localhost:5632/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) {
        const erroDoServidor = await resposta.json();
        throw new Error(erroDoServidor.mensagem || 'Erro ao realizar login.');
      }

      
      const dadosDoUsuario = await resposta.json();

      loginContext(dadosDoUsuario);

      alert("Login feito com sucesso!");

      
      if (dadosDoUsuario.tipoUsuario === "adminClinica") {
        navegar('/painel-admin'); 
        
      } else if (dadosDoUsuario.tipoUsuario === "psicologo") {
        navegar('/painel-psicologo');
        
      } else if (dadosDoUsuario.tipoUsuario === "paciente") {
        navegar('/area-paciente');
      }

    } catch (erro) {
      console.log("Erro ao enviar pro backend", erro);
      setError(erro.message);
    }
  }
    return (
        <div className={estilos.pagina}>
            <div className={estilos.cartao}>
                <img src={logo} alt="Logo" />
                <h2>Entre na sua conta</h2>

                <form onSubmit={fazerLogin}>

                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(evento) => setSenha(evento.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login