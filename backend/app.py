import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO HÍBRIDA DO BANCO DE DADOS ---
# Procura a URL do banco de dados do Render
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Se estiver no Render, usa a URL do PostgreSQL
    engine = create_engine(DATABASE_URL)
else:
    # Se estiver rodando localmente, usa o arquivo SQLite
    # O caminho para o SQLite precisa do prefixo 'sqlite:///'
    engine = create_engine("sqlite:///perfumes.db")


# --- Nossas rotas da API continuam iguais, pois o 'engine' cuida da conexão ---

@app.route('/api/perfumes', methods=['GET'])
def get_perfumes():
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM perfumes ORDER BY id')).fetchall()
        perfumes = [dict(row._mapping) for row in result]
        # Para SQLite, os dados JSON são strings e precisam ser convertidos
        if not DATABASE_URL:
            for p in perfumes:
                p['uso'] = json.loads(p['uso'])
                p['acordes'] = json.loads(p['acordes'])
                p['precos'] = json.loads(p['precos'])
        return jsonify(perfumes)

@app.route('/api/perfumes/<int:id>', methods=['GET'])
def get_single_perfume(id):
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM perfumes WHERE id = :id'), {'id': id}).fetchone()
        if result is None:
            return jsonify({'erro': 'Perfume não encontrado'}), 404
        
        perfume = dict(result._mapping)
        if not DATABASE_URL:
            perfume['uso'] = json.loads(perfume['uso'])
            perfume['acordes'] = json.loads(perfume['acordes'])
            perfume['precos'] = json.loads(perfume['precos'])
            
        return jsonify(perfume)

# O resto do seu app.py (rotas POST, PUT, DELETE, login) está perfeito e não precisa de grandes mudanças,
# pois a lógica de escrita do SQLAlchemy é compatível com ambos. Vamos colar tudo aqui para garantir.

@app.route('/api/perfumes', methods=['POST'])
def add_perfume():
    novo_perfume = request.get_json()
    with engine.connect() as conn:
        conn.execute(text('''
            INSERT INTO perfumes (nome, marca, uso, genero, acordes, precos, imagem_url)
            VALUES (:nome, :marca, :uso, :genero, :acordes, :precos, :imagem_url)
        '''), {
            "nome": novo_perfume['nome'],
            "marca": novo_perfume['marca'],
            "uso": json.dumps(novo_perfume['uso']),
            "genero": novo_perfume.get('genero', 'N/A'),
            "acordes": json.dumps(novo_perfume['acordes']),
            "precos": json.dumps(novo_perfume['precos']),
            "imagem_url": novo_perfume.get('imagem_url', '')
        })
        conn.commit()
    return jsonify({'status': 'sucesso', 'mensagem': 'Perfume adicionado!'}), 201

@app.route('/api/perfumes/<int:id>', methods=['PUT'])
def update_perfume(id):
    dados_atualizados = request.get_json()
    with engine.connect() as conn:
        conn.execute(text('''
            UPDATE perfumes SET
                nome = :nome, marca = :marca, uso = :uso, genero = :genero, 
                acordes = :acordes, precos = :precos, imagem_url = :imagem_url
            WHERE id = :id
        '''), {
            "nome": dados_atualizados['nome'],
            "marca": dados_atualizados['marca'],
            "uso": json.dumps(dados_atualizados['uso']),
            "genero": dados_atualizados.get('genero', 'N/A'),
            "acordes": json.dumps(dados_atualizados['acordes']),
            "precos": json.dumps(dados_atualizados['precos']),
            "imagem_url": dados_atualizados.get('imagem_url', ''),
            "id": id
        })
        conn.commit()
    return jsonify({'status': 'sucesso', 'mensagem': 'Perfume atualizado!'})

@app.route('/api/perfumes/<int:id>', methods=['DELETE'])
def delete_perfume(id):
    with engine.connect() as conn:
        conn.execute(text('DELETE FROM perfumes WHERE id = :id'), {'id': id})
        conn.commit()
    return jsonify({'status': 'sucesso', 'mensagem': 'Perfume apagado!'})

@app.route('/api/login', methods=['POST'])
def login():
    SENHA_SECRETA = "PLF&*@(&#788908e320)" 
    dados = request.get_json()
    senha_tentativa = dados.get('senha')
    if senha_tentativa == SENHA_SECRETA:
        return jsonify({'acesso': 'permitido'})
    else:
        return jsonify({'acesso': 'negado'}), 401

if __name__ == '__main__':
    app.run(debug=True)