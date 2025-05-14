import SectionHeader from './SectionHeader';

export default function WorkExperienceForm({ experiences, onChange }) {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [name]: value } : exp
    );
    onChange(updated);
  };

  const addExperience = () => {
    onChange([
      ...experiences,
      {
        id: Date.now(),
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
  };

  const removeExperience = (id) => {
    onChange(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="mb-6">
      <SectionHeader 
        title="Work Experience" 
        onAdd={addExperience} 
      />
      
      {experiences.map((exp) => (
        <div key={exp.id} className="border border-gray-300 rounded-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="title"
                value={exp.title}
                onChange={(e) => handleChange(exp.id, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={exp.location}
                onChange={(e) => handleChange(exp.id, e)}
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
                  value={exp.startDate}
                  onChange={(e) => handleChange(exp.id, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="text"
                  name="endDate"
                  placeholder="MM/YYYY or Present"
                  value={exp.endDate}
                  onChange={(e) => handleChange(exp.id, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={exp.description}
              onChange={(e) => handleChange(exp.id, e)}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          {experiences.length > 1 && (
            <button 
              type="button"
              onClick={() => removeExperience(exp.id)} 
              className="mt-3 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}