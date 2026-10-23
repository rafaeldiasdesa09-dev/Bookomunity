# Bookomunity

Esta API é feita somente para fins de estudo, e não é um produto real.
O código, a logo e a empresa do website foram criados por nós. A empresa e produtos do website não se trata de uma marca real, sendo apenas um elemento estético.

### Responsabilidades
Lider técnico: quem percebia os erros primeiro

Back-End e Banco de Dados: Victor Gabriel, Jonas Gomes, Rafael Dias, Pedro Emanoel e Heitor Jorge

Front-End: João Marvin e Rafael Dias

Documentação: Jonas Gomes, Victor Gabriel e Rafael Dias

Testes: Victor Gabriel

#
### Dependências:

- NodeJS
- MySQL

## Estrutura de pastas
O projeto foi feito tendo em mente o padrão MVC de estrutura de pastas, entratanto, devido a integração com MySQL, não há presença do Model.

## Executando o código:
1. Primeiramente na pasta raiz do projeto, execute este comando para instalar os módulos Node requeridos pela API.
```
npm install
```

2. Execute o script do arquivo ```base.sql``` utilizando o comando do mysql, o mysql já deve ter sido configurado anteriormente.
```
# estando na raiz do projeto
mysql -u root -p bookomunity_db < base.sql
```

3. Crie um arquivo de nome ```.env``` para que seja possível a conexão do back-end com o banco de dados. O formato do conteúdo do arquivo está presente no ```.env.exemplo```, necessitando somente que seja substituido a senha pela que foi configurada em seu pc.
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=[ALTERE ISSO]
DB_NAME=bookomunity_db
```

4. Execute este comando para executar o servidor com TSX watch.
```
npm run dev
```