import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "マイ旅程", icon: "🧳", end: true },
  { to: "/new", label: "作成", icon: "➕", end: false },
  { to: "/discover", label: "検索", icon: "🔍", end: false },
];

export function TabBar() {
  return (
    <nav className="bottom-tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `bottom-tab${isActive ? " active" : ""}`}
        >
          <span className="bottom-tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="bottom-tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
