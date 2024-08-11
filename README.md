# self-service
self-service é um projeto escrito em TypeScript com a implementação de um serviço para uma lanchonete.
## DDD
### Event Storming
Para esclarecimento das funcionalidades do projeto, pode-se consultar o event storming no seguinte link: https://miro.com/app/board/uXjVK5Nr1BA=/?share_link_id=973174946711 

### Glossário
Foi escrita uma wiki com o glossário do projeto, contendo o dicionário com a linguagem ubíqua, veja o link: https://github.com/cloud-burger/self-service/wiki/Gloss%C3%A1rio

## Dependências
Será necessário instalar o docker compose, para isso é recomendada a instalação do docker desktop: https://www.docker.com/products/docker-desktop/

É recomendado ter o node em ambiente local, assim será possível instalar as dependências do projeto e evitar que o seu editor fique acusando erro nas bibliotecas, para isso, primeiramente instale o node na sua máquina: https://nodejs.org/pt (O projeto foi desenvolvido e testado com a versão 20 do node).

Tendo o node instalado, execute o comando abaixo para a instalação das dependências: 
```
npm install
```

### Pacotes do projeto
Alguns dos pacotes utilizados e instalados quando se executa o `npm install` se encontram no seguinte repositório: https://github.com/cloud-burger/packages

Esse repositório contém algumas bibliotecas privadas desenvolvidas por nós para nos ajudar com algumas implementações do projeto, como logger e handler de APIs.

## Rodar o projeto
O projeto possui a dependência de uma base de dados, portanto, para isso será necessário subir os seus containers. 

Primeiramente realize o build das imagens do docker. Para isso, execute o seguinte comando na raiz do projeto:
```
docker compose build
```
Na sequência realize o up dos containers com o seguinte comando: 
```
docker compose up
```
Será realizado o up de um container com o Postgres, isso já irá popular a base de dados com registros de exemplo.
Além do Postres, também será realizado o up do container da imagem do serviço, compilando os arquivos TS. 

Realizado o up dos containers corretamente, o serviço estará disponível na porta `8080`.

## Portas do serviço
O serviço estará disponível na porta `8080`.
```
http://localhost:8080/
```

A base de dados do Postgres estará disponível na porta `5432`.

Demais informações sobre credenciais de acesso do ambiente local podem ser encontradas no arquivo `.env`, que está na raiz do projeto.

## Rodar os testes 
Primeiro, instale as dependências do projeto:
```
npm install
```
Na sequência execute o seguinte comando para realizar os testes:
```
npm run test
```

## Documentação OpenAPI
O projeto possui uma documentação OpenAPI que pode ser visualizada no endereço: http://localhost:8080/swagger/
...

## Desenvolvimento
Durante o desenvolvimento do projeto, sempre que um arquivo TS for alterado, para a realização da compilação dos arquivos com as novas alterações será necessário rebuildar as imagens do docker. Para ajudar nesse processo, alguns script foram criados, o principal deles é o `rebuild.sh`.

Portanto, quando uma alteração for realizada, é necessário realizar o down dos seus contêineres com o seguinte comando sendo executado na raiz do projeto: 
```
docker compose down
```

Realizado o down dos containers, então executar o script com o seguinte comando: 
```
./scripts/rebuild.sh
```

O script irá remover as imagens dos container e realizar um novo up deles, já com os arquivos TS recompilados. 

## Base de dados
Como adiantado nos tópicos acima, o projeto utiliza um banco de dados com o Postgres. Uma documentação completa com as suas entidades do projeto pode ser visualizada no seguinte arquivo: https://github.com/cloud-burger/self-service/blob/main/docs/self-service.md

É possível se conectar com a base utilizando as configurações do arquivo `.env`. Veja exemplo de configuração usando o DBeaver:
![image](https://github.com/user-attachments/assets/ca5a231e-4609-4f35-bbc4-c28fef4eba19)
