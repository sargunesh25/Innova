import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api, withQuery } from '../lib/api';

const DashboardContext = createContext();

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const mapChallenge = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description || c.summary || '',
  category: c.category || 'Engineering',
  image: c.image_url || c.image || '',
  subcategory: c.subcategory || c.category || 'General',
  timeLabel: c.days_remaining ? `${c.days_remaining}d Left` : (c.time_label || 'Live'),
  daysLeft: Number(c.days_remaining || c.days_left || 0),
  timeColor: (c.days_remaining || c.days_left || 0) <= 3 ? 'yellow' : 'green',
  prize: formatCurrency(c.prize_pool || c.prize || c.prize_value || 0),
  prizeValue: Number(c.prize_pool || c.prize || c.prize_value || 0),
  phase: c.phase_label || c.phase || `Phase ${c.current_phase || 1}`,
  status: c.status || 'Open',
  createdAt: new Date(c.created_at || Date.now()),
  host: {
    name: c.company_name || c.poster?.name || c.host?.name || 'Innova Partner',
    logoInitial: (c.company_name || c.poster?.name || c.host?.name || 'I').slice(0, 1).toUpperCase(),
    verified: Boolean(c.poster?.verified || c.host?.verified || c.company_verified),
    description: c.poster?.description || c.host?.description || 'Challenge poster',
  },
  problemStatement: c.problem_statement || c.summary || c.description || '',
  problemDetail: c.problem_detail || c.details || '',
  constraints: c.constraints || c.requirements || [],
  judgingCriteria: (c.criteria || c.judging_criteria || []).map((item) => ({
    title: item.title || item.name,
    weight: item.weight || 0,
    desc: item.desc || item.description || '',
  })),
  resources: c.resources || [],
  submissions: Number(c.submission_count || 0),
  participants: Number(c.participant_count || 0),
  difficulty: c.difficulty || 'Open',
  currentPhase: c.current_phase_label || c.current_phase || 'Open',
  timeLeft: c.time_left || (c.days_remaining ? `${c.days_remaining} days remaining` : 'TBD'),
  grandPrize: formatCurrency(c.prize_pool || c.prize || c.prize_value || 0),
  prizeType: c.prize_type || 'Prize pool',
});

