import React, { useState, useEffect } from 'react'; // 1. useEffect foi importado
import { useNavigate } from 'react-router-dom';

// O formulário agora aceita uma propriedade chamada "initialData"
function PerfumeForm({ initialData }) {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [uso, setUso] = useState('');
  const [acordes, setAcordes] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [precos, setPrecos] = useState([{ tamanho: '', valor: '' }]);
  
  //código preenche o formulário se estivermos no modo de edição
  useEffect(() => {
    if (isEditing && initialData) {
      setNome(initialData.nome || '');
      setMarca(initialData.marca || '');
      setGenero(initialData.genero || 'Masculino');
      setUso(initialData.uso ? initialData.uso.join(', ') : '');
      setAcordes(initialData.acordes ? initialData.acordes.join(', ') : '');
      setImagemUrl(initialData.imagem_url || '');
      setPrecos(initialData.precos && initialData.precos.length > 0 ? initialData.precos : [{ tamanho: '', valor: '' }]);
    }
  }, [initialData, isEditing]);


  //funções de preço continuam aqui, sem alteração
  const handlePrecoChange = (index, event) => {
    const novosPrecos = [...precos];
    novosPrecos[index][event.target.name] = event.target.value;
    setPrecos(novosPrecos);
  };
  const handleAddPreco = () => setPrecos([...precos, { tamanho: '', valor: '' }]);
  const handleRemovePreco = (index) => {
    const novosPrecos = [...precos];
    novosPrecos.splice(index, 1);
    setPrecos(novosPrecos);
  };

  // função de salvar inteligente
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const perfumeData = {
      nome, marca, genero,
      uso: uso.split(',').map(item => item.trim()),
      acordes: acordes.split(',').map(item => item.trim()),
      precos: precos,
      imagem_url: imagemUrl,
    };

    // Define a URL e o método corretos (PUT para editar, POST para adicionar)
    const url = isEditing
      ? `http://127.0.0.1:5000/api/perfumes/${initialData.id}`
      : 'http://127.0.0.1:5000/api/perfumes';
    
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfumeData),
    })
    .then(response => response.json())
    .then(data => {
      // Mensagem de alerta
      alert(`Perfume ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
      navigate('/admin');
    })
    .catch(error => {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} perfume:`, error);
      alert(`Falha ao ${isEditing ? 'atualizar' : 'adicionar'} perfume.`);
    });
  };

  return (
    <form className="perfume-form" onSubmit={handleSubmit}>
      <div className="form-group"><label>Nome do Perfume</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} required /></div>
      <div className="form-group"><label>Marca</label><input type="text" value={marca} onChange={e => setMarca(e.target.value)} required /></div>
      <div className="form-group"><label>Gênero</label><select value={genero} onChange={e => setGenero(e.target.value)}><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Compartilhável">Compartilhável</option></select></div>
      <div className="form-group"><label>Uso (separado por vírgula)</label><input type="text" value={uso} onChange={e => setUso(e.target.value)} placeholder="Ex: Diurno, Versátil" /></div>
      <div className="form-group"><label>Principais Acordes (separados por vírgula)</label><textarea value={acordes} onChange={e => setAcordes(e.target.value)} required /></div>
      <div className="form-group"><label>Preços</label> {precos.map((item, index) => (<div className="preco-input-group" key={index}><input type="text" name="tamanho" placeholder="Ex: 100ml" value={item.tamanho} onChange={event => handlePrecoChange(index, event)} required /><input type="text" name="valor" placeholder="Ex: R$500" value={item.valor} onChange={event => handlePrecoChange(index, event)} required />{precos.length > 1 && (<button type="button" className="btn-remover-preco" onClick={() => handleRemovePreco(index)}>Remover</button>)}</div>))} <button type="button" className="btn-adicionar-preco" onClick={handleAddPreco}>Adicionar Outro Preço</button></div>
      <div className="form-group"><label>URL da Imagem (opcional)</label><input type="text" value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} /></div>
      <button type="submit" className="btn-salvar">
        {isEditing ? 'Salvar Alterações' : 'Adicionar Perfume'}
      </button>
    </form>
  );
}

export default PerfumeForm;