import { supabase } from './supabase';

const JSON_HEADERS = {
  Accept: 'application/json',
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

const DEMO_USERS = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'poster_zenith',
    email: 'ops@zenithlabs.test',
    role: 'poster',
    full_name: 'Arjun Mehta',
    bio: 'Innovation lead at Zenith Labs',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    username: 'contrib_adi',
    email: 'adi@innovators.test',
    role: 'contributor',
    full_name: 'Aditya Rao',
    bio: 'Systems engineer and rapid prototyper',
  },
];

const DEMO_POSTER_PROFILES = [
  {
    user_id: '22222222-2222-2222-2222-222222222222',
    organisation_name: 'Zenith Labs',
    description: 'Applied R&D for industrial innovation',
    is_verified: true,
  },
];

const DEMO_CHALLENGES = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    poster_id: '22222222-2222-2222-2222-222222222222',
    title: 'Decarbonised Manufacturing Workflow',
    slug: 'decarbonised-manufacturing-workflow',
    description: 'Design a practical roadmap to reduce manufacturing emissions by 40%.',
    image_url: '/challenge-images/decarbonised-manufacturing.svg',
    category: 'Engineering',
    sub_tags: ['climate', 'manufacturing', 'optimization'],
    target_disciplines: ['Engineering', 'Research', 'Policy'],
    status: 'active',
    prize_pool_paise: 1200000,
    current_phase: 2,
    submission_count: 2,
    participant_count: 14,
    phase2_end_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_featured: true,
    deleted_at: null,
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    poster_id: '22222222-2222-2222-2222-222222222222',
    title: 'Citizen-Centric Service Reimagining',
    slug: 'citizen-centric-service-reimagining',
    description: 'Improve public service request handling with measurable SLA gains.',
    image_url: '/challenge-images/citizen-service.svg',
    category: 'Design',
    sub_tags: ['public-sector', 'service-design'],
    target_disciplines: ['Design', 'Policy', 'Marketing'],
    status: 'active',
    prize_pool_paise: 900000,
    current_phase: 2,
    submission_count: 1,
    participant_count: 10,
    phase2_end_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    is_featured: false,
    deleted_at: null,
  },
  {
    id: '80000000-0000-0000-0000-000000000003',
    poster_id: '22222222-2222-2222-2222-222222222222',
    title: 'Adaptive Grid Stability AI',
    slug: 'adaptive-grid-stability-ai',
    description: 'Build a forecasting layer that predicts grid stress 24 hours ahead.',
    image_url: '/challenge-images/research-generic.svg',
    category: 'Research',
    sub_tags: ['energy', 'ai', 'forecasting'],
    target_disciplines: ['Research', 'Engineering'],
    status: 'active',
    prize_pool_paise: 1500000,
    current_phase: 1,
    submission_count: 0,
    participant_count: 6,
    phase2_end_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_featured: true,
    deleted_at: null,
  },
];

const DEMO_SUBMISSIONS = [
  {
    id: '88000000-0000-0000-0000-000000000001',
    challenge_id: '80000000-0000-0000-0000-000000000001',
    submitted_by: '44444444-4444-4444-4444-444444444444',
    title: 'Factory Heat Recovery Optimizer',
    status: 'sealed',
    submitted_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    pss_total: 88.25,
  },
  {
    id: '88000000-0000-0000-0000-000000000002',
    challenge_id: '80000000-0000-0000-0000-000000000002',
    submitted_by: '44444444-4444-4444-4444-444444444444',
    title: 'Adaptive Scheduling via Reinforcement Learning',
    status: 'sealed',
    submitted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    pss_total: 81.5,
  },
];

