import { useState } from "react";
import estilos from '../css/Cadastro.module.css';
import logo from '../assets/psico.png';
function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  const realizarCadastro = (evento) => {
    evento.preventDefault(); 
    console.log("Dados capturados: ", { nome, email, senha });
    alert("Cadastro feito com sucesso!");
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
            placeholder="Digite seu telefone" 
            value={telefone} 
            onChange={(evento) => setTelefone(evento.target.value)}
            required 
          />

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

// Não esqueça de exportar!
export default Cadastro;