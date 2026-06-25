// Types for local TypeScript compilation safety
type PagesFunction = any;

export const onRequestGet: PagesFunction = async (context: any) => {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'userId is required' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Execute parallel select prepare calls
    const subjectsResponse = await env.DB.prepare('SELECT * FROM subjects WHERE user_id = ?').bind(userId).all();
    const tasksResponse = await env.DB.prepare('SELECT * FROM tasks WHERE user_id = ?').bind(userId).all();
    const reviewsResponse = await env.DB.prepare('SELECT * FROM review_results WHERE user_id = ?').bind(userId).all();
    const progressResponse = await env.DB.prepare('SELECT * FROM user_progress WHERE user_id = ?').bind(userId).all();

    const subjects = subjectsResponse.results || [];
    const tasks = tasksResponse.results || [];
    const reviewResults = reviewsResponse.results || [];
    const progressRows = progressResponse.results || [];

    // Format tasks back to client structure
    const formattedTasks = tasks.map((t: any) => ({
      id: t.id,
      subjectId: t.subject_id,
      title: t.title,
      date: t.date,
      type: t.type,
      duration: t.duration || undefined,
      isCompleted: t.is_completed === 1 || t.is_completed === true,
      isImportant: t.is_important === 1 || t.is_important === true,
      assignment: t.assignment || undefined,
      pages: t.pages || undefined,
      memo: t.memo || undefined,
      startTime: t.start_time || undefined,
      notificationEnabled: t.notification_enabled === 1 || t.notification_enabled === true,
    }));

    // Format subjects back to client structure
    const formattedSubjects = subjects.map((s: any) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      goal: s.goal,
      icon: s.icon || undefined
    }));

    // Format review results
    const formattedReviewResults = reviewResults.map((r: any) => ({
      subjectId: r.subject_id,
      score: r.score,
      total: r.total,
      date: r.date
    }));

    // Format progress
    let formattedProgress = null;
    if (progressRows && progressRows.length > 0) {
      const p: any = progressRows[0];
      let badges = [];
      let unlockedTitles = [];
      try {
        badges = p.badges_json ? JSON.parse(p.badges_json) : [];
      } catch (e) {
        console.error('Error parsing badges:', e);
      }
      try {
        unlockedTitles = p.unlocked_titles_json ? JSON.parse(p.unlocked_titles_json) : [];
      } catch (e) {
        console.error('Error parsing titles:', e);
      }
      // Fetch user's avatar
      const userRow = await env.DB.prepare('SELECT avatar FROM users WHERE id = ?').bind(userId).first() as any;

      formattedProgress = {
        level: p.level,
        xp: p.xp,
        streak: p.streak,
        lastActive: p.last_active || undefined,
        reviewsCompletedCount: p.reviews_completed_count,
        isMember: p.is_member === 1 || p.is_member === true,
        badges: badges,
        unlockedTitles: unlockedTitles,
        activeTitle: p.active_title || undefined,
        articlesReadCount: p.articles_read_count || 0,
        avatarIcon: userRow?.avatar || undefined
      };
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        subjects: formattedSubjects.length > 0 ? formattedSubjects : null,
        tasks: formattedTasks.length > 0 ? formattedTasks : null,
        reviewResults: formattedReviewResults.length > 0 ? formattedReviewResults : null,
        userProgress: formattedProgress
      }
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