export const DashboardProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [solverMetrics, setSolverMetrics] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [journalLogs, setJournalLogs] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [challengesList, setChallengesList] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [labSubmissions, setLabSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [companyMetrics, setCompanyMetrics] = useState(null);
  const [operationalLedger, setOperationalLedger] = useState([]);

  const fetchSolverDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [me, stats, submissions, recommended, reputation, activity] = await Promise.all([
        api.get('/api/users/me'),
        api.get('/api/users/me/stats'),
        api.get('/api/submissions?user_id=me&status=active'),
        api.get('/api/challenges?recommended=true&limit=3'),
        api.get('/api/users/me/reputation').catch(() => ({})),
        api.get('/api/activity?user_id=me&limit=10').catch(() => []),
      ]);

      setUserProfile({
        ...me,
        firstName: (me?.name || me?.username || 'Researcher').split(' ')[0],
        percentile: me?.percentile || 12,
      });
      setSolverMetrics({
        streak: stats?.streak || 0,
        openChallenges: stats?.active_submissions || 0,
        totalSubmissions: stats?.active_submissions || 0,
        reputationScore: stats?.reputation_score || 0,
        prizeEarnings: formatCurrency(stats?.total_earnings || 0),
      });
      setActiveChallenges((submissions?.items || submissions || []).map((row) => ({
        id: row.challenge_id,
        title: row.challenge_name || row.challenge_title || row.title,
        dept: row.phase || '',
        daysLeft: row.days_remaining || 0,
        phase: row.phase || 'ACTIVE',
        progress: row.pss_preview || 0,
      })));
      setOpportunities((recommended?.items || recommended || []).map((opp, index) => ({
        id: String(opp.id),
        title: opp.title,
        description: opp.description || opp.summary || '',
        prize: formatCurrency(opp.prize_pool || opp.prize || 0),
        tag: opp.category || 'Featured',
        image: opp.image_url || opp.image || '',
        isHero: index === 1,
        heroText: opp.hero_text || 'Curated by the platform',
        stats: `${opp.submission_count || 0} submissions`,
        displayType: index === 0 ? 'featured_main' : 'featured_sub',
      })));
      const repValues = Object.values(reputation || {});
      setRankings(repValues.length ? repValues.map((item, index) => ({
        id: index,
        name: item.name || `Contributor ${index + 1}`,
        xp: `${Number(item.score || 0).toLocaleString()} XP`,
        rank: index + 1,
        trend: 'flat',
      })) : []);
      setJournalLogs((activity?.items || activity || []).map((item, index) => ({
        id: item.id || index,
        text: item.message || item.type || 'Activity update',
        time: item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now',
        hasDot: true,
      })));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchChallenges = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(withQuery('/api/challenges', {
        status: 'active',
        page: params.page || 1,
        limit: 12,
        discipline: params.category,
        phase: params.phase,
        prize_min: params.minPrize,
      }));
      const normalized = (response?.items || response || []).map(mapChallenge);
      if (params.page && params.page > 1) {
        setChallengesList((prev) => [...prev, ...normalized]);
      } else {
        setChallengesList(normalized);
      }
    } catch (err) {
      setError(err.message || 'Failed to load challenges.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const me = await api.get('/api/users/me');
      const username = me?.username || 'me';
      const [profile, history] = await Promise.all([
        api.get(`/api/profile/${username}`),
        api.get(`/api/profile/${username}/challenge-history?page=1&limit=10`).catch(() => []),
      ]);
      setProfileData({
        name: profile.name || me.name,
        title: profile.title || 'Contributor',
        location: profile.location || 'India',
        avatarUrl: profile.avatar_url || me.avatar_url,
        badges: [],
        stats: {
          submissions: profile.submissions_count || 0,
          wins: profile.wins || 0,
          reputationPts: String(profile.reputation_score || 0),
          totalEarned: formatCurrency(profile.total_earned || 0),
        },
        submissionHistory: (history?.items || history || []).map((s) => ({
          id: s.id,
          title: s.challenge_name || s.title,
          date: `Submitted ${new Date(s.created_at || Date.now()).toLocaleDateString()}`,
          status: (s.status || 'SUBMITTED').toUpperCase(),
          statusClass: `status-${(s.status || 'submitted').toLowerCase().replace(' ', '-')}`,
          prize: s.prize ? formatCurrency(s.prize) : '',
          icon: '*',
        })),
        reputationBreakdown: Object.entries(profile.reputation || {}).map(([label, percent]) => ({ label, percent: Number(percent || 0) })),
        expertise: profile.skills || [],
        achievements: [],
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLabSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/submissions?user_id=me&status=active');
      setLabSubmissions((data?.items || data || []).map((s) => ({
        id: s.id,
        challengeId: s.challenge_id,
        title: s.title,
        category: s.category || 'GENERAL',
        status: s.status || 'Drafting',
        progress: s.progress || 0,
        deadline: s.deadline || 'TBD',
        lastEdited: new Date(s.updated_at || Date.now()).toLocaleString(),
        milestone: s.phase || s.next_step || '',
      })));
    } catch (err) {
      setError(err.message || 'Failed to load submissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.get('/api/notifications?page=1&limit=30');
      const normalized = (data?.items || data || []).map((n) => ({
        id: n.id,
        type: n.type,
        text: n.message || n.text || 'Notification',
        time: n.created_at ? new Date(n.created_at).toLocaleString() : 'Now',
        cardStyle: n.read ? 'read-card' : 'unread-card',
        dotColor: n.read ? 'gray' : 'green',
        actionLabel: n.action_label || 'Open',
        actionStyle: 'primary',
        read: Boolean(n.read),
        actionUrl: n.action_url,
      }));
      setNotifications(normalized);
      setUnreadCount(normalized.filter((n) => !n.read).length);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCompanyDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [me, stats, activeChallenges, draftChallenges, topContributors] = await Promise.all([
        api.get('/api/users/me'),
        api.get('/api/posters/me/stats'),
        api.get('/api/challenges?poster_id=me&status=active'),
        api.get('/api/challenges?poster_id=me&status=draft'),
        api.get('/api/challenges/me/top-contributors?limit=5').catch(() => []),
      ]);
      setCompanyProfile({
        name: me?.organization_name || me?.name || 'Company',
        verification: 'VERIFIED PARTNER',
        logoText: 'COMPANY',
      });
      setCompanyMetrics({
        registeredUsers: { count: '—', trend: '' },
        challenges: {
          active: stats?.active_challenges || 0,
          total: (stats?.active_challenges || 0) + ((draftChallenges?.items || draftChallenges || []).length),
          percentage: 100,
        },
        submissionVelocity: { average: stats?.avg_completion_time || 0 },
        prizePool: {
          total: formatCurrency(stats?.prize_distributed || 0),
          subtitle: 'COMMITTED CAPITAL',
        },
      });
      const ledgerSource = [...(activeChallenges?.items || activeChallenges || []), ...(draftChallenges?.items || draftChallenges || [])];
      setOperationalLedger(ledgerSource.map((c) => ({
        id: c.id,
        status: c.status === 'active' ? 'active' : c.status === 'draft' ? 'review' : 'closed',
        title: c.title,
        section: c.category || '—',
        volumeCount: c.submission_count || 0,
        volumePercent: Math.min(100, (c.submission_count || 0) * 5),
        deadline: c.days_remaining ? `${c.days_remaining} DAYS` : 'FINALIZED',
        actionType: c.status === 'active' ? 'view' : c.status === 'draft' ? 'assess' : 'archive',
      })));
      setRankings((topContributors?.items || topContributors || []).map((item, index) => ({
        id: item.id || index,
        name: item.username || item.name,
        xp: `${Number(item.reputation || 0).toLocaleString()} XP`,
        rank: index + 1,
        trend: 'flat',
      })));
    } catch (err) {
      setError(err.message || 'Failed to load company dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitIdea = useCallback(async (formData) => {
    try {
      const form = new FormData();
      if (formData.challengeId) form.append('challenge_id', formData.challengeId);
      form.append('title', formData.title);
      form.append('content', formData.concept || formData.impact || '');
      const data = await api.post('/api/submissions', form);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const saveDraft = useCallback(async (_submissionId, draftData) => {
    try {
      await api.post('/api/submissions', {
        challenge_id: draftData.challengeId,
        title: draftData.title,
        content: draftData.concept || '',
        status: 'draft',
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const applyToOpportunity = useCallback(async (opportunityId) => {
    console.log('Apply to opportunity', opportunityId);
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await api.patch('/api/notifications/read-all', {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const followChallenge = useCallback(async (challengeId) => {
    try {
      await api.post(`/api/challenges/${challengeId}/watch`, {});
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const syncLedgerFilters = useCallback(async () => {
    await fetchCompanyDashboard();
  }, [fetchCompanyDashboard]);

  const uploadAttachment = useCallback(async (_submissionId, file) => {
    return { success: true, path: file?.name || '' };
  }, []);

  useEffect(() => {
    fetchNotifications();
    const timer = window.setInterval(fetchNotifications, 60000);
    return () => window.clearInterval(timer);
  }, [fetchNotifications]);

  return (
    <DashboardContext.Provider value={{
      isLoading, error,
      userProfile, solverMetrics,
      activeChallenges, setActiveChallenges,
      opportunities, setOpportunities,
      journalLogs, rankings,
      fetchSolverDashboard,
      challengesList, setChallengesList,
      fetchChallenges,
      profileData,
      fetchProfileData,
      labSubmissions,
      fetchLabSubmissions,
      notifications, unreadCount,
      fetchNotifications,
      companyProfile, companyMetrics,
      operationalLedger, setOperationalLedger,
      fetchCompanyDashboard,
      submitIdea,
      saveDraft,
      applyToOpportunity,
      markAllNotificationsRead,
      followChallenge,
      syncLedgerFilters,
      uploadAttachment,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardInfo = () => useContext(DashboardContext);
