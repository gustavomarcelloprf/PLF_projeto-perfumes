import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Admin() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const authEffectRan = useRef(false); // Usamos o useRef para controlar a execução

  // Efeito para a senha, corrigido para não dar aviso
  useEffect(() => {
    // Só roda se o efeito ainda não rodou nesta montagem
    if (authEffectRan.current === false) {
      const senha = prompt("Por favor, digite a senha de administrador:");
      if (senha) {
        // Usamos a variável de ambiente para a URL da API
        fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senha: senha }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.acesso === 'permitido') {
            setAutenticado(true);
          } else {
            alert("Senha incorreta!");
          }
        })
        .catch(error => console.error("Erro ao autenticar:", error));
      }
      // Marca que o efeito já rodou
      return () => {
        authEffectRan.current = true;
      }
    }
  }, []); // O array vazio está correto, pois só queremos rodar na montagem

  // Efeito para buscar os perfumes, só roda depois de autenticado
  useEffect(() => {
    if (autenticado) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/perfumes`)
        .then(response => response.json())
        .then(data => {
          setPerfumes(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar dados:", error);
          setLoading(false);
        });
    }
  }, [autenticado]);

  // Função para apagar um perfume
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

  if (loading) {
    return <div className="admin-container"><h1>Carregando dados...</h1></div>;
  }

  return (
    // O JSX da tabela continua o mesmo
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      <div className="admin-actions">
        <Link to="/admin/add" className="btn-adicionar">
          Adicionar Novo Perfume
        </Link>
      </div>
      <table className="admin-table">
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