// DistrictHoverTooltipContent.js

import React from 'react';

// Utility function to draw a pie chart arc
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const polarToCartesian = (centerX, centerY, rad, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (rad * Math.cos(angleInRadians)),
      y: centerY + (rad * Math.sin(angleInRadians))
    };
  };
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', x, y,
    'Z'
  ].join(' ');
};

// Component for the compact Pie Chart tooltip
const PieChartTooltip = ({ data }) => {
  const skillData = data.skillDevelopment || { completed: 40, inProgress: 30, pending: 30 };
  const totalSkills = skillData.completed + skillData.inProgress + skillData.pending;
  const completedAngle = (skillData.completed / totalSkills) * 360;
  const inProgressAngle = (skillData.inProgress / totalSkills) * 360;
  let currentAngle = 0;
  const slices = [];

  if (skillData.completed > 0) {
    slices.push({
      path: describeArc(50, 50, 40, currentAngle, currentAngle + completedAngle),
      color: '#22c55e',
    });
    currentAngle += completedAngle;
  }
  if (skillData.inProgress > 0) {
    slices.push({
      path: describeArc(50, 50, 40, currentAngle, currentAngle + inProgressAngle),
      color: '#facc15',
    });
    currentAngle += inProgressAngle;
  }
  if (skillData.pending > 0) {
    slices.push({
      path: describeArc(50, 50, 40, currentAngle, 360),
      color: '#ef4444',
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" aria-label="Skill development pie chart" role="img">
          {slices.map((slice, i) => (
            <path key={i} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
          ))}
          <circle cx="50" cy="50" r="20" fill="#f9fafb" />
          <text x="50" y="54" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">
            {totalSkills}%
          </text>
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-1 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-medium">IT Jobs:</span>
          <span className="font-semibold text-gray-800">{data.itJobs ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Non-IT Jobs:</span>
          <span className="font-semibold text-gray-800">{data.nonItJobs ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Test Results:</span>
          <span className="font-semibold text-gray-800">{data.testResults ?? 'N/A'}%</span>
        </div>
      </div>
    </div>
  );
};

// Component for the compact Bar Graph tooltip
const BarGraphTooltip = ({ data }) => {
  const barData = [
    { label: 'IT Jobs', value: data.itJobs, color: '#3b82f6' },
    { label: 'Non-IT Jobs', value: data.nonItJobs, color: '#10b981' },
    { label: 'Test Results', value: data.testResults, color: '#ef4444' }
  ];
  const maxVal = Math.max(...barData.map(d => d.value)) || 1;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">IT Jobs:</span>
          <span className="text-gray-900">{data.itJobs ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Non-IT Jobs:</span>
          <span className="text-gray-900">{data.nonItJobs ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Test Results:</span>
          <span className="text-gray-900">{data.testResults ?? 'N/A'}%</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-t border-gray-200 pt-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs w-1/4 shrink-0 text-right">Completed:</span>
          <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(data.skillDevelopment?.completed || 0)}%`, backgroundColor: '#22c55e' }}
            ></div>
          </div>
          <span className="font-semibold text-gray-800 text-xs">{data.skillDevelopment?.completed ?? 'N/A'}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs w-1/4 shrink-0 text-right">In Progress:</span>
          <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(data.skillDevelopment?.inProgress || 0)}%`, backgroundColor: '#facc15' }}
            ></div>
          </div>
          <span className="font-semibold text-gray-800 text-xs">{data.skillDevelopment?.inProgress ?? 'N/A'}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs w-1/4 shrink-0 text-right">Pending:</span>
          <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(data.skillDevelopment?.pending || 0)}%`, backgroundColor: '#ef4444' }}
            ></div>
          </div>
          <span className="font-semibold text-gray-800 text-xs">{data.skillDevelopment?.pending ?? 'N/A'}%</span>
        </div>
      </div>
    </div>
  );
};

// Main tooltip content component
const DistrictHoverTooltipContent = ({ districtData }) => {
  if (!districtData) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-xl shadow-lg min-w-[160px] text-center font-sans text-xs text-gray-500 select-none transition-all duration-300 ease-out">
        <p>
          <span className="text-lg">👋</span> Hover for details.
        </p>
      </div>
    );
  }

  const { name, displayType } = districtData;

  const renderContent = () => {
    switch (displayType) {
      case 'pieChart':
        return <PieChartTooltip data={districtData} />;
      case 'barGraph':
        return <BarGraphTooltip data={districtData} />;
      default:
        return <PieChartTooltip data={districtData} />;
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-lg min-w-[200px] max-w-sm font-sans text-xs leading-snug text-gray-800 select-none transition-all duration-300 ease-out transform scale-100">
      <h4 className="mb-2 text-md font-bold text-gray-900 border-b border-gray-200 pb-1 truncate" title={name}>
        {name}
      </h4>
      {renderContent()}
    </div>
  );
};

export default DistrictHoverTooltipContent;