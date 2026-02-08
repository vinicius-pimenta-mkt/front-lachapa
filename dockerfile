FROM python:3.11-slim

# Instala dependências do sistema necessárias para o MySQL
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia os arquivos de requisitos e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta do Flask
EXPOSE 5000

# Comando para iniciar com Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.main:app"]
