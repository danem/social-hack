import React from 'react';

type ChecklistItem = {
  id: number;
  title: string;
  completed: boolean;
};

type ChecklistProps = {
  items: ChecklistItem[];
};

export function Checklist({ items }: ChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Checklists</h2>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
        <div
          className="bg-green-500 h-6 rounded-full text-center text-white"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        >
          {`${completedCount}/${items.length} Completed`}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className={`flex items-center p-2 border ${
              item.completed ? 'border-green-500' : 'border-gray-300'
            } rounded-lg`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              className="mr-2"
              readOnly
            />
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}