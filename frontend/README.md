#  Recomendador de Perfumes 🌬️

Aplicação web para apresentar e recomendar perfumes, com um catálogo público com filtros dinâmicos e um painel de administrativo completo para gerenciamento de produtos.

## ✨ Funcionalidades

- **Catálogo Público:**
  - Visualização de todos os perfumes em um grid responsivo.
  - Filtros interativos por Gênero, Ocasião de Uso e Acordes.
  - Botão para limpar todos os filtros aplicados.
  - Links de contato para WhatsApp e Instagram no rodapé.

- **Painel Administrativo (`/admin`):**
  - Acesso protegido por senha (verificada no backend).
  - Listagem de todos os perfumes em uma tabela.
  - Funcionalidade completa de **CRUD** (Criar, Ler, Atualizar e Apagar):
    - **Criar:** Formulário para adicionar novos perfumes ao banco de dados.
    - **Atualizar:** Formulário pré-preenchido para editar informações de perfumes existentes.
    - **Apagar:** Botão para remover perfumes do catálogo, com caixa de confirmação.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React.js
  - React Router DOM para navegação
- **Backend:**
  - Python
  - Flask para a API RESTful
  - SQLite como banco de dados
- **Deploy:**
  - Backend implantado no Render.
  - Frontend implantado no Netlify.

## 🚀 Como Executar o Projeto Localmente

**Pré-requisitos:** Python 3, Node.js e npm.

**Backend:**
```bash
# 1. Navegue até a pasta raiz e ative o ambiente virtual
cd projeto-perfumes
source venv/bin/activate

# 2. Instale as dependências (se for a primeira vez)
pip install -r backend/requirements.txt

# 3. Entre na pasta do backend e inicie a API
cd backend
python3 app.py

Atualizando para deploy.