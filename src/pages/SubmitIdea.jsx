import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UploadCloud, Plus, UserPlus, RotateCcw, ArrowRight } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import { api } from '../lib/api';
import './SubmitIdea.css';

const SubmitIdea = () => {
  const { submitIdea, saveDraft, uploadAttachment } = useDashboardInfo();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [challenge, setChallenge] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    concept: '',
    impact: '',
    feasibility: ''
  });
  const [skills, setSkills] = useState(['Systems Design', 'Neural Arch']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  useEffect(() => {
    if (!challengeId) return;
    api.get(`/api/challenges/${challengeId}`).then(setChallenge).catch(() => setChallenge(null));
  }, [challengeId]);

  const handleChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setLastSaved(new Date());
  }, []);

  const handleAddSkill = () => {
    const skill = prompt('Enter skill name:');
    if (skill && skill.trim()) {
      setSkills(prev => [...prev, skill.trim()]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setLastSaved(new Date());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.concept.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await submitIdea({ ...formData, skills, challengeId });
      if (result.success) {
        if (attachments.length > 0 && result.data?.id) {
          await Promise.all(
            attachments.map(file => uploadAttachment(result.data.id, file))
          );
        }
        alert('Idea submitted successfully!');
        setFormData({ title: '', concept: '', impact: '', feasibility: '' });
        setAttachments([]);
      } else {
        alert(result.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const result = await saveDraft(null, { ...formData, skills, challengeId });
    if (result.success) {
      setLastSaved(new Date());
    }
  };

  const formatTime = (d) => {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')} GMT`;
  };

  return (
    <div className="submit-page container">
      <div className="submit-wrapper">
        <div className="submit-pills">
          <div className="pill-challenge">
            <span className="pill-square-icon">A</span>
            {challenge?.title || 'QUANTUM SYNTHESIS CHALLENGE'}
          </div>
          <div className="pill-phase">
            {challenge?.current_phase ? `PHASE ${challenge.current_phase}: IDEATION` : 'PHASE 02: IDEATION'}
          </div>
        </div>

        <h1 className="submit-title">Submit your idea</h1>
        <p className="submit-desc">
          Contribute your perspective to the collective archive. Every manuscript<br/>
          begins with a single, clear hypothesis.
        </p>

        <form className="submit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">IDEA TITLE</label>
            <p className="form-sublabel">Give your concept a distinctive, academic name.</p>
            <input type="text" className="form-input" placeholder="e.g., The Kinetic Lattice Paradigm" value={formData.title} onChange={handleChange('title')} />
          </div>

          <div className="form-group">
            <label className="form-label">YOUR CONCEPT</label>
            <p className="form-sublabel">Elaborate on the core thesis and mechanics of your vision.</p>
            <textarea className="form-textarea large" placeholder="Describe the fundamental breakthrough..." value={formData.concept} onChange={handleChange('concept')}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">IMPACT ASSESSMENT</label>
            <p className="form-sublabel">How does this directly address the challenge parameters?</p>
            <input type="text" className="form-input" placeholder="Identify the specific problem-solution bridge" value={formData.impact} onChange={handleChange('impact')} />
          </div>

          <div className="form-group">
            <label className="form-label">FEASIBILITY</label>
            <p className="form-sublabel">Outline the technical or operational requirements for execution.</p>
            <textarea className="form-textarea medium" placeholder="Resource requirements, technical constraints, timeline estimates..." value={formData.feasibility} onChange={handleChange('feasibility')}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">MANUSCRIPT ATTACHMENTS</label>
            <p className="form-sublabel">Upload blueprints, diagrams, or supporting documentation (PDF, JPG, PNG).</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="upload-box" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
              <div className="upload-icon-wrapper">
                <UploadCloud size={24} className="upload-icon" />
              </div>
              <p><strong>Click to upload</strong> or drag and drop files</p>
            </div>
            {attachments.length > 0 && (
              <ul style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {attachments.map((f, i) => <li key={i}>- {f.name}</li>)}
              </ul>
            )}
          </div>

          <div className="skills-team-section">
            <div className="skills-col">
              <label className="form-label">SKILLS UTILIZED</label>
              <div className="skills-pills">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-pill">{skill}</span>
                ))}
                <button type="button" className="add-btn" onClick={handleAddSkill}><Plus size={14} /></button>
              </div>
            </div>
            
            <div className="team-col">
              <label className="form-label">TEAM MEMBERS</label>
              <div className="team-avatars">
                <div className="avatar-circle img-1"></div>
                <div className="avatar-circle img-2"></div>
                <button type="button" className="add-btn" title="Contributor search can be connected here next"><UserPlus size={14} /></button>
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="submit-actions">
            <div className="auto-save-status">
              <RotateCcw size={14} /> AUTO-SAVED AT {formatTime(lastSaved)}
            </div>
            <div className="action-buttons">
              <button type="button" className="save-draft-btn" onClick={handleSaveDraft}>Save draft</button>
              <button type="submit" className="primary-btn submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit idea'} {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitIdea;
