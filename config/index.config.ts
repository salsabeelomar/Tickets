import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './development.config';
const env = process.env.NODE_ENV;
let currentConfig = null;
const filePath = `${env}.config`;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { config } = require(`./${filePath}`);

  currentConfig = config;
} catch (error) {}

const current = currentConfig || config;

export default [config, current];
