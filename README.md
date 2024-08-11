# Self-Service

O projeto **Self-Service** é uma solução desenvolvida em TypeScript para a implementação de um serviço de pedidos em uma lanchonete.

## Domain Driven Design (DDD)

### Event Storming

Para esclarecer as funcionalidades e os fluxos do projeto, consulte o Event Storming disponível no seguinte link: [Event Storming | Miro](https://miro.com/app/board/uXjVK5Nr1BA=/?share_link_id=973174946711).

### Glossário

O projeto possui uma wiki com o glossário e o dicionário de termos utilizados, detalhando a linguagem ubíqua. Acesse o glossário aqui: [Glossário](https://github.com/cloud-burger/self-service/wiki/Gloss%C3%A1rio).

## Dependências

### Docker e Node.js

Este projeto requer a instalação do Docker Compose e do Node.js(Para build local).

Recomendamos a instalação do Docker Desktop seguindo este [tutorial de instalação do Docker](https://www.docker.com/products/docker-desktop).

### Pacotes do projeto

Alguns dos pacotes utilizados são instalados automaticamente ao executar `npm install`. Esses pacotes estão disponíveis em nosso repositório de bibliotecas: [Projeto com bibliotecas privadas](https://github.com/cloud-burger/packages). Esse repositório inclui bibliotecas como loggers e handlers de APIs, também disponíveis publicamente no [NPM](https://www.npmjs.com/).

## Execução do projeto

### Construção e inicialização dos Containers

O projeto depende de um banco de dados, que será executado em um container Docker. Para configurar o ambiente, execute o comando abaixo:

```bash
docker compose up
```

Após a execução do comando, o serviço estará disponível na porta `8080`, seguindo as parametrizações do arquivo `.env` na raiz do projeto, como por exemplo credencais de acesso do banco de dados.
O container do PostgreSQL será populado automaticamente com dados de exemplo.

## Acesso ao serviço

- Serviço: <http://localhost:8080/>
- Banco de dados PostgreSQL: Porta 5432

## Documentação

A documentação OpenAPI do projeto está disponível em: [Documentação OpenAPI](http://localhost:8080/swagger/)

Uma versão alternativa gerada com Redoc pode ser acessada em:  [Documentação Redoc](http://localhost:3000/docs/self-service.html)


## Desenvolvimento

O projeto foi desenvolvido e testado com a versão 20 do Node.js. Para instalar o Node.js, siga este [tutorial](https://nodejs.org/pt).

### Instalação de dependências

1. Execute o comando abaixo na raiz do projeto:

    ```bash
    npm install
    ```

### Testes unitários

1. Execute o comando abaixo na raiz do projeto:

    ```bash
    npm run test
    ```

Durante o desenvolvimento, sempre que um arquivo TypeScript for alterado, será necessário recompilar os arquivos e rebuildar as imagens Docker. Utilize o script rebuild.sh para facilitar esse processo:

1. Execute o script de rebuild:

    ```bash
    ./scripts/rebuild.sh
    ```

Este script removerá as imagens atuais e subirá novas, já com os arquivos TypeScript recompilados.

## Banco de Dados

O projeto utiliza um banco de dados PostgreSQL. Uma documentação completa das entidades está disponível em: [Refinamento](docs/self-service.md)

Conecte-se à base de dados usando as configurações fornecidas no arquivo `.env`. Exemplo de configuração no DBeaver:
![image](https://github.com/user-attachments/assets/ca5a231e-4609-4f35-bbc4-c28fef4eba19)
