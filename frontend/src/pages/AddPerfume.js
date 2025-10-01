import React from 'react';
import PerfumeForm from '../components/PerfumeForm'; // Importa o formulário

function AddPerfume() {
  return (
    <div className="admin-container">
      <h1>Adicionar Novo Perfume</h1>
      <PerfumeForm />
    </div>
  );
}

export default AddPerfume;