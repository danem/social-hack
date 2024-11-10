// App.tsx
import { SidebarNav } from "@components/SidebarNav/SidebarNav";
import React from "react";

// Define types for the data structures
type Item = {
  name: string;
  issue: string;
  location: string;
};

type ColumnData = {
  title: string;
  count: number;
  items: Item[];
};

// Column component
type ColumnProps = {
  title: string;
  count: number;
  items: Item[];
};

function Column ({ title, count, items }: ColumnData){
    return (
        <div className="bg-slate-200 p-4 rounded-lg shadow-md">
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-row gap-4 align-text-top align-middle mb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-gray-500 mb-2">{count}</p>
                </div>
            {items.map((item, index) => (
                <div key={index} className="bg-gray-100 hover:bg-slate-300 p-2 rounded-lg shadow-inner mb-2 cursor-pointer">
                    <p>{item.name} - {item.issue}</p>
                    <p className="text-sm text-gray-500">{item.location}</p>
                </div>
            ))}
            </div>
        </div>
    );
}

// Main App component
export function ClientManagement () {
  const columnsData: ColumnData[] = [
    {
      title: "Newly Added",
      count: 1,
      items: [{ name: "Betsy Cole", issue: "Mold", location: "East Palo Alto" }]
    },
    {
      title: "Consultation Scheduled",
      count: 4,
      items: [
        { name: "Steve Johnson", issue: "Roof", location: "East Palo Alto" },
        { name: "Frank Brown", issue: "Plumbing", location: "San Mateo" },
        { name: "Anna Johnson", issue: "Mold", location: "East Palo Alto" },
        { name: "Teresa Smith", issue: "Mold", location: "Mountain View" }
      ]
    },
    {
      title: "Pending Client Information",
      count: 2,
      items: [
        { name: "Michael Suarez", issue: "Plumbing", location: "East Palo Alto" },
        { name: "Nancy Landon", issue: "Windows", location: "San Mateo" }
      ]
    },
    {
      title: "Pending Petition",
      count: 3,
      items: [
        { name: "Wendy Manfield", issue: "Plumbing", location: "East Palo Alto" },
        { name: "Ian Goldberg", issue: "Mold", location: "Mountain View" },
        { name: "Janet Martinez", issue: "Mold", location: "East Palo Alto" }
      ]
    }
  ];

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

