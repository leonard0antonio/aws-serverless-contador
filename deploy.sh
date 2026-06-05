#!/bin/bash

# Define as variáveis
NOME_DO_BUCKET="meu-contador-em-breve-2026"
PASTA_FRONTEND="./frontend"

echo "🚀 Iniciando o deploy do Front-End para o Amazon S3..."

# Sincroniza a pasta local com o bucket na AWS
# A opção --delete garante que arquivos removidos localmente também sejam removidos do bucket
aws s3 sync $PASTA_FRONTEND s3://$NOME_DO_BUCKET --delete

# Verifica se o comando foi executado com sucesso
if [ $? -eq 0 ]; then
  echo "✅ Deploy finalizado com sucesso!"
  echo "🌐 Acesse: http://$NOME_DO_BUCKET.s3-website-us-east-1.amazonaws.com"
else
  echo "❌ Erro ao finalizar o deploy!"
  exit 1
fi