import type { APIRoute } from 'astro';
import { createRssResponse } from '../rss';

export const GET: APIRoute = ({ site }) => createRssResponse('ko', site);
