// Types for local TypeScript compilation safety
type PagesFunction = any;
import { ensureTables } from '../db';

export const onRequestPost: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
    await ensureTables(env.DB);

    const body = await request.json() as any;
    const { userId, password } = body;
    if (!userId || !password) {
      return new Response(JSON.stringify({ success: false, message: 'ユーザーIDとパスワードは必須です。' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Hash password with Web Crypto SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Fetch user from D1 database
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first() as any;
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'ユーザーIDまたはパスワードが正しくありません。' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    if (user.password !== hashedPassword) {
      return new Response(JSON.stringify({ success: false, message: 'ユーザーIDまたはパスワードが正しくありません。' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'ログインに成功しました！',
      user: { id: user.id }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: 'エラーが発生しました: ' + error.message }), {
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
