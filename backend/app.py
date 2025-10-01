import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO HÍBRIDA E SEGURA DO BANCO DE DADOS ---
DATABASE_URL = os.getenv('DATABASE_URL')
engine = None

if DATABASE_URL:
    # Se estiver no Render, usa a URL do PostgreSQL
    engine = create_engine(DATABASE_URL)
else:
    # Se estiver rodando localmente, usa o arquivo SQLite
    # Garante que o arquivo de banco de dados seja encontrado no mesmo diretório do script
    db_path = os.path.join(os.path.dirname(__file__), 'perfumes.db')
    engine = create_engine(f"sqlite:///{db_path}")


# --- ROTAS DA API ---

@app.route('/api/perfumes', methods=['GET'])
def get_perfumes():
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM perfumes ORDER BY id')).fetchall()
        perfumes = [dict(row._mapping) for row in result]
        # Converte os dados JSON de volta para listas/objetos, pois o SQLite os armazena como texto
        for p in perfumes:
            if isinstance(p.get('uso'), str): p['uso'] = json.loads(p['uso'])
            if isinstance(p.get('acordes'), str): p['acordes'] = json.loads(p['acordes'])
            if isinstance(p.get('precos'), str): p['precos'] = json.loads(p['precos'])
        return jsonify(perfumes)

@app.route('/api/perfumes/<int:id>', methods=['GET'])
def get_single_perfume(id):
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM perfumes WHERE id = :id'), {'id': id}).fetchone()
        if result is None:
            return jsonify({'erro': 'Perfume não encontrado'}), 404
        
        perfume = dict(result._mapping)
        if isinstance(perfume.get('uso'), str): perfume['uso'] = json.loads(perfume['uso'])
        if isinstance(perfume.get('acordes'), str): perfume['acordes'] = json.loads(perfume['acordes'])
        if isinstance(perfume.get('precos'), str): perfume['precos'] = json.loads(perfume['precos'])
            
        return jsonify(perfume)

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
    SENHA_SECRETA = os.getenv('ADMIN_PASSWORD', 'PLF&*@(&#788908e320)')
    dados = request.get_json()
    senha_tentativa = dados.get('senha')
    if senha_tentativa == SENHA_SECRETA:
        return jsonify({'acesso': 'permitido'})
    else:
        return jsonify({'acesso': 'negado'}), 401

if __name__ == '__main__':
    app.run(debug=True)