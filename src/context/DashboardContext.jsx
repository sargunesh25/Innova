import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Overarching Loading and Error states for Async API calls
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Solver / User States ---
  const [userProfile, setUserProfile] = useState(null);
  const [solverMetrics, setSolverMetrics] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [journalLogs, setJournalLogs] = useState([]);
  const [rankings, setRankings] = useState([]);

  // --- Challenges Browse & Details States ---
  const [challengesList, setChallengesList] = useState([]);

  // --- Profile States ---
  const [profileData, setProfileData] = useState(null);

  // --- Laboratory States ---
  const [labSubmissions, setLabSubmissions] = useState([]);

  // --- Notifications States ---
  const [notifications, setNotifications] = useState([]);

  // --- Company / Enterprise States ---
  const [companyProfile, setCompanyProfile] = useState(null);
  const [companyMetrics, setCompanyMetrics] = useState(null);
  const [operationalLedger, setOperationalLedger] = useState([]);

  // 1. Initial Data Fetch (Simulating backend load)
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network request delay (e.g. 800ms)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock Real Responses: User Info
      setUserProfile({
        name: 'Arjun',
        firstName: 'Arjun',
        role: 'SENIOR RESEARCHER',
        percentile: 5
      });

      setSolverMetrics({
        totalSubmissions: 14,
        ideasUpvoted: 128,
        prizeEarnings: '₹4,250.00',
        reputationScore: 892,
        streak: 12,
        openChallenges: 24,
      });

      setActiveChallenges([
        {
          id: 1,
          title: 'Sustainable Urban Mobility Phase II',
          dept: 'Smart Infrastructure Department',
          daysLeft: 2,
          progress: 75,
          phase: 'RESEARCH PHASE'
        },
        {
          id: 2,
          title: 'AI Ethics Framework for Public Health',
          dept: 'Global Ethics Laboratory',
          daysLeft: 14,
          progress: 32,
          phase: 'IDEATION PHASE'
        }
      ]);

      setOpportunities([
        {
          id: 'feat-1',
          title: 'Quantum Encryption Protocols for 2030',
          description: 'Propose a hardware-level encryption standard for the next generation of secure communication. Submissions require technical whitepapers.',
          prize: '₹15,000',
          tag: 'HIGH STAKES',
          image: '/quantum.png'
        },
        {
          id: 'sub-1',
          title: 'Carbon Capture in Arid Climates',
          prize: '₹8,200',
          tag: 'ECO FOCUS',
          stats: '125 RESEARCHERS',
          image: '/forest.png'
        },
        {
          id: 'sub-2',
          title: 'Synthetic Protein Synthesis',
          prize: '₹12,400',
          tag: 'LABORATORY',
          stats: '45 RESEARCHERS',
          isHero: true,
          heroText: 'New Research: The Future<br />of Biotech'
        }
      ]);

      setJournalLogs([
        { id: 1, text: 'Elena Vance upvoted your idea in Urban Mobility.', time: '2 HOURS AGO', hasDot: true },
        { id: 2, text: 'Your submission reached the Semi-Finals round in Ethics.', time: '5 HOURS AGO', hasDot: false },
        { id: 3, text: 'Dr. Aris left a detailed note on your paper.', time: 'YESTERDAY', hasDot: false },
      ]);

      setRankings([
        { id: 1, name: 'Sarah Jenkins', xp: '1,240 XP', rank: 1, trend: 'up' },
        { id: 2, name: 'Marcus Chen', xp: '1,150 XP', rank: 2, trend: 'flat' },
        { id: 3, name: 'Arjun (You)', xp: '892 XP', rank: 12, trend: 'highlight', badge: 'TOP 5%' },
      ]);

      // --- Challenges Browse Data ---
      setChallengesList([
        {
          id: 1,
          title: 'Quantum-Safe Encryption Protocols for IoT',
          description: "Develop a lightweight cryptographic module capable of resisting Shor's algorithm while maintaining low-latency execution on ARM-based hardware.",
          category: 'Engineering',
          subcategory: 'Software Architecture',
          timeLabel: '12d Left',
          daysLeft: 12,
          timeColor: 'green',
          prize: '₹50,000',
          prizeValue: 50000,
          phase: 'Accepting Submissions',
          status: 'Open',
          createdAt: new Date('2026-03-20'),
          host: { name: 'Synthetix Labs', logoInitial: 'S', verified: true },
          problemStatement: 'Current routing algorithms optimize for the shortest path or the fastest time, often ignoring the energy-load variations caused by traffic density and vehicle weight changes.',
          problemDetail: 'We are seeking a novel approach that treats carbon-cost as a primary variable in the optimization function, rather than an afterthought.',
          constraints: [
            'Must be compatible with Python 3.10+ and PyTorch frameworks.',
            'API latency for re-routing must not exceed 200ms.',
            'Algorithm must handle at least 50 concurrent vehicle nodes.'
          ],
          judgingCriteria: [
            { title: 'Carbon Efficiency', weight: 40, desc: 'Measured reduction in Watt-hours per kilometer compared to the baseline OSRM engine.' },
            { title: 'Algorithm Scalability', weight: 30, desc: 'The ability to maintain performance as node density increases exponentially.' }
          ],
          resources: [
            { name: '📄 Technical Dataset v1.2 (.csv)', url: '#' },
            { name: '📁 Baseline Model weights (.pt)', url: '#' }
          ],
          submissions: 42,
          participants: 128,
          difficulty: 'Expert',
          currentPhase: 'Sealed',
          timeLeft: 'Ends in 14 days',
          grandPrize: '₹12,500',
          prizeType: 'IN USDC + GRANTS'
        },
        {
          id: 2,
          title: 'Adaptive Accessibility for VR Interfaces',
          description: 'Reimagining spatial computing interactions for users with limited motor function. Focus on gaze-to-action mapping and haptic feedback loops.',
          category: 'Design',
          subcategory: 'Digital Product',
          timeLabel: 'Ends Today',
          daysLeft: 0,
          timeColor: 'yellow',
          prize: '₹25,000',
          prizeValue: 25000,
          phase: 'Evaluation in Progress',
          status: 'Sealed',
          createdAt: new Date('2026-03-25'),
          host: { name: 'AccessTech Corp', logoInitial: 'A', verified: true },
          problemStatement: 'VR interfaces lack accessibility for users with motor impairments.',
          problemDetail: 'We need solutions that map eye-tracking and subtle gestures to full interaction paradigms.',
          constraints: [
            'Must work with existing Meta Quest and Apple Vision Pro hardware.',
            'Interaction latency must be under 50ms.',
            'Must handle at least 20 simultaneous gesture inputs.'
          ],
          judgingCriteria: [
            { title: 'Usability Score', weight: 50, desc: 'Validated through user testing with participants of varying motor abilities.' },
            { title: 'Technical Innovation', weight: 30, desc: 'Novelty of the approach compared to existing accessibility solutions.' }
          ],
          resources: [
            { name: '📄 Accessibility Standards Reference (.pdf)', url: '#' }
          ],
          submissions: 28,
          participants: 64,
          difficulty: 'Intermediate',
          currentPhase: 'Evaluation',
          timeLeft: 'Ends today',
          grandPrize: '₹25,000',
          prizeType: 'IN USDC + GRANTS'
        },
        {
          id: 3,
          title: 'Sustainable Micro-Grid Economic Models',
          description: 'A longitudinal study and simulation of peer-to-peer energy trading in rural communities with intermittent solar availability.',
          category: 'Research',
          subcategory: 'Sustainable Energy',
          timeLabel: '45d Left',
          daysLeft: 45,
          timeColor: 'purple',
          prize: '₹120,000',
          prizeValue: 120000,
          phase: 'Accepting Submissions',
          status: 'Open',
          createdAt: new Date('2026-03-10'),
          host: { name: 'GreenWave Foundation', logoInitial: 'G', verified: false },
          problemStatement: 'Rural communities lack economic models for sustainable peer-to-peer energy sharing.',
          problemDetail: 'We need simulation-backed models that account for intermittent solar availability and varying demand patterns.',
          constraints: [
            'Models must simulate at least 1000 households.',
            'Must account for seasonal solar variation.',
            'Economic parameters must be validated against real-world data.'
          ],
          judgingCriteria: [
            { title: 'Model Accuracy', weight: 45, desc: 'How closely the simulation matches real-world energy trading patterns.' },
            { title: 'Scalability', weight: 25, desc: 'Ability to extend the model from village to district level.' }
          ],
          resources: [
            { name: '📄 Solar Irradiance Dataset (.csv)', url: '#' },
            { name: '📁 Economic Baseline Model (.py)', url: '#' }
          ],
          submissions: 15,
          participants: 42,
          difficulty: 'Advanced',
          currentPhase: 'Open',
          timeLeft: '45 days left',
          grandPrize: '₹120,000',
          prizeType: 'IN GRANTS'
        },
        {
          id: 4,
          title: 'Edge-AI Noise Cancellation for Rail Systems',
          description: 'Optimizing neural networks for sub-10ms processing on low-power DSPs to isolate voice from heavy machinery acoustics.',
          category: 'Engineering',
          subcategory: 'Industrial Design',
          timeLabel: '8d Left',
          daysLeft: 8,
          timeColor: 'green',
          prize: '₹42,500',
          prizeValue: 42500,
          phase: 'Completed & Awarded',
          status: 'Sealed',
          createdAt: new Date('2026-03-28'),
          host: { name: 'RailTech India', logoInitial: 'R', verified: true },
          problemStatement: 'Industrial rail environments have extreme noise that makes voice communication nearly impossible.',
          problemDetail: 'We need edge-AI solutions that can run on low-power DSPs to filter machinery noise in real time.',
          constraints: [
            'Must run on ARM Cortex-M7 or equivalent.',
            'Processing latency must not exceed 10ms.',
            'Must work without cloud connectivity.'
          ],
          judgingCriteria: [
            { title: 'Noise Reduction Quality', weight: 50, desc: 'Signal-to-noise ratio improvement measured in controlled rail environment.' },
            { title: 'Power Efficiency', weight: 30, desc: 'Power consumption on target DSP hardware.' }
          ],
          resources: [
            { name: '📄 Rail Noise Samples (.wav)', url: '#' }
          ],
          submissions: 67,
          participants: 89,
          difficulty: 'Expert',
          currentPhase: 'Completed',
          timeLeft: 'Completed',
          grandPrize: '₹42,500',
          prizeType: 'IN USDC'
        }
      ]);

      // --- Profile Data ---
      setProfileData({
        name: 'Julian Deering',
        title: 'Lead Architect',
        location: 'London, UK',
        avatarUrl: '/julian_avatar.png',
        badges: [
          { label: 'ELITE CONTRIBUTOR', type: 'elite' },
          { label: 'TOP 1% MENTOR', type: 'mentor' }
        ],
        stats: { submissions: 124, wins: 18, reputationPts: '8,420', totalEarned: '₹42.5k' },
        submissionHistory: [
          { id: 1, title: 'Quantum Computing Architecture for Logistics', date: 'Submitted Mar 12, 2024', status: 'WON', statusClass: 'status-won', prize: '₹12,000', icon: '✴' },
          { id: 2, title: 'Sustainable Water Purification in Arid Regions', date: 'Submitted Feb 28, 2024', status: 'UNDER REVIEW', statusClass: 'status-review', prize: '₹8,500', icon: '🌿' },
          { id: 3, title: 'Neural Interface for Edge Processing', date: 'Submitted Jan 15, 2024', status: 'FINALIST', statusClass: 'status-finalist', prize: '₹22,000', icon: '⚙' }
        ],
        reputationBreakdown: [
          { label: 'Innovation Design', percent: 85 },
          { label: 'Technical Rigor', percent: 92 },
          { label: 'Peer Mentorship', percent: 64 }
        ],
        expertise: ['Systems Architecture', 'Biotech', 'AI Ethics', 'Urban Planning', 'Product Strategy'],
        achievements: [
          { icon: 'Award', unlocked: true },
          { icon: 'Search', unlocked: true },
          { icon: 'DollarSign', unlocked: true },
          { icon: 'Users', unlocked: true },
          { icon: 'Rocket', unlocked: true },
          { icon: 'GraduationCap', unlocked: true },
          { icon: 'Lock', unlocked: false },
          { icon: 'Lock', unlocked: false }
        ]
      });

      // --- Laboratory Submissions ---
      setLabSubmissions([
        { id: 1, title: 'Quantum-Safe Encryption Protocols', category: 'ENGINEERING', status: 'Drafting', progress: 30, deadline: '12 Days Left', lastEdited: '2 hours ago', milestone: 'Write Abstract' },
        { id: 2, title: 'Sustainable Micro-Grid Economic Models', category: 'RESEARCH', status: 'Submitted', progress: 100, deadline: 'Evaluation Phase', lastEdited: '3 days ago', milestone: 'Awaiting Results' },
        { id: 3, title: 'Adaptive Accessibility for VR Interfaces', category: 'DESIGN', status: 'Under Evaluation', progress: 100, deadline: 'Judging', lastEdited: '1 week ago', milestone: 'Semi-Finalist' }
      ]);

      // --- Notifications ---
      setNotifications([
        { id: 1, type: 'mention', text: '<strong>Elena Vance</strong> tagged you in the <strong><em>Bio-Lattice Study</em></strong>', time: '14:22 GMT \u2022 OCT 25', cardStyle: 'highlight-green', dotColor: 'green-dot', actionLabel: 'VIEW CHALLENGE', actionStyle: 'green-action', read: false },
        { id: 2, type: 'prize', text: 'You\'ve been awarded the <em>"Synthesis Pioneer"</em> digital badge.', time: '09:15 GMT \u2022 OCT 25', cardStyle: 'transparent-card', dotColor: 'purple-dot', actionLabel: null, read: false },
        { id: 3, type: 'phase', text: 'The <strong><em>Quantum Flora</em></strong> project has moved to <strong>Phase II: Incubation</strong>.', time: '17:40 GMT \u2022 OCT 24', cardStyle: 'light-beige', dotColor: 'green-dot', actionLabel: 'READ UPDATE', actionStyle: 'dark-action', read: false },
        { id: 4, type: 'system', text: 'System maintenance scheduled for tonight at 02:00 GMT.', time: '12:00 GMT \u2022 OCT 24', cardStyle: 'light-beige', dotColor: 'gray-dot', actionLabel: null, read: true },
        { id: 5, type: 'system', text: 'Laboratory access keys have been updated for Building 4.', time: '09:30 GMT \u2022 OCT 22', cardStyle: 'light-beige', dotColor: 'gray-dot', actionLabel: null, read: true }
      ]);

      // Mock Real Responses: Company Engine
      setCompanyProfile({
        name: 'Synthetix Labs',
        verification: 'VERIFIED PARTNER',
        logoText: 'COMPANY'
      });

      setCompanyMetrics({
        registeredUsers: { count: '1,284', trend: '+12%' },
        challenges: { active: 12, total: 42, percentage: 28 },
        submissionVelocity: { average: 84.2 },
        prizePool: { total: '$2.4M', subtitle: 'COMMITTED CAPITAL FY24' }
      });

      setOperationalLedger([
        {
          id: 1,
          status: 'active',
          title: 'Neural Pathway Mapping v.2',
          section: 'BIO-TECHNICAL ENG.',
          volumeCount: 124,
          volumePercent: 80,
          deadline: '24.OCT.24',
          actionType: 'view'
        },
        {
          id: 2,
          status: 'review',
          title: 'Sub-Surface Mineral Scanners',
          section: 'RESOURCE MANAGEMENT',
          volumeCount: 48,
          volumePercent: 40,
          isWarning: true,
          deadline: '12.SEP.24',
          actionType: 'assess'
        },
        {
          id: 3,
          status: 'closed',
          title: 'Quantum Cryptography Standards',
          section: 'INFO SECURITY',
          volumeCount: 312,
          deadline: 'FINALIZED',
          actionType: 'archive'
        }
      ]);

    } catch (err) {
      console.error("Failed to fetch dashboard data proxy", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 2. Action method templates (Ready to be wired to POST requests)
  const applyToOpportunity = async (opportunityId) => {
    try {
      // await axios.post(`/api/opportunities/${opportunityId}/apply`);
      console.log(`Applied to opportunity ID: ${opportunityId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const submitIdea = async (formData) => {
    try {
      // await axios.post('/api/submissions', formData);
      console.log('Submitting idea:', formData);
      // Optimistically add to labSubmissions
      const newSubmission = {
        id: labSubmissions.length + 1,
        title: formData.title,
        category: 'ENGINEERING',
        status: 'Drafting',
        progress: 10,
        deadline: 'TBD',
        lastEdited: 'Just now',
        milestone: 'Review Draft'
      };
      setLabSubmissions(prev => [newSubmission, ...prev]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const syncLedgerFilters = async (filters) => {
    console.log(`Fetching ledger with filters:`, filters);
  };


  return (
    <DashboardContext.Provider value={{
      isLoading,
      error,
      refreshData: fetchDashboardData,
      applyToOpportunity,
      submitIdea,
      markAllNotificationsRead,
      syncLedgerFilters,

      userProfile,
      solverMetrics,
      activeChallenges, setActiveChallenges,
      opportunities, setOpportunities,
      journalLogs,
      rankings,

      challengesList,
      profileData,
      labSubmissions,
      notifications,

      companyProfile,
      companyMetrics,
      operationalLedger, setOperationalLedger
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardInfo = () => useContext(DashboardContext);