const DEMO_CRITERIA = {
  '80000000-0000-0000-0000-000000000001': [
    { criterion_name: 'Technical Feasibility', description: 'Engineering viability and realism', weight_percent: 35, sort_order: 1 },
    { criterion_name: 'Impact Potential', description: 'Emission reduction potential at scale', weight_percent: 30, sort_order: 2 },
    { criterion_name: 'Execution Plan', description: 'Roadmap quality and milestones', weight_percent: 35, sort_order: 3 },
  ],
  '80000000-0000-0000-0000-000000000002': [
    { criterion_name: 'User Experience', description: 'Ease of adoption by citizens', weight_percent: 40, sort_order: 1 },
    { criterion_name: 'Policy Alignment', description: 'Regulatory and governance fit', weight_percent: 30, sort_order: 2 },
    { criterion_name: 'Operational Effectiveness', description: 'SLA and throughput improvement', weight_percent: 30, sort_order: 3 },
  ],
};

function createApiError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getMethod(options = {}) {
  return (options.method || 'GET').toUpperCase();
}

function normalizeApiPath(path) {
  if (!path) return '';
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const url = new URL(path);
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return path;
  }
  return path;
}

function parseApiPath(path) {
  const normalized = normalizeApiPath(path);
  const [pathname, queryString = ''] = normalized.split('?');
  return {
    pathname,
    searchParams: new URLSearchParams(queryString),
  };
}

function buildDisplayName(user = {}, fallbackEmail = '') {
  const emailPrefix = (fallbackEmail || '').split('@')[0];
  return user.full_name || user.name || user.username || emailPrefix || 'Researcher';
}

function toRupees(value) {
  return Number(value || 0) / 100;
}

function mapChallengeStatus(status) {
  if (status === 'active') return 'Open';
  if (status === 'sealed') return 'Sealed';
  if (status === 'completed') return 'Completed';
  return status || 'Open';
}

function getDaysRemaining(challenge) {
  const now = Date.now();
  const phaseEnds = [
    challenge.phase1_end_at,
    challenge.phase2_end_at,
    challenge.phase3_end_at,
    challenge.phase4_end_at,
  ]
    .map((value) => (value ? new Date(value).getTime() : null))
    .filter(Boolean)
    .sort((a, b) => a - b);

  const nextEnd = phaseEnds.find((endAt) => endAt > now);
  if (!nextEnd) return 0;
  return Math.max(0, Math.ceil((nextEnd - now) / (1000 * 60 * 60 * 24)));
}

async function getSessionUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw createApiError(error.message, 401);
  if (!data?.session?.user) throw createApiError('Unauthorized', 401);
  return data.session.user;
}

async function getDbUserBySessionUser(sessionUser) {
  const byId = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionUser.id)
    .maybeSingle();

  if (byId.data) return byId.data;

  const byEmail = await supabase
    .from('users')
    .select('*')
    .eq('email', sessionUser.email)
    .maybeSingle();

  return byEmail.data || null;
}

function toApiUser(sessionUser, dbUser) {
  const meta = sessionUser.user_metadata || {};
  const name = buildDisplayName(dbUser || meta, sessionUser.email || '');

  return {
    id: dbUser?.id || sessionUser.id,
    email: dbUser?.email || sessionUser.email,
    username: dbUser?.username || meta.username || (sessionUser.email || '').split('@')[0],
    name,
    full_name: name,
    role: dbUser?.role || meta.role || 'contributor',
    avatar_url: dbUser?.avatar_url || meta.avatar_url || null,
    organization_name: dbUser?.organisation_name || meta.organization_name || null,
  };
}

