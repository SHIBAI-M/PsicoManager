// Arquivo: src/pages/NovoPaciente.jsx
import { useState } from 'react';
import estilos from '../css/Cadastro.module.css';

function NovoPaciente() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [mensagem, setMensagem] = useState(null);
    const [erro, setErro] = useState(null);

    
    const lidarComCpf = (evento) => {
        let valor = evento.target.value.replace(/\D/g, ""); 
        
       
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        
        setCpf(valor.substring(0, 14));
    };

    const lidarComTelefone = (evento) => {
        let valor = evento.target.value.replace(/\D/g, "");
        
       
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        
        setTelefone(valor.substring(0, 15)); 
    };

    
    const cadastrar = async (evento) => {
        evento.preventDefault();
        setMensagem(null);
        setErro(null);

       
        const cpfLimpo = cpf.replace(/\D/g, "");
        const telefoneLimpo = telefone.replace(/\D/g, "");

       
        const dados = { 
            nome, 
            email, 
            cpf: cpfLimpo, 
            dataNascimento, 
            telefone: telefoneLimpo 
        };

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/pacientes`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) {
                const erroDoServidor = await resposta.json();
                throw new Error(erroDoServidor.mensagem);
            }

            setMensagem("Paciente cadastrado com sucesso! A senha padrão é: paciente123");
            
            
            setNome(''); setEmail(''); setCpf(''); setDataNascimento(''); setTelefone('');
            
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <div className={estilos.pagina}>
            <div className={estilos.cartao}>
                <h2>Cadastrar Novo Paciente</h2>

                {mensagem && <p style={{ color: 'green', textAlign: 'center' }}>{mensagem}</p>}
                {erro && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{erro}</p>}

                <form onSubmit={cadastrar}>
                    <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    
                    <input type="text" placeholder="CPF" value={cpf} onChange={lidarComCpf} required />
                    
                    <label style={{ color: '#64748b', fontSize: '14px', marginBottom: '-15px' }}>Data de Nascimento:</label>
                    <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                    
                    <input type="tel" placeholder="Telefone" value={telefone} onChange={lidarComTelefone} required />

                    <button type="submit">Salvar Paciente</button>
                </form>
            </div>
        </div>
    );
}

export default NovoPaciente;