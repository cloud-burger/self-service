# Self-Service

O projeto **Self-Service** é uma solução desenvolvida em TypeScript para a implementação de um serviço de pedidos em uma lanchonete.

## Domain Driven Design (DDD)

### Event Storming

Para esclarecer as funcionalidades e os fluxos do projeto, consulte o Event Storming disponível no seguinte link: [Event Storming | Miro](https://miro.com/app/board/uXjVK5Nr1BA=/?share_link_id=973174946711).

### Glossário

O projeto possui uma wiki com o glossário e o dicionário de termos utilizados, detalhando a linguagem ubíqua. Acesse o glossário aqui: [Glossário](https://github.com/cloud-burger/self-service/wiki/Gloss%C3%A1rio).

## Dependências

### Docker e Node.js

Este projeto requer a instalação do Docker Compose e do Node.js. Recomendamos a instalação do Docker Desktop seguindo este [tutorial de instalação do Docker](https://www.docker.com/products/docker-desktop).

O projeto foi desenvolvido e testado com a versão 20 do Node.js. Para instalar o Node.js, siga este [tutorial](https://nodejs.org/pt).

Após instalar o Node.js, execute o comando abaixo para instalar as dependências do projeto:

```bash
npm install
```

### Pacotes do projeto

Alguns dos pacotes utilizados são instalados automaticamente ao executar `npm install`. Esses pacotes estão disponíveis em nosso repositório de bibliotecas privadas: [Projeto com bibliotecas privadas](https://github.com/cloud-burger/packages). Esse repositório inclui bibliotecas como loggers e handlers de APIs, também disponíveis publicamente no [NPM](https://www.npmjs.com/).

## Execução do projeto

### Construção e inicialização dos Containers

O projeto depende de um banco de dados, que será executado em um container Docker. Para configurar o ambiente:

1. Realize o build das imagens Docker:

    ```bash
    docker compose build
    ```

2. Inicie os containers:

    ```bash
    docker compose up
    ```

Após a execução dos comandos, o serviço estará disponível na porta 8080. O container do Postgres será populado automaticamente com dados de exemplo.

## Acesso ao serviço

- Serviço: <http://localhost:8080/>
- Banco de dados Postgres: Porta 5432

Informações sobre as credenciais de acesso estão disponíveis no arquivo `.env` na raiz do projeto.

## Testes

Para rodar os testes do projeto, siga os passos abaixo:

1. Instale as dependências:

    ```bash
    npm install
    ```

2. Execute os testes:

    ```bash
    npm run test
    ```

## Documentação

A documentação OpenAPI do projeto está disponível em: [Documentação OpenAPI](http://localhost:8080/swagger/)

TUma versão alternativa gerada com Redoc pode ser acessada em:  [Documentação Redoc](http://localhost:3000/docs/self-service.html)

## Desenvolvimento

Durante o desenvolvimento, sempre que um arquivo TypeScript for alterado, será necessário recompilar os arquivos e rebuildar as imagens Docker. Utilize o script rebuild.sh para facilitar esse processo:

1. Derrube os containers existentes:

    ```bash
    docker compose down
    ```

2. Execute o script de rebuild:

    ```bash
    ./scripts/rebuild.sh
    ```

Este script removerá as imagens atuais e subirá novas, já com os arquivos TypeScript recompilados.

## Banco de Dados

O projeto utiliza um banco de dados Postgres. Uma documentação completa das entidades está disponível em: [Refinamento](docs/self-service.md)

Conecte-se à base de dados usando as configurações fornecidas no arquivo `.env`. Exemplo de configuração no DBeaver:
![image](https://github.com/user-attachments/assets/ca5a231e-4609-4f35-bbc4-c28fef4eba19)
