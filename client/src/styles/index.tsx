import React, { useState } from "react";
import NotificationIconExample from "@/styles/NotificationIconExample";
import CommonTableExample from "@/styles/CommonTableExample";
import CommonTabsExample from "@/styles/CommonTabsExample";
import CommonModalExample from "@/styles/CommonModalExample";
import CommonSearchBarExample from "@/styles/CommonSearchBarExample";

const STYLE_OPTIONS = [
  { key: "notification", label: "Notification" },
  { key: "commonSearchBar", label: "CommonSearchBar" },
  { key: "commonTable", label: "CommonTable" },
  { key: "commonTabs", label: "CommonTabs" },
  { key: "commonModal", label: "CommonModal" },
];

const StylesComponets = () => {
  const [selectedStyle, setSelectedStyle] = useState("notification");

  let content = null;
  switch (selectedStyle) {
    case "notification":
      content = <NotificationIconExample />;
      break;
    case "commonSearchBar":
      content = <CommonSearchBarExample />;
      break;
    case "commonTable":
      content = <CommonTableExample />;
      break;
    case "commonTabs":
      content = <CommonTabsExample />;
      break;
    case "commonModal":
      content = <CommonModalExample />;
      break;
    default:
      content = null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Style Previews</h2>
        <ul className="space-y-2">
          {STYLE_OPTIONS.map((option) => (
            <li key={option.key}>
              <button
                className={`w-full text-left px-3 py-2 rounded transition font-medium ${
                  selectedStyle === option.key
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedStyle(option.key)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{content}</main>
    </div>
  );
};

export default StylesComponets;
