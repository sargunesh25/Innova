import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ChevronDown as ChevronIcon, Globe as GlobeIcon, Lock as LockIcon, Loader2 } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './Challenges.css';

const Challenges = () => {
  const { challengesList, isLoading } = useDashboardInfo();

  // Main filter states (instant apply)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPill, setSelectedPill] = useState('All Items');
  const [sortBy, setSortBy] = useState('Latest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Sidebar filter states (buffered before 'Apply filters')
  const [minPrize, setMinPrize] = useState(2000);
  const [selectedPhase, setSelectedPhase] = useState('Accepting Submissions');
  const [sidebarCats, setSidebarCats] = useState(['Industrial Design', 'Software Architecture', 'Digital Product']);

  // Applied Sidebar States
  const [appliedMinPrize, setAppliedMinPrize] = useState(2000);
  const [appliedPhase, setAppliedPhase] = useState('Accepting Submissions');
  const [appliedSidebarCats, setAppliedSidebarCats] = useState(['Industrial Design', 'Software Architecture', 'Digital Product']);

  const filteredChallenges = useMemo(() => {
    let result = challengesList.filter(challenge => {
      if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) && !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedPill !== 'All Items' && challenge.category !== selectedPill) {
        return false;
      }
      if (challenge.prizeValue < appliedMinPrize) {
        return false;
      }
      if (appliedPhase && challenge.phase !== appliedPhase) {
        return false;
      }
      if (appliedSidebarCats.length > 0 && !appliedSidebarCats.includes(challenge.subcategory)) {
        return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'Latest') return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === 'Closing Soon') return a.daysLeft - b.daysLeft;
      if (sortBy === 'Prize: High to Low') return b.prizeValue - a.prizeValue;
      if (sortBy === 'Prize: Low to High') return a.prizeValue - b.prizeValue;
      return 0;
    });
  }, [challengesList, searchQuery, selectedPill, appliedMinPrize, appliedPhase, appliedSidebarCats, sortBy]);

  const toggleSidebarCat = (cat) => {
    if (sidebarCats.includes(cat)) {
      setSidebarCats(sidebarCats.filter(c => c !== cat));
    } else {
      setSidebarCats([...sidebarCats, cat]);
    }
  };

  const handleApplyFilters = () => {
    setAppliedMinPrize(minPrize);
    setAppliedPhase(selectedPhase);
    setAppliedSidebarCats(sidebarCats);
  };

  if (isLoading) {
    return (
      <div className="challenges-page container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--brand-green)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>LOADING CHALLENGES...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="challenges-page container">
      <div className="challenges-header">
        <h1 className="page-title">Browse open challenges</h1>
        <p className="page-subtitle">
          Collaborate on the world's most pressing technical and design puzzles. Curated for<br />
          precision, built for impact.
        </p>
      </div>

      <div className="challenges-toolbar">
        <div className="toolbar-left">
          <div className="search-bar">
            <SearchIcon size={16} className="search-icon" />
            <input type="text" placeholder="Search challenges, domains, or skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="category-pills">
            {['All Items', 'Design', 'Engineering', 'Research'].map(pill => (
              <button key={pill} className={`pill ${selectedPill === pill ? 'active' : ''}`} onClick={() => setSelectedPill(pill)}>
                {pill}
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-right" style={{ position: 'relative' }}>
          <span className="sort-label" style={{ whiteSpace: 'nowrap' }}>SORTED BY</span>
          <button className="sort-btn" onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
            {sortBy} <ChevronIcon size={14} style={{ transform: isSortDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'all 0.2s', marginLeft: '0.4rem' }}/>
          </button>
          
          {isSortDropdownOpen && (
            <div className="sort-dropdown" style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--bg-white)', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: '8px', zIndex: 10, marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '180px' }}>
              {['Latest', 'Closing Soon', 'Prize: High to Low', 'Prize: Low to High'].map(opt => (
                <div key={opt} 
                  onClick={() => { setSortBy(opt); setIsSortDropdownOpen(false); }}
                  style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem', borderRadius: '4px', background: sortBy === opt ? '#f0f0f0' : 'transparent', fontWeight: sortBy === opt ? '600' : '400', color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => { if(sortBy !== opt) e.target.style.background = '#f9f9f9'; }}
                  onMouseLeave={(e) => e.target.style.background = sortBy === opt ? '#f0f0f0' : 'transparent'}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="challenges-content">
        <div className="challenges-main">
          <div className={`challenges-grid ${filteredChallenges.length === 0 ? 'empty' : ''}`}>
            {filteredChallenges.length > 0 ? filteredChallenges.map((challenge) => (
              <Link to={`/challenge/${challenge.id}`} key={challenge.id} className="challenge-card-link">
                <div className="challenge-card">
                  <div className="card-top">
                    <div className="card-logo-placeholder"></div>
                    <div className="card-tags">
                      <span className="tag-category">{challenge.category}</span>
                      <span className={`tag-time ${challenge.timeColor}`}>{challenge.timeLabel}</span>
                    </div>
                  </div>
                  <h3 className="card-title">{challenge.title}</h3>
                  <p className="card-description">{challenge.description}</p>

                  <div className="card-footer">
                    <div className="card-prize">
                      <span className="prize-amount">{challenge.prize}</span>
                      <span className="prize-label">PRIZE POOL</span>
                    </div>
                    <div className="card-status">
                      {challenge.status === 'Open' ? (
                        <><GlobeIcon size={16} className="status-icon globe" /> Open</>
                      ) : (
                        <><LockIcon size={16} className="status-icon lock" /> Sealed</>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="no-challenges-message">
                <p>No challenges match your exact filter criteria.</p>
                <button className="primary-btn clear-btn" onClick={() => { setSearchQuery(''); setSelectedPill('All Items'); }}>Clear Filters</button>
              </div>
            )}
          </div>
          {filteredChallenges.length > 0 && (
            <div className="load-more-container">
              <button className="outline-btn load-more-btn">Load more challenges</button>
            </div>
          )}
        </div>

        <aside className="challenges-sidebar">
          <h2 className="sidebar-title">Filters</h2>

          <div className="filter-group">
            <h3 className="filter-group-title">CATEGORY</h3>
            {[ 'Industrial Design', 'Software Architecture', 'Digital Product', 'Sustainable Energy' ].map(cat => (
              <label className="filter-checkbox" key={cat}>
                <input type="checkbox" checked={sidebarCats.includes(cat)} onChange={() => toggleSidebarCat(cat)} />
                <span className="checkbox-custom"></span>
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">MIN. PRIZE AMOUNT</h3>
            <input
              type="range"
              min="0"
              max="150000"
              step="1000"
              value={minPrize}
              onChange={(e) => setMinPrize(Number(e.target.value))}
              style={{ width: '100%', margin: '1rem 0', accentColor: 'var(--brand-green)' }}
            />
            <div className="slider-value">₹{minPrize.toLocaleString()}</div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">PHASE</h3>
            <div className="phase-pills">
              <button 
                className={`phase-pill ${selectedPhase === 'Accepting Submissions' ? 'active' : ''}`}
                onClick={() => setSelectedPhase('Accepting Submissions')}
              >Accepting Submissions</button>
              <button 
                className={`phase-pill ${selectedPhase === 'Evaluation in Progress' ? 'active' : ''}`}
                onClick={() => setSelectedPhase('Evaluation in Progress')}
              >Evaluation in Progress</button>
              <button 
                className={`phase-pill ${selectedPhase === 'Completed & Awarded' ? 'active' : ''}`}
                onClick={() => setSelectedPhase('Completed & Awarded')}
              >Completed & Awarded</button>
            </div>
          </div>

          <button className="primary-btn apply-btn" onClick={handleApplyFilters}>Apply filters</button>
        </aside>
      </div>
    </div>
  );
};

export default Challenges;
