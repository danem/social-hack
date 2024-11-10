// App.tsx
import { SidebarNav } from "@components/SidebarNav/SidebarNav";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';

// Define types for the data structures
type Item = {
  id: number;
  name: string;
  issue: string;
  location: string;
};

type ColumnData = {
  title: string;
  count: number;
  items: Item[];
};

type ColumnProps = {
  title: string;
  count: number;
  items: Item[];
};

function Column ({ title, count, items }: ColumnData) {
  return (
    <div className="bg-slate-200 p-4 rounded-lg shadow-md">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row gap-4 align-text-top align-middle mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 mb-2">{count}</p>
        </div>
        {items.map((item, index) => (
          <div key={index} className="bg-gray-100 hover:bg-slate-300 p-2 rounded-lg shadow-inner mb-2 cursor-pointer">
            <Link to={`/client/${item.id}`}>
              <p>{item.name} - {item.issue}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientManagement() {
  const [columnsData, setColumnsData] = useState<ColumnData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('users').select('id, name, issue, location');
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Categorize data into columns based on `issue` type or any other criteria
      const columns = [
        { title: 'Mold Issues', items: data.filter((item: Item) => item.issue === 'Mold') },
        { title: 'Plumbing Issues', items: data.filter((item: Item) => item.issue === 'Plumbing') },
        { title: 'Roof Issues', items: data.filter((item: Item) => item.issue === 'Roof') },
        { title: 'Window Issues', items: data.filter((item: Item) => item.issue === 'Windows') },
      ];

      // Assign the count to each column
      const formattedColumnsData: ColumnData[] = columns.map((col) => ({
        title: col.title,
        count: col.items.length,
        items: col.items
      }));

      setColumnsData(formattedColumnsData);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {columnsData.map((column, index) => (
        <Column
          key={index}
          title={column.title}
          count={column.count}
          items={column.items}
        />
      ))}
    </div>
  );
}