import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Admin() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true); // Precisamos dos dois
  const [autenticado, setAutenticado] = useState(false);
  const authEffectRan = useRef(false);

  // Efeito da senha (sem alterações)
  useEffect(() => {
    if (authEffectRan.current === false) {
      authEffectRan.current = true;
      if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
        setAutenticado(true);
        return;
      }
      const senha = prompt("Por favor, digite a senha de administrador:");
      if (senha) {
        fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senha: senha }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.acesso === 'permitido') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setAutenticado(true);
          } else {
            alert("Senha incorreta!");
          }
        })
        .catch(error => console.error("Erro ao autenticar:", error));
      }
    }
  }, []);

  // Efeito para buscar os perfumes
  useEffect(() => {
    if (autenticado) {
      setLoading(true); // Avisa que vai começar a carregar
      fetch(`${process.env.REACT_APP_API_URL}/api/perfumes`)
        .then(response => response.json())
        .then(data => {
          setPerfumes(data);
          setLoading(false); // Avisa que terminou de carregar
        })
        .catch(error => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false); // Avisa que terminou, mesmo com erro
        });
    } else {
      setLoading(false); // Se não está autenticado, não fica carregando para sempre
    }
  }, [autenticado]);

  // Função de apagar (sem alterações)
  const handleDelete = (perfumeId) => {
    if (window.confirm('Tem certeza que deseja apagar este perfume?')) {
      fetch(`${process.env.REACT_APP_API_URL}/api/perfumes/${perfumeId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          alert('Perfume apagado com sucesso!');
          setPerfumes(perfumesAtuais =>
            perfumesAtuais.filter(perfume => perfume.id !== perfumeId)
          );
        } else {
          alert('Ocorreu um erro ao apagar o perfume.');
        }
      })
      .catch(error => console.error("Erro ao apagar:", error));
    }
  };

  if (!autenticado) {
    return <div className="admin-container"><h1>Acesso Negado</h1><p>Atualize a página para tentar novamente.</p></div>;
  }

  // A verificação 'loading' é importante aqui
  if (loading) {
    return <div className="admin-container"><h1>Carregando dados...</h1></div>;
  }

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      <div className="admin-actions">
        <Link to="/admin/add" className="btn-adicionar">
          Adicionar Novo Perfume
        </Link>
      </div>
      <table className="admin-table">
        {/* ... O resto da tabela continua igual ... */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Marca</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {perfumes.map(perfume => (
            <tr key={perfume.id}>
              <td>{perfume.id}</td>
              <td>{perfume.nome}</td>
              <td>{perfume.marca}</td>
              <td>
                <Link to={`/admin/edit/${perfume.id}`} className="btn-editar">Editar</Link>
                <button onClick={() => handleDelete(perfume.id)} className="btn-apagar">
                  Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;