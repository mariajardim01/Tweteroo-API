# Twitter Clone API

Uma API simples que simula as funcionalidades básicas de um sistema de microblog, como o Twitter. Permite o registro de usuários, criação, leitura, atualização e exclusão de tweets. Utiliza MongoDB para armazenamento de dados.

## Tecnologias Usadas

- Node.js
- Express.js
- MongoDB
- Joi (Validação de dados)
- http-status (Códigos de status HTTP)
- CORS (Permite requisições de diferentes origens)

## Funcionalidades

- **Cadastro de Usuário (`POST /sign-up`)**: Permite a criação de um novo usuário fornecendo `username` e `avatar`.
- **Criação de Tweet (`POST /tweets`)**: Permite a criação de um novo tweet associado a um usuário.
- **Listagem de Tweets (`GET /tweets`)**: Recupera todos os tweets, com informações do usuário (username e avatar) associados ao tweet.
- **Atualização de Tweet (`PUT /tweets/:id`)**: Permite a atualização de um tweet existente.
- **Exclusão de Tweet (`DELETE /tweets/:id`)**: Permite a exclusão de um tweet existente.

## Instalação

1. Clone este repositório:

    ```bash
    git clone https://github.com/mariajardim01/Tweteroo-API.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd Tweteroo-API
    ```

3. Instale as dependências:

    ```bash
    npm i
    ```

4. Crie um arquivo `.env` na raiz do projeto e defina as variáveis necessárias:

    ```
    DATABASE_URL=mongodb://localhost:27017/twitter-clone
    PORT=5000
    ```

    - `DATABASE_URL`: URL de conexão com o banco de dados MongoDB.
    - `PORT`: Porta em que a API será executada.

5. Inicie o servidor:

    ```bash
    npm start
    ```

A API estará disponível em `http://localhost:5000`.

