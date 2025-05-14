// PersonalInfoForm.jsx
export default function PersonalInfoForm({ data, onChange }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onChange({ ...data, [name]: value });
    };
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          {/* Other personal info fields */}
        </div>
      </div>
    );
  }