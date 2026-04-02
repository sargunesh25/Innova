import React from 'react';
import { Settings, ArrowRight } from 'lucide-react';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Dim Overlay */}
      <div 
        className={`notif-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Slide-out Drawer */}
      <div className={`notif-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="notif-header">
          <h2>Notifications</h2>
          <button className="mark-read-btn">MARK ALL READ</button>
        </div>

        <div className="notif-filters">
          <button className="filter-pill active">ALL</button>
          <button className="filter-pill">MENTIONS</button>
          <button className="filter-pill">PRIZES</button>
          <button className="filter-pill">PHASE</button>
        </div>

        <div className="notif-content-scroll">
          
          {/* TODAY */}
          <div className="notif-group">
            <h4 className="notif-date-header">TODAY</h4>
            
            <div className="notif-card highlight-green">
              <div className="notif-dot green-dot"></div>
              <div className="notif-card-content">
                <p><strong>Elena Vance</strong> tagged you in the <strong><em>Bio-Lattice Study</em></strong></p>
                <div className="notif-card-footer">
                  <span className="notif-time">14:22 GMT</span>
                  <button className="notif-action-btn green-action">VIEW CHALLENGE <ArrowRight size={12} /></button>
                </div>
              </div>
            </div>

            <div className="notif-card transparent-card">
              <div className="notif-dot purple-dot"></div>
              <div className="notif-card-content">
                <p>You've been awarded the <em>"Synthesis Pioneer"</em> digital badge.</p>
                <div className="notif-card-footer">
                  <span className="notif-time">09:15 GMT</span>
                </div>
              </div>
            </div>
          </div>

          {/* YESTERDAY */}
          <div className="notif-group">
            <h4 className="notif-date-header">YESTERDAY</h4>
            
            <div className="notif-card light-beige">
              <div className="notif-dot green-dot"></div>
              <div className="notif-card-content">
                <p>The <strong><em>Quantum Flora</em></strong> project has moved to <strong>Phase II: Incubation</strong>.</p>
                <div className="notif-card-footer">
                  <span className="notif-time">OCT 24 &bull; 17:40</span>
                  <button className="notif-action-btn dark-action">READ UPDATE <ArrowRight size={12} /></button>
                </div>
              </div>
            </div>

            <div className="notif-card light-beige">
              <div className="notif-dot gray-dot"></div>
              <div className="notif-card-content">
                <p>System maintenance scheduled for tonight at 02:00 GMT.</p>
                <div className="notif-card-footer">
                  <span className="notif-time">OCT 24 &bull; 12:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* EARLIER THIS WEEK */}
          <div className="notif-group">
            <h4 className="notif-date-header">EARLIER THIS WEEK</h4>
            
            <div className="notif-card light-beige">
              <div className="notif-dot gray-dot"></div>
              <div className="notif-card-content">
                <p>Laboratory access keys have been updated for Building 4.</p>
                <div className="notif-card-footer">
                  <span className="notif-time">OCT 22 &bull; 09:30</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="notif-footer">
          <div className="notif-footer-top">
            <span className="nf-brand">Innova Manuscript</span>
            <button className="nf-settings-btn" aria-label="Settings"><Settings size={20} color="#7a7974" /></button>
          </div>
          <div className="nf-links">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">ARCHIVE</a>
          </div>
        </div>

      </div>
    </>
  );
};

export default NotificationPanel;
