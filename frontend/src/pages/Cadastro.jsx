import { useState } from "react";
import estilos from '../css/Cadastro.module.css';
import logo from '../assets/psico.png';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  // --- A FUNÇÃO QUE FALTAVA ESTÁ AQUI EMBAIXO ---
  const aplicarMascaraTelefone = (valor) => {
    if (!valor) return "";
    
    // 1. Remove tudo o que não for número
    valor = valor.replace(/\D/g, "");
    
    // 2. Aplica a máscara (XX) XXXXX-XXXX
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    
    // 3. Limita o tamanho máximo
    return valor.substring(0, 15);
  };

  const lidarComTelefone = (evento) => {
    const valorDigitado = evento.target.value;
    // Agora a função existe e vai retornar o valor formatado!
    const valorComMascara = aplicarMascaraTelefone(valorDigitado);
    setTelefone(valorComMascara);
  };

  const realizarCadastro = (evento) => {
    evento.preventDefault(); 
    console.log("Dados capturados: ", { nome, email, telefone, senha });
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
            placeholder="(00) 00000-0000" 
            value={telefone} 
            onChange={lidarComTelefone} 
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

export default Cadastro;