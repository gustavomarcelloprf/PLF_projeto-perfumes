import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PerfumeForm from '../components/PerfumeForm';

function EditPerfume() {
  const { perfumeId } = useParams();
  const [perfumeData, setPerfumeData] = useState(null); 

  useEffect(() => {
  fetch(`http://127.0.0.1:5000/api/perfumes/${perfumeId}`)
    .then(res => res.json())
    .then(data => {
      console.log("PASSO 1: EditPerfume RECEBEU da API:", data); 
      setPerfumeData(data);
    })
    .catch(error => console.error("Erro ao buscar dados do perfume:", error));
}, [perfumeId])
  if (!perfumeData) {
    return <div className="admin-container"><h1>Carregando perfume para edição...</h1></div>;
  }

  return (
    <div className="admin-container">
      <PerfumeForm initialData={perfumeData} />
    </div>
  );
}

export default EditPerfume;