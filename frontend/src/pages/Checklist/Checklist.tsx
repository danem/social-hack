import React, { useState } from 'react';

type ChecklistItem = {
  id: number;
  title: string;
  completed: boolean;
};

type ChecklistProps = {
  items: ChecklistItem[];
  loading?: boolean; // Optional loading state prop
};

export function Checklist({ items, loading = false }: ChecklistProps) {
  const [isSending, setIsSending] = useState<number | null>(null); // Track which item is being sent a reminder for

  const completedCount = items.filter(item => item.completed).length;

  const handleSendReminder = async (id: number) => {
    setIsSending(id);
    try {
      // Simulate sending a reminder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay for the action
      alert(`Reminder sent for item ID ${id}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
    } finally {
      setIsSending(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold">Loading checklist items...</p>
        </div>
      </div>
    );
  }

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
            <span className="flex-grow">{item.title}</span>
            <button
              onClick={() => handleSendReminder(item.id)}
              disabled={isSending === item.id}
              className={`ml-2 px-3 py-1 rounded text-white ${
                isSending === item.id ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSending === item.id ? 'Sending...' : 'Send Reminder'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}