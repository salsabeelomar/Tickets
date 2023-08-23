import config from '../config/index.config';
let databaseConfig: any;
config.forEach(
  (value) => (databaseConfig = value().database ?? databaseConfig),
);
module.exports = databaseConfig;
