import os
import json
from sqlalchemy import create_engine, text

# Pega a URL de conexão do banco de dados (que vamos configurar no Render)
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

# Cria a tabela de perfumes (se não existir)
with engine.connect() as conn:
    conn.execute(text('''
    CREATE TABLE IF NOT EXISTS perfumes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        marca VARCHAR(255),
        uso JSON,
        genero VARCHAR(50),
        acordes JSON,
        precos JSON,
        imagem_url TEXT
    );
    '''))
    conn.execute(text('DELETE FROM perfumes;'))
    conn.commit()

# Carrega os dados do perfumes.json
with open('perfumes.json', 'r', encoding='utf-8') as f:
    lista_perfumes = json.load(f)

# Insere cada perfume no novo banco de dados
with engine.connect() as conn:
    for perfume in lista_perfumes:
        conn.execute(text('''
        INSERT INTO perfumes (nome, marca, uso, genero, acordes, precos, imagem_url)
        VALUES (:nome, :marca, :uso, :genero, :acordes, :precos, :imagem_url)
        '''), {
            "nome": perfume['nome'],
            "marca": perfume['marca'],
            "uso": json.dumps(perfume['uso']),
            "genero": perfume.get('genero', 'N/A'),
            "acordes": json.dumps(perfume['acordes']),
            "precos": json.dumps(perfume['precos']),
            "imagem_url": perfume['imagem_url']
        })
    conn.commit()

print(f"{len(lista_perfumes)} perfumes foram preparados para o novo banco de dados.")