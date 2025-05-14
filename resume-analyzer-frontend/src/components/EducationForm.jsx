import SectionHeader from './SectionHeader';

export default function EducationForm({ education, onChange }) {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updated = education.map(edu => 
      edu.id === id ? { ...edu, [name]: value } : edu
    );
    onChange(updated);
  };

  const addEducation = () => {
    onChange([
      ...education,
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
      }
    ]);
  };

  const removeEducation = (id) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="mb-6">
      <SectionHeader 
        title="Education" 
        onAdd={addEducation} 
      />
      
      {education.map((edu) => (
        <div key={edu.id} className="border border-gray-300 rounded-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                name="institution"
                value={edu.institution}
                onChange={(e) => handleChange(edu.id, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                name="degree"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Field of Study</label>
              <input
                type="text"
                name="field"
                value={edu.field}
                onChange={(e) => handleChange(edu.id, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="text"
                  name="startDate"
                  placeholder="MM/YYYY"
                  value={edu.startDate}
                  onChange={(e) => handleChange(edu.id, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="text"
                  name="endDate"
                  placeholder="MM/YYYY or Present"
                  value={edu.endDate}
                  onChange={(e) => handleChange(edu.id, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>
          {education.length > 1 && (
            <button 
              type="button"
              onClick={() => removeEducation(edu.id)} 
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}