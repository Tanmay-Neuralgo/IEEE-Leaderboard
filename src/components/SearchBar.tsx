import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex gap-4 flex-wrap lg:flex-nowrap">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#585458]" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 border-[#F0F8FC] rounded-lg focus:outline-none focus:border-[#0A5394] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#585458] hover:text-[#0A5394]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="px-4 py-3 border-2 border-[#F0F8FC] rounded-lg focus:outline-none focus:border-[#0A5394] bg-white text-[#012654] font-medium min-w-[200px] transition-colors"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
