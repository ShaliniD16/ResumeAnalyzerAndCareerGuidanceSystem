import React from 'react';

const ResumeAnalysisIllustration = () => {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="600" fill="#f8f9fa" rx="10" ry="10"/>
      
      {/* Resume Document */}
      <g transform="translate(150, 100)">
        {/* Main paper */}
        <rect width="300" height="400" fill="white" stroke="#e0e0e0" strokeWidth="2" rx="5" ry="5"/>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="3" dy="3" stdDeviation="5" floodColor="#0002"/>
        </filter>
        <rect width="300" height="400" fill="white" stroke="#e0e0e0" strokeWidth="2" rx="5" ry="5" filter="url(#shadow)"/>
        
        {/* Resume content lines */}
        {/* Header section */}
        <rect x="40" y="30" width="220" height="10" fill="#555" rx="2" ry="2"/>
        <rect x="40" y="50" width="140" height="5" fill="#999" rx="2" ry="2"/>
        <rect x="40" y="65" width="180" height="5" fill="#999" rx="2" ry="2"/>
        
        {/* Divider */}
        <line x1="40" y1="85" x2="260" y2="85" stroke="#ddd" strokeWidth="2"/>
        
        {/* Experience section */}
        <rect x="40" y="100" width="120" height="8" fill="#666" rx="2" ry="2"/>
        <rect x="40" y="120" width="180" height="6" fill="#888" rx="2" ry="2"/>
        <rect x="40" y="135" width="160" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="60" y="150" width="180" height="4" fill="#bbb" rx="2" ry="2"/>
        <rect x="60" y="162" width="160" height="4" fill="#bbb" rx="2" ry="2"/>
        <rect x="60" y="174" width="170" height="4" fill="#bbb" rx="2" ry="2"/>
        
        <rect x="40" y="195" width="180" height="6" fill="#888" rx="2" ry="2"/>
        <rect x="40" y="210" width="150" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="60" y="225" width="170" height="4" fill="#bbb" rx="2" ry="2"/>
        <rect x="60" y="237" width="180" height="4" fill="#bbb" rx="2" ry="2"/>
        
        {/* Education section */}
        <rect x="40" y="265" width="100" height="8" fill="#666" rx="2" ry="2"/>
        <rect x="40" y="285" width="190" height="6" fill="#888" rx="2" ry="2"/>
        <rect x="40" y="300" width="140" height="5" fill="#aaa" rx="2" ry="2"/>
        
        {/* Skills section */}
        <rect x="40" y="325" width="80" height="8" fill="#666" rx="2" ry="2"/>
        <rect x="40" y="345" width="60" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="110" y="345" width="60" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="180" y="345" width="60" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="40" y="360" width="60" height="5" fill="#aaa" rx="2" ry="2"/>
        <rect x="110" y="360" width="60" height="5" fill="#aaa" rx="2" ry="2"/>
      </g>
      
      {/* Analysis Elements */}
      {/* Magnifying glass */}
      <g transform="translate(500, 200)">
        <circle cx="0" cy="0" r="70" fill="none" stroke="#3498db" strokeWidth="10"/>
        <line x1="50" y1="50" x2="100" y2="100" stroke="#3498db" strokeWidth="15" strokeLinecap="round"/>
        
        {/* Keywords highlighting from resume to glass */}
        <g opacity="0.8">
          <path d="M-100,0 C-150,-50 -250,-70 -300,-20" stroke="#e74c3c" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="3s" repeatCount="indefinite"/>
          </path>
          <circle cx="-300" cy="-20" r="8" fill="#e74c3c"/>
          
          <path d="M-50,-50 C-100,-100 -200,-180 -250,-160" stroke="#2ecc71" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="2.5s" repeatCount="indefinite"/>
          </path>
          <circle cx="-250" cy="-160" r="8" fill="#2ecc71"/>
          
          <path d="M-70,50 C-120,70 -220,200 -270,240" stroke="#f39c12" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animate attributeName="strokeDashoffset" from="10" to="0" dur="2.7s" repeatCount="indefinite"/>
          </path>
          <circle cx="-270" cy="240" r="8" fill="#f39c12"/>
        </g>
      </g>
      
      {/* Data Analysis Elements */}
      <g transform="translate(590, 300)">
        {/* Bar Chart */}
        <rect x="0" y="0" width="160" height="120" fill="white" rx="5" ry="5" stroke="#ddd" strokeWidth="2"/>
        <rect x="20" y="20" width="20" height="80" fill="#3498db" rx="2" ry="2"/>
        <rect x="50" y="40" width="20" height="60" fill="#2ecc71" rx="2" ry="2"/>
        <rect x="80" y="30" width="20" height="70" fill="#e74c3c" rx="2" ry="2"/>
        <rect x="110" y="60" width="20" height="40" fill="#f39c12" rx="2" ry="2"/>
      </g>
      
      {/* AI/Matching Elements */}
      <g transform="translate(530, 450)">
        {/* Circular nodes with connections */}
        <circle cx="0" cy="0" r="15" fill="#9b59b6"/>
        <circle cx="40" cy="-30" r="10" fill="#3498db"/>
        <circle cx="60" cy="10" r="12" fill="#2ecc71"/>
        <circle cx="30" cy="40" r="8" fill="#e74c3c"/>
        <circle cx="-30" cy="30" r="11" fill="#f39c12"/>
        <circle cx="-40" cy="-20" r="9" fill="#1abc9c"/>
        
        {/* Connections */}
        <line x1="0" y1="0" x2="40" y2="-30" stroke="#ddd" strokeWidth="2"/>
        <line x1="0" y1="0" x2="60" y2="10" stroke="#ddd" strokeWidth="2"/>
        <line x1="0" y1="0" x2="30" y2="40" stroke="#ddd" strokeWidth="2"/>
        <line x1="0" y1="0" x2="-30" y2="30" stroke="#ddd" strokeWidth="2"/>
        <line x1="0" y1="0" x2="-40" y2="-20" stroke="#ddd" strokeWidth="2"/>
        
        {/* Pulse animation for AI processing */}
        <circle cx="0" cy="0" r="20" fill="none" stroke="#9b59b6" strokeWidth="2">
          <animate attributeName="r" values="15;45;15" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Job Match */}
      <g transform="translate(350, 480)">
        {/* Job description document */}
        <rect width="120" height="80" fill="white" stroke="#e0e0e0" strokeWidth="2" rx="3" ry="3"/>
        <rect x="15" y="15" width="90" height="5" fill="#666" rx="1" ry="1"/>
        <rect x="15" y="25" width="70" height="4" fill="#999" rx="1" ry="1"/>
        <rect x="15" y="35" width="80" height="4" fill="#999" rx="1" ry="1"/>
        <rect x="15" y="45" width="90" height="4" fill="#999" rx="1" ry="1"/>
        <rect x="15" y="55" width="60" height="4" fill="#999" rx="1" ry="1"/>
        
        {/* Connection line to AI nodes */}
        <path d="M120,40 C160,40 160,450 180,450" stroke="#3498db" strokeWidth="3" fill="none" strokeDasharray="10,5">
          <animate attributeName="strokeDashoffset" from="15" to="0" dur="3s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Title */}
      <text x="400" y="60" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="bold" textAnchor="middle" fill="#2c3e50">Resume Analysis</text>
      
      {/* Skill Match Percentage */}
      <g transform="translate(465, 150)">
        <circle cx="0" cy="0" r="35" fill="none" stroke="#2ecc71" strokeWidth="8"/>
        <path d="M0,-35 A35,35 0 1,1 -35,0" fill="none" stroke="#ddd" strokeWidth="8"/>
        <text x="0" y="7" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#2c3e50">75%</text>
        <text x="0" y="50" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" fill="#7f8c8d">Match</text>
      </g>
    </svg>
  );
};

export default ResumeAnalysisIllustration;