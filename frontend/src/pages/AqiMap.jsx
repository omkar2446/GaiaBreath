import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getAqiTileUrl, getBaseMapTileUrl } from "../services/api";
import "./AqiMap.css";



const LAYERS = [
  { label: "US EPA AQI", value: "usepa-aqi" },
  { label: "AQI", value: "aqi" },
  { label: "PM2.5", value: "pm25" },
  { label: "Wind", value: "wind" },
];

function toTileX(lon, zoom) {
  const n = 2 ** zoom;
  return Math.floor(((lon + 180) / 360) * n);
}

function toTileY(lat, zoom) {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  const mercator = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return Math.floor(((1 - mercator / Math.PI) / 2) * n);
}

function wrapX(x, zoom) {
  const n = 2 ** zoom;
  return ((x % n) + n) % n;
}

function clampY(y, zoom) {
  const n = 2 ** zoom;
  return Math.max(0, Math.min(n - 1, y));
}

function AqiMap() {
  const [lat, setLat] = useState("22.9734");
  const [lon, setLon] = useState("78.6569");
  const [zoom, setZoom] = useState(5);
  const [layer, setLayer] = useState("usepa-aqi");

  const resetToIndia = () => {
    setLat("22.9734");
    setLon("78.6569");
    setZoom(5);
  };

  const mapTiles = useMemo(() => {
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return [];
    }

    const cx = toTileX(lonNum, zoom);
    const cy = toTileY(latNum, zoom);
    const rows = [-1, 0, 1];
    const cols = [-1, 0, 1];

    return rows.flatMap((dy) =>
      cols.map((dx) => {
        const tx = wrapX(cx + dx, zoom);
        const ty = clampY(cy + dy, zoom);
        return {
          key: `${zoom}-${tx}-${ty}-${layer}`,
          baseSrc: getBaseMapTileUrl(zoom, tx, ty),
          overlaySrc: getAqiTileUrl(zoom, tx, ty, layer),
        };
      })
    );
  }, [lat, lon, zoom, layer]);

  return (
    <main className="aqi-map-page">
      
      <section className="aqi-map-card">
        <div className="aqi-map-header">
          <h1>AQI Map</h1>
          <p>Proxy-based AQI tiles served through backend endpoint.</p>
        </div>

        <div className="aqi-map-controls">
          <label>
            Latitude
            <input
              type="number"
              value={lat}
              step="0.0001"
              onChange={(e) => setLat(e.target.value)}
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              value={lon}
              step="0.0001"
              onChange={(e) => setLon(e.target.value)}
            />
          </label>
          <label>
            Zoom
            <input
              type="range"
              min="2"
              max="11"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span>{zoom}</span>
          </label>
          <label>
            Layer
            <select value={layer} onChange={(e) => setLayer(e.target.value)}>
              {LAYERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="aqi-map-actions">
          <button type="button" onClick={resetToIndia}>
            India View
          </button>
        </div>

        <div className="aqi-tile-grid">
          {mapTiles.map((tile) => (
            <div key={tile.key} className="aqi-tile">
              <img src={tile.baseSrc} alt="Base map tile" loading="lazy" />
              <img src={tile.overlaySrc} alt="AQI overlay tile" loading="lazy" />
            </div>
          ))}
        </div>

        <p className="aqi-map-note">
          Set <code>WAQI_TOKEN</code> in backend env for production traffic.
        </p>
        <p className="aqi-map-note">
          Map data: OpenStreetMap. AQI overlay: WAQI.
        </p>

        <p className="aqi-map-back">
          <Link to="/">Back to home</Link>
        </p>
      </section>
    </main>
  );
}

export default AqiMap;