function mapChallengeRow(challenge, userMap, posterProfileMap) {
  const poster = userMap.get(challenge.poster_id);
  const posterProfile = posterProfileMap.get(challenge.poster_id);
  const daysRemaining = getDaysRemaining(challenge);

  return {
    id: challenge.id,
    title: challenge.title,
    slug: challenge.slug,
    description: challenge.description,
    summary: challenge.description,
    category: challenge.category,
    image_url: challenge.image_url || null,
    image: challenge.image_url || null,
    subcategory: challenge.category,
    sub_tags: challenge.sub_tags || [],
    target_disciplines: challenge.target_disciplines || [],
    status: mapChallengeStatus(challenge.status),
    raw_status: challenge.status,
    prize_pool: toRupees(challenge.prize_pool_paise),
    prize: toRupees(challenge.prize_pool_paise),
    prize_value: toRupees(challenge.prize_pool_paise),
    current_phase: challenge.current_phase,
    phase_label: challenge.current_phase ? `Phase ${challenge.current_phase}` : 'Open',
    current_phase_label: challenge.current_phase ? `Phase ${challenge.current_phase}` : 'Open',
    submission_count: challenge.submission_count || 0,
    participant_count: challenge.participant_count || 0,
    days_remaining: daysRemaining,
    time_left: daysRemaining > 0 ? `${daysRemaining} days remaining` : 'TBD',
    created_at: challenge.created_at,
    company_name: posterProfile?.organisation_name || poster?.full_name || poster?.username,
    company_verified: Boolean(posterProfile?.is_verified),
    poster: {
      name: posterProfile?.organisation_name || poster?.full_name || poster?.username || 'Innova Partner',
      verified: Boolean(posterProfile?.is_verified),
      description: posterProfile?.description || poster?.bio || 'Challenge poster',
    },
  };
}

async function loadPosterMaps(challenges) {
  const posterIds = [...new Set((challenges || []).map((row) => row.poster_id).filter(Boolean))];

  if (!posterIds.length) {
    return { userMap: new Map(), posterProfileMap: new Map() };
  }

  const [usersResult, posterProfilesResult] = await Promise.all([
    supabase.from('users').select('id,username,full_name,bio').in('id', posterIds),
    supabase.from('poster_profiles').select('user_id,organisation_name,description,is_verified').in('user_id', posterIds),
  ]);

  const userMap = new Map((usersResult.data || []).map((row) => [row.id, row]));
  const posterProfileMap = new Map((posterProfilesResult.data || []).map((row) => [row.user_id, row]));
  return { userMap, posterProfileMap };
}

function getDemoMaps() {
  return {
    userMap: new Map(DEMO_USERS.map((row) => [row.id, row])),
    posterProfileMap: new Map(DEMO_POSTER_PROFILES.map((row) => [row.user_id, row])),
  };
}

