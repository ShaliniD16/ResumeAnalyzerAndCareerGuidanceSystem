export default function SectionHeader({ title, onAdd }) {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button 
          type="button"
          onClick={onAdd} 
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          Add {title}
        </button>
      </div>
    );
  }