import knex from 'knex';
import path from 'path'; //padroniza o caminho correto

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault:true,
});

export default connection;