async function offlineApiFallback(path, options = {}) {
  const method = getMethod(options);
  const { pathname, searchParams } = parseApiPath(path);

  const emptyList = { items: [] };

  let sessionUser = null;
  let dbUser = null;

  try {
    sessionUser = await getSessionUser();
    dbUser = await getDbUserBySessionUser(sessionUser);
  } catch {
    sessionUser = null;
    dbUser = null;
  }

  if (method === 'GET' && pathname === '/api/users/me') {
    if (!sessionUser) throw createApiError('Unauthorized', 401);
    return toApiUser(sessionUser, dbUser);
  }

  if (method === 'GET' && pathname === '/api/users/me/stats') {
    const userId = dbUser?.id || sessionUser?.id;
    if (!userId) return {
      streak: 0,
      active_submissions: 0,
      reputation_score: 0,
      total_earnings: 0,
    };

    const [profileResult, submissionResult] = await Promise.all([
      supabase
        .from('contributor_profiles')
        .select('reputation_score,total_earnings_paise')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('submitted_by', userId),
    ]);

    return {
      streak: 0,
      active_submissions: submissionResult.count || 0,
      reputation_score: Number(profileResult.data?.reputation_score || 0),
      total_earnings: toRupees(profileResult.data?.total_earnings_paise || 0),
    };
  }

  if (method === 'GET' && pathname === '/api/users/me/reputation') {
    const userId = dbUser?.id || sessionUser?.id;
    if (!userId) return {};

    const { data } = await supabase
      .from('reputation_profiles')
      .select('discipline_breakdown')
      .eq('user_id', userId)
      .maybeSingle();

    return data?.discipline_breakdown || {};
  }

  if (pathname === '/api/notifications/read-all' && method === 'PATCH') {
    if (!dbUser?.id) return { success: true };

    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', dbUser.id)
      .eq('is_read', false);

    return { success: true };
  }

  if (method === 'GET' && pathname.startsWith('/api/notifications')) {
    if (!dbUser?.id) return emptyList;

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 30);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data } = await supabase
      .from('notifications')
      .select('id,type,message,is_read,created_at')
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    return {
      items: (data || []).map((row) => ({
        id: row.id,
        type: row.type,
        message: row.message,
        read: row.is_read,
        created_at: row.created_at,
      })),
    };
  }

  if (method === 'GET' && pathname === '/api/challenges/me/top-contributors') {
    const limit = Number(searchParams.get('limit') || 5);
    const { data: profiles } = await supabase
      .from('reputation_profiles')
      .select('user_id,composite_reputation_score')
      .order('composite_reputation_score', { ascending: false })
      .limit(limit);

    const userIds = [...new Set((profiles || []).map((row) => row.user_id).filter(Boolean))];
    const { data: users } = userIds.length
      ? await supabase.from('users').select('id,username,full_name').in('id', userIds)
      : { data: [] };

    const userMap = new Map((users || []).map((row) => [row.id, row]));
    return {
      items: (profiles || []).map((row) => ({
        id: row.user_id,
        username: userMap.get(row.user_id)?.username || userMap.get(row.user_id)?.full_name || 'Contributor',
        reputation: Number(row.composite_reputation_score || 0),
      })),
    };
  }

  if (method === 'GET' && pathname === '/api/challenges/check-slug') {
    const slug = searchParams.get('slug');
    if (!slug) return { available: false };

    const { data } = await supabase
      .from('challenges')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) {
      const existsInDemo = DEMO_CHALLENGES.some((row) => row.slug === slug);
      return { available: !existsInDemo };
    }

    return { available: !data };
  }

  if (method === 'GET' && pathname.startsWith('/api/challenges/')) {
    const parts = pathname.split('/').filter(Boolean);
    const challengeId = parts[2];

    if (parts[3] === 'pss-preview') {
      if (!challengeId) return emptyList;
      const { data } = await supabase
        .from('pss_computations')
        .select('id,submission_id,pss_total,pss_rank,psa_amount_paise,user_id')
        .eq('challenge_id', challengeId)
        .order('pss_rank', { ascending: true });

      return {
        items: (data || []).map((row) => ({
          id: row.id,
          submission_id: row.submission_id,
          pss_total: row.pss_total,
          pss_rank: row.pss_rank,
          psa_amount: toRupees(row.psa_amount_paise),
          user_id: row.user_id,
        })),
      };
    }

    if (!challengeId) return emptyList;

    const { data: challenge } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .maybeSingle();

    const challengeRow = challenge || DEMO_CHALLENGES.find((row) => row.id === challengeId);
    if (!challengeRow) throw createApiError('Challenge not found', 404);

    const [criteriaResult, maps] = await Promise.all([
      challenge
        ? supabase
            .from('challenge_evaluation_criteria')
            .select('criterion_name,description,weight_percent,sort_order')
            .eq('challenge_id', challengeRow.id)
            .order('sort_order', { ascending: true })
        : Promise.resolve({ data: DEMO_CRITERIA[challengeRow.id] || [] }),
      challenge ? loadPosterMaps([challengeRow]) : Promise.resolve(getDemoMaps()),
    ]);

    return {
      ...mapChallengeRow(challengeRow, maps.userMap, maps.posterProfileMap),
      criteria: (criteriaResult.data || []).map((row) => ({
        title: row.criterion_name,
        name: row.criterion_name,
        description: row.description,
        desc: row.description,
        weight: Number(row.weight_percent || 0),
      })),
      judging_criteria: (criteriaResult.data || []).map((row) => ({
        title: row.criterion_name,
        description: row.description,
        weight: Number(row.weight_percent || 0),
      })),
    };
  }

  if (method === 'GET' && pathname === '/api/challenges') {
    let query = supabase
      .from('challenges')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    const status = searchParams.get('status');
    const posterId = searchParams.get('poster_id');
    const recommended = searchParams.get('recommended');
    const discipline = searchParams.get('discipline');
    const prizeMin = searchParams.get('prize_min');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (status) {
      query = query.eq('status', status);
    }

    if (posterId === 'me') {
      if (dbUser?.id) {
        query = query.eq('poster_id', dbUser.id);
      } else {
        return emptyList;
      }
    } else if (posterId) {
      query = query.eq('poster_id', posterId);
    }

    if (recommended === 'true') {
      query = query.eq('is_featured', true);
    }

    if (discipline) {
      query = query.contains('target_disciplines', [discipline]);
    }

    if (prizeMin) {
      query = query.gte('prize_pool_paise', Math.round(Number(prizeMin) * 100));
    }

    query = query.range(from, to);

    const { data: challenges, error } = await query;
    let challengeRows = challenges || [];
    let maps = await loadPosterMaps(challengeRows);

    if (error || challengeRows.length === 0) {
      const demoSource = DEMO_CHALLENGES.filter((row) => {
        if (status && row.status !== status) return false;
        if (recommended === 'true' && !row.is_featured) return false;
        if (discipline && !(row.target_disciplines || []).includes(discipline)) return false;
        if (prizeMin && Number(row.prize_pool_paise || 0) < Math.round(Number(prizeMin) * 100)) return false;
        return true;
      });
      challengeRows = demoSource.slice(from, to + 1);
      maps = getDemoMaps();
    }

    return {
      items: challengeRows.map((row) => mapChallengeRow(row, maps.userMap, maps.posterProfileMap)),
    };
  }

  if (method === 'GET' && pathname === '/api/submissions') {
    let query = supabase
      .from('submissions')
      .select('id,challenge_id,submitted_by,title,status,submitted_at,updated_at,pss_total')
      .order('submitted_at', { ascending: false });

    const userId = searchParams.get('user_id');
    const challengeId = searchParams.get('challenge_id');
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (challengeId) {
      query = query.eq('challenge_id', challengeId);
    }

    if (userId === 'me') {
      if (dbUser?.id) {
        query = query.eq('submitted_by', dbUser.id);
      }
    } else if (userId) {
      query = query.eq('submitted_by', userId);
    }

    if (status && status !== 'active') {
      query = query.eq('status', status);
    }

    query = query.range(from, to);

    const { data: submissions, error } = await query;
    let submissionRows = submissions || [];

    if (error || submissionRows.length === 0) {
      submissionRows = DEMO_SUBMISSIONS.filter((row) => {
        if (challengeId && row.challenge_id !== challengeId) return false;
        if (userId && userId !== 'me' && row.submitted_by !== userId) return false;
        if (userId === 'me' && dbUser?.id && row.submitted_by !== dbUser.id) return false;
        return true;
      }).slice(from, to + 1);
    }

    const challengeIds = [...new Set(submissionRows.map((row) => row.challenge_id).filter(Boolean))];
    const userIds = [...new Set(submissionRows.map((row) => row.submitted_by).filter(Boolean))];

    const [challengeResult, usersResult] = await Promise.all([
      challengeIds.length
        ? supabase.from('challenges').select('id,title,current_phase,phase2_end_at,category').in('id', challengeIds)
        : Promise.resolve({ data: [] }),
      userIds.length
        ? supabase.from('users').select('id,username,full_name').in('id', userIds)
        : Promise.resolve({ data: [] }),
    ]);

    const challengeMap = new Map(
      [...(challengeResult.data || []), ...DEMO_CHALLENGES]
        .map((row) => [row.id, row])
    );
    const userMap = new Map(
      [...(usersResult.data || []), ...DEMO_USERS]
        .map((row) => [row.id, row])
    );

    return {
      items: submissionRows.map((row) => {
        const challenge = challengeMap.get(row.challenge_id);
        const submitter = userMap.get(row.submitted_by);
        const daysRemaining = challenge
          ? getDaysRemaining({ phase2_end_at: challenge.phase2_end_at })
          : 0;

        return {
          id: row.id,
          challenge_id: row.challenge_id,
          challenge_name: challenge?.title || 'Challenge',
          challenge_title: challenge?.title || 'Challenge',
          title: row.title,
          category: challenge?.category || 'General',
          status: row.status,
          phase: challenge?.current_phase ? `Phase ${challenge.current_phase}` : 'Active',
          days_remaining: daysRemaining,
          created_at: row.submitted_at,
          updated_at: row.updated_at,
          contributor_name: submitter?.full_name || submitter?.username || 'Contributor',
          username: submitter?.username || submitter?.full_name || 'Contributor',
          pss_preview: Number(row.pss_total || 0),
        };
      }),
    };
  }

  if (method === 'GET' && pathname === '/api/activity') {
    const limit = Number(searchParams.get('limit') || 10);
    const userId = dbUser?.id;

    if (userId) {
      const { data: userNotifications } = await supabase
        .from('notifications')
        .select('id,message,type,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if ((userNotifications || []).length > 0) {
        return {
          items: userNotifications.map((row) => ({
            id: row.id,
            message: row.message || row.type,
            type: row.type,
            created_at: row.created_at,
          })),
        };
      }
    }

    const { data: submissions } = await supabase
      .from('submissions')
      .select('id,title,submitted_at,status')
      .order('submitted_at', { ascending: false })
      .limit(limit);

    const source = (submissions && submissions.length > 0)
      ? submissions
      : DEMO_SUBMISSIONS.map((row) => ({
          id: row.id,
          title: row.title,
          submitted_at: row.submitted_at,
          status: row.status,
        }));

    return {
      items: source.map((row) => ({
        id: row.id,
        message: `${row.title || 'Submission'} is ${row.status || 'updated'}`,
        type: 'submission',
        created_at: row.submitted_at,
      })),
    };
  }

  if (method === 'GET' && pathname === '/api/posters/me/stats') {
    if (!dbUser?.id) {
      return {
        active_challenges: 0,
        avg_completion_time: 0,
        prize_distributed: 0,
      };
    }

    const [activeResult, disbursementResult] = await Promise.all([
      supabase
        .from('challenges')
        .select('id', { count: 'exact', head: true })
        .eq('poster_id', dbUser.id)
        .eq('status', 'active'),
      supabase
        .from('prize_disbursements')
        .select('amount_paise')
        .eq('recipient_user_id', dbUser.id),
    ]);

    return {
      active_challenges: activeResult.count || 0,
      avg_completion_time: 0,
      prize_distributed: toRupees((disbursementResult.data || []).reduce((sum, row) => sum + Number(row.amount_paise || 0), 0)),
    };
  }

  if (method === 'GET' && pathname.startsWith('/api/profile/')) {
    const parts = pathname.split('/').filter(Boolean);
    const username = parts[2];
    const isHistory = parts[3] === 'challenge-history';

    const { data: profileUser } = await supabase
      .from('users')
      .select('id,username,full_name,country,avatar_url,bio')
      .eq('username', username)
      .maybeSingle();

    if (!profileUser) {
      if (isHistory) return emptyList;
      return {
        name: 'Guest User',
        title: 'Contributor',
        location: 'India',
        submissions_count: 0,
        wins: 0,
        reputation_score: 0,
        total_earned: 0,
        reputation: {},
        skills: [],
      };
    }

    if (isHistory) {
      const page = Number(searchParams.get('page') || 1);
      const limit = Number(searchParams.get('limit') || 10);
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: historyRows } = await supabase
        .from('submissions')
        .select('id,title,status,submitted_at,challenge_id,psa_amount_paise')
        .eq('submitted_by', profileUser.id)
        .order('submitted_at', { ascending: false })
        .range(from, to);

      const challengeIds = [...new Set((historyRows || []).map((row) => row.challenge_id).filter(Boolean))];
      const { data: challengeRows } = challengeIds.length
        ? await supabase.from('challenges').select('id,title').in('id', challengeIds)
        : { data: [] };
      const challengeMap = new Map((challengeRows || []).map((row) => [row.id, row]));

      return {
        items: (historyRows || []).map((row) => ({
          id: row.id,
          title: challengeMap.get(row.challenge_id)?.title || row.title || 'Submission',
          challenge_name: challengeMap.get(row.challenge_id)?.title || row.title || 'Submission',
          status: row.status,
          prize: toRupees(row.psa_amount_paise || 0),
          created_at: row.submitted_at,
        })),
      };
    }

    const [contributorProfile, reputationProfile, submissionCount] = await Promise.all([
      supabase
        .from('contributor_profiles')
        .select('skills,challenges_won,reputation_score,total_earnings_paise')
        .eq('user_id', profileUser.id)
        .maybeSingle(),
      supabase
        .from('reputation_profiles')
        .select('discipline_breakdown')
        .eq('user_id', profileUser.id)
        .maybeSingle(),
      supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('submitted_by', profileUser.id),
    ]);

    return {
      name: profileUser.full_name || profileUser.username,
      title: 'Contributor',
      location: profileUser.country || 'India',
      avatar_url: profileUser.avatar_url,
      submissions_count: submissionCount.count || 0,
      wins: contributorProfile.data?.challenges_won || 0,
      reputation_score: Number(contributorProfile.data?.reputation_score || 0),
      total_earned: toRupees(contributorProfile.data?.total_earnings_paise || 0),
      reputation: reputationProfile.data?.discipline_breakdown || {},
      skills: contributorProfile.data?.skills || [],
    };
  }

  if (method === 'POST' && pathname.startsWith('/api/challenges/') && pathname.endsWith('/watch')) {
    const challengeId = pathname.split('/')[3];
    if (!dbUser?.id || !challengeId) return { success: true };

    const { error } = await supabase
      .from('challenge_watchers')
      .upsert({ challenge_id: challengeId, user_id: dbUser.id }, { onConflict: 'challenge_id,user_id' });

    if (error) throw createApiError(error.message, 500);
    return { success: true };
  }

  if (method === 'POST' && pathname.startsWith('/api/auth/')) {
    throw createApiError(
      'Authentication backend is not configured. Set VITE_API_BASE_URL to enable real login.',
      503,
    );
  }

  if (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
    return { success: true };
  }

  return {};
}

function resolveRequestPath(path) {
  if (!path) return path;
  if (!path.startsWith('/api/')) return path;
  if (!API_BASE_URL) return path;
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${base}${path}`;
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

async function request(path, options = {}) {
  const isApiPath = typeof path === 'string' && path.startsWith('/api/');

  // If no REST backend is configured, return safe local fallbacks
  // so pages don't spam 404s during frontend-only development.
  if (isApiPath && !API_BASE_URL) {
    return await offlineApiFallback(path, options);
  }

  const response = await fetch(resolveRequestPath(path), {
    credentials: 'include',
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });

  const body = await parseBody(response);

  if (!response.ok) {
    const message = typeof body === 'string'
      ? body
      : body?.message || body?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export const api = {
  get: (path) => request(path),
  post: (path, data, options = {}) => request(path, { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  patch: (path, data, options = {}) => request(path, { method: 'PATCH', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  put: (path, data, options = {}) => request(path, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data), ...options }),
  del: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
};

export function withQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || Number.isNaN(value)) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          query.append(key, item);
        }
      });
      return;
    }
    query.append(key, value);
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}
