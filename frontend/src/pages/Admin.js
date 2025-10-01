// Este é o código correto para /src/pages/Admin.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Admin() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const promptJaMostrado = useRef(false);

  useEffect(() => {
    if (!autenticado && !promptJaMostrado.current) {
      promptJaMostrado.current = true;
      const senha = prompt("Por favor, digite a senha de administrador:");
      if (senha) {
        fetch('http://127.0.0.1:5000/api/login', {
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
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      setLoading(true);
      fetch('http://127.0.0.1:5000/api/perfumes')
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

  const handleDelete = (perfumeId) => {
    if (window.confirm('Tem certeza que deseja apagar este perfume?')) {
      fetch(`http://127.0.0.1:5000/api/perfumes/${perfumeId}`, {
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