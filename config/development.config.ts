/ eslint-disable complexity /;
import { Dialect } from 'sequelize/types';

export const config = () => ({
  database: {
    dialect: 'mysql' as Dialect,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
    define: {
      underscored: true,
    },
  },
  JwtSecret: process.env.JWT_SECRET,
  confirmStaff: process.env.CONFIRM_STAFF,
  confirmUser: process.env.CONFIRM_USER,
  confirmTicket: process.env.CONFIRM_TICKET,
});
