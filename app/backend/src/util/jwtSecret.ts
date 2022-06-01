import { readFileSync } from 'fs';

export default readFileSync('./jwt.evaluation.key', { encoding: 'utf-8' });
