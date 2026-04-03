import React, { useState, useCallback } from 'react';
import { UploadCloud, Plus, UserPlus, RotateCcw, ArrowRight } from 'lucide-react';
import { useDashboardInfo } from '../context/DashboardContext';
import './SubmitIdea.css';

const SubmitIdea = () => {
  const { submitIdea } = useDashboardInfo();

  const [formData, setFormData] = useState({
    title: '',
    concept: '',
    impact: '',
    feasibility: ''
  });
  const [skills, setSkills] = useState(['Systems Design', 'Neural Arch']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.concept.trim()) return;
    setIsSubmitting(true);
    try {
      await submitIdea({ ...formData, skills });
      alert('Idea submitted successfully!');
      setFormData({ title: '', concept: '', impact: '', feasibility: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    setLastSaved(new Date());
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
            QUANTUM SYNTHESIS CHALLENGE
          </div>
          <div className="pill-phase">PHASE 02: IDEATION</div>
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
            <div className="upload-box">
              <div className="upload-icon-wrapper">
                <UploadCloud size={24} className="upload-icon" />
              </div>
              <p><strong>Click to upload</strong> or drag and drop files</p>
            </div>
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
                <button type="button" className="add-btn"><UserPlus size={14} /></button>
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
