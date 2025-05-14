// ResumeForm.jsx
import PersonalInfoForm from './PersonalInfoForm';
import WorkExperienceForm from './WorkExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';

export default function ResumeForm({ data, updateData }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <PersonalInfoForm 
        data={data.personalInfo} 
        onChange={(newData) => updateData('personalInfo', newData)} 
      />
      <WorkExperienceForm 
        experiences={data.workExperience} 
        onChange={(newData) => updateData('workExperience', newData)} 
      />
      <EducationForm 
        education={data.education} 
        onChange={(newData) => updateData('education', newData)} 
      />
      <SkillsForm 
        skills={data.skills} 
        onChange={(newData) => updateData('skills', newData)} 
      />
    </div>
  );
}