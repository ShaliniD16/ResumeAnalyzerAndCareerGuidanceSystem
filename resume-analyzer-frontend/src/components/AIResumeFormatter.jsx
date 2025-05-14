import { useState, useRef, useEffect } from 'react';
import './../styles/AIResumeFormatter.css';

export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      address: '',
      summary: ''
    },
    experience: [
      { id: 1, company: '', position: '', startDate: '', endDate: '', description: '' }
    ],
    education: [
      { id: 1, institution: '', degree: '', field: '', graduationDate: '', gpa: '' }
    ],
    skills: {
      skillsList: ''
    }
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [html2pdfLoaded, setHtml2pdfLoaded] = useState(false);
  const resumeRef = useRef(null);
  
  // Load html2pdf.js from CDN
  useEffect(() => {
    const loadHtml2pdf = async () => {
      try {
        // Check if script already exists
        if (!document.querySelector('script[src*="html2pdf.bundle.min.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.async = true;
          script.onload = () => setHtml2pdfLoaded(true);
          document.body.appendChild(script);
        } else {
          setHtml2pdfLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load html2pdf:', error);
      }
    };
    
    loadHtml2pdf();
  }, []);
  
  // Function to load saved resume data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading saved resume data:', e);
      }
    }
  }, []);
  
  // Function to save form data to local storage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(formData));
      alert('Resume data saved to local storage');
    } catch (e) {
      console.error('Error saving resume data:', e);
      alert('Failed to save resume data');
    }
  };
  
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personal: {
        ...formData.personal,
        [name]: value
      }
    });
  };
  
  const handleExperienceChange = (id, field, value) => {
    setFormData({
      ...formData,
      experience: formData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };
  
  const handleEducationChange = (id, field, value) => {
    setFormData({
      ...formData,
      education: formData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };
  
  const handleSkillsChange = (e) => {
    setFormData({
      ...formData,
      skills: {
        skillsList: e.target.value
      }
    });
  };
  
  const addExperience = () => {
    const newId = formData.experience.length > 0 ? 
      Math.max(...formData.experience.map(exp => exp.id)) + 1 : 1;
    
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };
  
  const removeExperience = (id) => {
    if (formData.experience.length > 1) {
      setFormData({
        ...formData,
        experience: formData.experience.filter(exp => exp.id !== id)
      });
    }
  };
  
  const addEducation = () => {
    const newId = formData.education.length > 0 ? 
      Math.max(...formData.education.map(edu => edu.id)) + 1 : 1;
    
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { id: newId, institution: '', degree: '', field: '', graduationDate: '', gpa: '' }
      ]
    });
  };
  
  const removeEducation = (id) => {
    if (formData.education.length > 1) {
      setFormData({
        ...formData,
        education: formData.education.filter(edu => edu.id !== id)
      });
    }
  };

  const downloadAsPDF = () => {
    // Make sure we're in preview mode to see the full resume
    setPreviewMode(true);
    
    // After state update and re-render, proceed with PDF generation
    setTimeout(() => {
      if (resumeRef.current && window.html2pdf) {
        const resumeName = formData.personal.name || 'Resume';
        const fileName = `${resumeName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
        
        const element = resumeRef.current;
        const opt = {
          margin: 0.5,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // Generate PDF
        window.html2pdf().set(opt).from(element).save();
      } else {
        alert('PDF generation is not available. Please try again in a moment.');
      }
    }, 300);
  };

  const downloadAsJSON = () => {
    // Create a JSON data file from the form data
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    // Create an anchor element and trigger the download
    const exportName = `${formData.personal.name.replace(/\s+/g, '_') || 'resume'}_data.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };
  
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setFormData(importedData);
          alert('Resume data imported successfully!');
        } catch (error) {
          alert('Error importing file: Invalid JSON format');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.personal.name}
            onChange={handlePersonalChange}
            className="w-full p-2 border rounded"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.personal.email}
            onChange={handlePersonalChange}
            className="w-full p-2 border rounded"
            placeholder="john.doe@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.personal.phone}
            onChange={handlePersonalChange}
            className="w-full p-2 border rounded"
            placeholder="(123) 456-7890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.personal.address}
            onChange={handlePersonalChange}
            className="w-full p-2 border rounded"
            placeholder="123 Main St, City, State"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Professional Summary</label>
        <textarea
          name="summary"
          value={formData.personal.summary}
          onChange={handlePersonalChange}
          className="w-full p-2 border rounded h-32"
          placeholder="A brief summary of your professional background and career objectives..."
        />
      </div>
    </div>
  );
  
  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <button 
          onClick={addExperience}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Experience
        </button>
      </div>
      
      {formData.experience.map((exp) => (
        <div key={exp.id} className="p-4 border rounded space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Job Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="MM/YYYY or Present"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
          {formData.experience.length > 1 && (
            <div className="flex justify-end">
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
        <button 
          onClick={addEducation}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add Education
        </button>
      </div>
      
      {formData.education.map((edu) => (
        <div key={edu.id} className="p-4 border rounded space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="University/College Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Computer Science, Business, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduation Date</label>
              <input
                type="text"
                value={edu.graduationDate}
                onChange={(e) => handleEducationChange(edu.id, 'graduationDate', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="MM/YYYY or Expected MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g. 3.8/4.0"
              />
            </div>
          </div>
          {formData.education.length > 1 && (
            <div className="flex justify-end">
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  const renderSkills = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Skills</h2>
      <div>
        <label className="block text-sm font-medium mb-1">
          List your skills (separate with commas)
        </label>
        <textarea
          value={formData.skills.skillsList}
          onChange={handleSkillsChange}
          className="w-full p-2 border rounded h-32"
          placeholder="JavaScript, React, Project Management, Communication, etc."
        />
      </div>
    </div>
  );
  
  const renderPreview = () => {
    const skills = formData.skills.skillsList.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
      
    return (
      <div ref={resumeRef} className="p-6 bg-white border rounded max-w-3xl mx-auto" id="resume-content">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{formData.personal.name || 'Your Name'}</h1>
          <div className="text-gray-600 mt-2">
            {formData.personal.email && <span className="mr-3">{formData.personal.email}</span>}
            {formData.personal.phone && <span className="mr-3">{formData.personal.phone}</span>}
            {formData.personal.address && <span>{formData.personal.address}</span>}
          </div>
        </div>
        
        {formData.personal.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm">{formData.personal.summary}</p>
          </div>
        )}
        
        {formData.experience.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-1 mb-3">Work Experience</h2>
            {formData.experience.map((exp, index) => (
              (exp.company || exp.position) && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium">{exp.position || 'Position'} | {exp.company || 'Company'}</div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate || 'Start Date'} - {exp.endDate || 'End Date'}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
        
        {formData.education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-1 mb-3">Education</h2>
            {formData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium">
                      {edu.degree && edu.field ? `${edu.degree} in ${edu.field}` : (edu.degree || edu.field || 'Degree')}
                    </div>
                    <div className="text-sm text-gray-600">{edu.graduationDate || 'Graduation Date'}</div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>{edu.institution || 'Institution'}</div>
                    {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      default:
        return null;
    }
  };

  // Hidden file input for importing JSON
  const fileInputRef = useRef(null);
  
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Builder</h1>
      
      {/* Hidden file input for JSON import */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={importJSON}
        style={{ display: 'none' }}
        accept=".json"
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-gray-100 p-4 rounded sticky top-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveSection('personal'); setPreviewMode(false); }}
                  className={`w-full text-left p-2 rounded ${activeSection === 'personal' && !previewMode ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  Personal Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('experience'); setPreviewMode(false); }}
                  className={`w-full text-left p-2 rounded ${activeSection === 'experience' && !previewMode ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  Work Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('education'); setPreviewMode(false); }}
                  className={`w-full text-left p-2 rounded ${activeSection === 'education' && !previewMode ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  Education
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveSection('skills'); setPreviewMode(false); }}
                  className={`w-full text-left p-2 rounded ${activeSection === 'skills' && !previewMode ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                  Skills
                </button>
              </li>
              <li className="mt-6">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`w-full p-2 rounded ${previewMode ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  {previewMode ? 'Edit Resume' : 'Preview Resume'}
                </button>
              </li>
            </ul>
            
            {/* Export/Import Options */}
            <div className="mt-6 space-y-2">
              <h3 className="font-medium text-gray-700">Export/Import Options</h3>
              <button
                onClick={downloadAsPDF}
                className={`w-full p-2 ${html2pdfLoaded ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'} rounded`}
                disabled={!html2pdfLoaded}
              >
                {html2pdfLoaded ? 'Download as PDF' : 'Loading PDF Generator...'}
              </button>
              <button
                onClick={downloadAsJSON}
                className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Export Data (JSON)
              </button>
              <button
                onClick={handleImportClick}
                className="w-full p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Import Data
              </button>
              <button
                onClick={saveToLocalStorage}
                className="w-full p-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
              >
                Save to Browser
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/4">
          {previewMode ? renderPreview() : renderActiveSection()}
        </div>
      </div>
      
      {!previewMode && (
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setPreviewMode(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Preview Resume
          </button>
          <button
            onClick={downloadAsPDF}
            className={`px-4 py-2 rounded ${html2pdfLoaded ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!html2pdfLoaded}
          >
            Download PDF
          </button>
        </div>
      )}
      
      {previewMode && (
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Edit
          </button>
          <button
            onClick={downloadAsPDF}
            className={`px-4 py-2 rounded ${html2pdfLoaded ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!html2pdfLoaded}
          >
            Download PDF
          </button>
          <button
            onClick={downloadAsJSON}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Export Data
          </button>
        </div>
      )}
    </div>
  );
}