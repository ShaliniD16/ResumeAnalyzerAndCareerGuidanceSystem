export default function ResumePreview({ data }) {
    const { personalInfo, workExperience, education, skills } = data;
  
    return (
      <div className="bg-white p-6 shadow-lg max-w-4xl mx-auto">
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{personalInfo.name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-4 text-gray-600 mt-2">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.address && <div>{personalInfo.address}</div>}
          </div>
        </div>
  
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Professional Summary</h2>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </div>
        )}
  
        {workExperience.some(exp => exp.company || exp.title) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Work Experience</h2>
            {workExperience.filter(exp => exp.company || exp.title).map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{exp.title || 'Position'}</h3>
                    <div>{exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''}</div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}
                  </div>
                </div>
                {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
  
        {education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Education</h2>
            {education.filter(edu => edu.institution || edu.degree).map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <div>{edu.institution || 'Institution'}</div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
  
        {skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }