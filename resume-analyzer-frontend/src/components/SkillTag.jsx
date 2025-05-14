export default function SkillTag({ skill, onRemove }) {
    return (
      <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
        <span>{skill}</span>
        <button 
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-2 text-gray-500 hover:text-red-600"
        >
          &times;
        </button>
      </div>
    );
  }