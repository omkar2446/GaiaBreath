import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { label: "AQI Map", path: "/aqi-map" },
  { label: "Health Advisor", path: "/healthadvisor" },
  { label: "Community Dashboard", path: "/dashboard" },
  { label: "Health Report", path: "/healthreport" },
  { label: "IoT AQI Report", path: "/iot-report" },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <aside className="sidebar sidebar-open" onClick={(e) => e.stopPropagation()}>
        <h2 className="sidebar-title">Menu</h2>

        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            className="sidebar-item"
            onClick={() => {
              if (item.path) {
                navigate(item.path);
                onClose();
              }
            }}
            style={{ cursor: item.path ? "pointer" : "default" }}
          >
            {item.label}
          </div>
        ))}

        <button className="sidebar-close" onClick={onClose}>
          Close Menu
        </button>
      </aside>
    </div>
  );
}

export default Sidebar;
