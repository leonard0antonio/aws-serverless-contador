# 🚀 AWS Serverless: Contador de Acessos

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

## 1. Visão Geral do Projeto
Uma startup de marketing demandou a criação de uma página de "Em Breve" para o lançamento de um novo produto. O requisito central era a implementação de um contador de acessos simples e público. Devido à imprevisibilidade do tráfego (podendo variar de dezenas a milhões de acessos), a solução precisava ser estritamente **Serverless**, garantindo alta disponibilidade, escalabilidade automática e custos atrelados exclusivamente ao uso real.

## 2. Arquitetura da Solução
A arquitetura foi desenhada utilizando serviços nativos da Amazon Web Services (AWS), dividida em camadas de armazenamento de dados, processamento lógico, roteamento de API e hospedagem de interface estática.

* **Front-End:** Amazon S3 (Static Website Hosting)
* **Roteamento (API):** Amazon API Gateway (REST API)
* **Computação (Lógica):** AWS Lambda (Node.js)
* **Banco de Dados:** Amazon DynamoDB (NoSQL)

### Diagrama da Arquitetura
![Arquitetura da Solução](docs/arquitetura.png)

## 3. Implementação do Back-End (Infraestrutura)

### 3.1. Banco de Dados (Amazon DynamoDB)
Foi criada uma tabela focada em alta performance de leitura e gravação:
* **Nome da Tabela:** `TabelaContador`
* **Partition Key:** `id` (String). Para este caso de uso simples, optou-se por utilizar uma chave fixa com o valor `hits`.
* **Capacity Mode:** *On-demand* (sob demanda). Esta escolha arquitetural foi feita para garantir que os custos operacionais fossem de apenas frações de centavos por requisição, eliminando o custo de capacidade ociosa.

### 3.2. Função de Computação (AWS Lambda)
A lógica de incremento do contador foi centralizada em uma função Lambda utilizando Node.js.

* **Desafio Técnico de Segurança (IAM):** A função foi atrelada à `LabRole` existente para garantir a comunicação segura com o DynamoDB.
* **Desafio Técnico de Banco de Dados:** Durante o desenvolvimento, identificou-se que `total` é uma palavra reservada (*reserved keyword*) no DynamoDB. O código foi refatorado utilizando `ExpressionAttributeNames` para contornar essa limitação técnica através de aliases (`#t`).
```

### 3.3. Roteamento e Proteção (Amazon API Gateway)

A função Lambda foi exposta para a internet pública através de uma API REST.

* **Integração:** Foi ativado o recurso *Lambda Proxy Integration*, permitindo que os cabeçalhos HTTP (como regras de CORS) definidos no código do Lambda fossem repassados corretamente ao navegador do cliente, evitando bloqueios de Cross-Origin.
* **Segurança (Throttling):** Para mitigar abusos, ataques de repetição ou ações de bots, foi configurado o *Rate Limiting* direto no estágio (`prod`) do API Gateway, estabelecendo um teto seguro para requisições por segundo, protegendo o banco de dados e controlando custos.

## 4. Implementação do Front-End

A interface foi construída com HTML, CSS e JavaScript puros, focando em performance e responsividade (Mobile First).

* **Estratégia de Otimização de Experiência (UX):** Para evitar que o usuário perceba a latência da comunicação com a API em conexões lentas, foi implementada uma estratégia de cache local utilizando o `localStorage` do navegador. O número de acessos salvo na última visita é exibido instantaneamente, enquanto o JavaScript faz o *fetch* assíncrono (em background) para atualizar o valor real na tela em seguida.
* **Hospedagem:** Os arquivos estáticos foram hospedados em um Bucket do Amazon S3, com a funcionalidade *Static Website Hosting* habilitada e as políticas de balde (Bucket Policy) ajustadas para permitir a leitura pública dos objetos.

## 5. Estimativa de Custos e Viabilidade Comercial

Para validar a eficiência financeira da arquitetura proposta, foi gerada uma estimativa de custos projetando um cenário de alto tráfego com **100.000 acessos mensais**. O custo provisionado atesta a alta eficiência da computação sob demanda.


*(Veja o relatório completo em PDF na pasta `/docs/estimativa-custos.pdf`)*

## 6. Evidências do Projeto em Produção

A infraestrutura encontra-se operando em nuvem e pode ser validada através dos seguintes endpoints:

* **Interface Gráfica (S3):** [http://meu-contador-em-breve-2026.s3-website-us-east-1.amazonaws.com](http://meu-contador-em-breve-2026.s3-website-us-east-1.amazonaws.com)
* **Endpoint da API REST:** `https://ay7ecr9u15.execute-api.us-east-1.amazonaws.com/prod/contador`

## 7. Conclusões

O projeto demonstrou com sucesso a viabilidade da utilização de arquiteturas completamente gerenciadas (Serverless). A resolução de problemas em tempo real — desde o contorno de restrições de infraestrutura como código (IaC) em laboratórios restritos até o tratamento de integração de CORS e performance no client-side — evidenciou a robustez da stack tecnológica escolhida e as melhores práticas do desenvolvimento e implantação de software em nuvem.

```

### Passo 3: Subindo tudo para o GitHub

Se você já tem o repositório criado lá no site do GitHub, existem duas formas de subir:

**Modo Rápido (Pelo Site):**
1. Abra o seu repositório no navegador.
2. Clique em **Add file** -> **Upload files**.
3. Arraste e solte todos os arquivos e pastas (`docs`, `backend`, `frontend`, `README.md`) para dentro da tela.
4. Clique no botão verde **Commit changes**.

**Modo Profissional (Via Git no Terminal):**
Se quiser fazer via linha de comando, abra o terminal dentro da pasta raiz (`aws-serverless-contador`) e rode:
```bash
git init
git add .
git commit -m "feat: adiciona arquitetura serverless de contador de acessos e documentação"
git branch -M main
git remote add origin SUA_URL_DO_GITHUB_AQUI
git push -u origin main

```

Assim que subir, o seu `README.md` vai processar todas as imagens da pasta `/docs` e criar uma vitrine espetacular para o seu projeto!