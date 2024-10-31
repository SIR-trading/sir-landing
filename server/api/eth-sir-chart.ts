// server/api/chart-data.ts
import { promises as fs } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const filePath = join(process.cwd(), 'assets/chart_data.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
});