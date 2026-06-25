// Types for local TypeScript compilation safety
type PagesFunction = any;
import { ensureTables } from '../db';

export const onRequestGet: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
    await ensureTables(env.DB);

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, exists: false, message: 'ユーザーIDが必要です。' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Fetch user from D1 database
    const user = await env.DB.prepare('SELECT avatar FROM users WHERE id = ?').bind(userId).first() as any;
    if (!user) {
      return new Response(JSON.stringify({ success: true, exists: false }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      exists: true,
      avatar: user.avatar || null
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
};

// Handle CORS Preflight requests
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
