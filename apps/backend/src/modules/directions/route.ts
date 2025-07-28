import { Hono } from 'hono';
import { getDirections } from './controller';

const directions = new Hono();

directions.post('/', getDirections);

export { directions };
