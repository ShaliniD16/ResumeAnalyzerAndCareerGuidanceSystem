import SkillTag from './SkillTag';
import { useState } from 'react'; 

export default function SkillsForm({ skills, onChange }) {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Skills</h2>
      <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="flex-grow border border-gray-300 rounded-md shadow-sm p-2"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillTag 
            key={index} 
            skill={skill} 
            onRemove={handleRemoveSkill} 
          />
        ))}
      </div>
    </div>
  );
}