import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';

function Catalogo() { 
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acordesSelecionados, setAcordesSelecionados] = useState([]);
  const [usoSelecionado, setUsoSelecionado] = useState('');
  const [generoSelecionado, setGeneroSelecionado] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/perfumes')
      .then(response => response.json())
      .then(data => {
        setPerfumes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da API:", error);
        setLoading(false);
      });
  }, []);

  const todosAcordes = useMemo(() => {
    const setDeAcordes = new Set();
    perfumes.forEach(perfume => {
      perfume.acordes.forEach(acorde => setDeAcordes.add(acorde));
    });
    return Array.from(setDeAcordes).sort();
  }, [perfumes]);

  const todosUsos = useMemo(() => {
    const setDeUsos = new Set();
    perfumes.forEach(perfume => {
        perfume.uso.forEach(u => setDeUsos.add(u))
    });
    return Array.from(setDeUsos).sort();
  }, [perfumes]);

  const todosGeneros = useMemo(() => {
    const setDeGeneros = new Set();
    perfumes.forEach(perfume => setDeGeneros.add(perfume.genero));
    return Array.from(setDeGeneros).sort();
  }, [perfumes]);

  const handleAcordeClick = (acordeClicado) => {
    setAcordesSelecionados(acordesAtuais => 
      acordesAtuais.includes(acordeClicado)
        ? acordesAtuais.filter(acorde => acorde !== acordeClicado)
        : [...acordesAtuais, acordeClicado]
    );
  };

  const handleUsoClick = (usoClicado) => {
    setUsoSelecionado(usoAtual => (usoAtual === usoClicado ? '' : usoClicado));
  };

  const handleGeneroClick = (generoClicado) => {
    setGeneroSelecionado(generoAtual => (generoAtual === generoClicado ? '' : generoClicado));
  };

  const handleLimparFiltros = () => {
    setAcordesSelecionados([]);
    setUsoSelecionado('');
    setGeneroSelecionado('');
  };

  const perfumesFiltrados = perfumes
    .filter(perfume => 
      acordesSelecionados.length === 0 || acordesSelecionados.every(filtro => perfume.acordes.includes(filtro))
    )
    .filter(perfume => 
      usoSelecionado === '' || perfume.uso.includes(usoSelecionado)
    )
    .filter(perfume => {
      if (generoSelecionado === '') return true;
      return perfume.genero === generoSelecionado;
    });

  if (loading) {
    return <div className="App"><h1>Carregando perfumes...</h1></div>;
  }

  return (
    <div className="App">
      <h1>Catálogo de Perfumes</h1>

      <div className="filtros-container">
        <h3>Gênero:</h3>
        <div className="lista-de-filtros">
          {todosGeneros.map(genero => (
            <button
              key={genero}
              onClick={() => handleGeneroClick(genero)}
              className={generoSelecionado === genero ? 'filtro-btn ativo' : 'filtro-btn'}
            >
              {genero}
            </button>
          ))}
        </div>

        <h3>Ocasião de Uso:</h3>
        <div className="lista-de-filtros">
          {todosUsos.map(uso => (
            <button key={uso} onClick={() => handleUsoClick(uso)} className={usoSelecionado === uso ? 'filtro-btn ativo' : 'filtro-btn'}>
              {uso}
            </button>
          ))}
        </div>
        
        <h3>Principais Acordes:</h3>
        <div className="lista-de-filtros">
          {todosAcordes.map(acorde => (
            <button key={acorde} onClick={() => handleAcordeClick(acorde)} className={acordesSelecionados.includes(acorde) ? 'filtro-btn ativo' : 'filtro-btn'}>
              {acorde}
            </button>
          ))}
        </div>

        {(acordesSelecionados.length > 0 || usoSelecionado || generoSelecionado) && (
            <button onClick={handleLimparFiltros} className="limpar-btn">
                Limpar Filtros
            </button>
        )}
      </div>
      
      {perfumesFiltrados.length > 0 ? (
        <div className="perfume-list">
          {perfumesFiltrados.map(perfume => (
            <div key={perfume.nome + perfume.marca} className="perfume-card">
              <h2>{perfume.nome}</h2>
              <p>{perfume.marca}</p>
              {perfume.imagem_url ? (
                <img src={perfume.imagem_url} alt={perfume.nome} className="perfume-image" />
              ) : (
                <div className="perfume-image-placeholder"></div>
              )}
              <div className="perfume-precos">
                {perfume.precos.map(p => (
                    <span key={p.tamanho} className="preco-tag">{p.tamanho} - {p.valor}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sem-resultados">
          <h3>Nenhum perfume encontrado</h3>
          <p>Tente remover alguns filtros para ver mais resultados.</p>
        </div>
      )}
    </div>
  );
}

export default Catalogo;