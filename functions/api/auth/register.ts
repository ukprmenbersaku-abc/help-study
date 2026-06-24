// Types for local TypeScript compilation safety
type PagesFunction = any;

export const onRequestPost: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
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

    // Hash password with standard Web Crypto SHA-256 (fully supported in Cloudflare Pages)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Check if user already exists
    const existing = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();
    if (existing) {
      return new Response(JSON.stringify({ success: false, message: 'このユーザーIDは既に登録されています。' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const nowStr = new Date().toISOString();
    await env.DB.prepare('INSERT INTO users (id, password, created_at) VALUES (?, ?, ?)')
      .bind(userId, hashedPassword, nowStr)
      .run();

    return new Response(JSON.stringify({ success: true, message: 'ユーザー登録が完了しました。' }), {
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
