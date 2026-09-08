import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation as NavIcon, Shield, Layers, ZoomIn } from 'lucide-react';

export const Step5RiskMap = ({ complaint }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedPin, setSelectedPin] = useState(complaint.predictions[0] || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any prior instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const predictions = complaint.predictions;
    if (!predictions || predictions.length === 0) return;

    const initialCenter = [predictions[0].lat, predictions[0].lng];

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add pins
    markersRef.current = [];
    const bounds = [];

    predictions.forEach((item) => {
      const isHigh = item.confidence >= 80;
      const isMed = item.confidence >= 65;

      const pinColor = isHigh ? '#ef4444' : isMed ? '#f97316' : '#eab308';
      const glowColor = isHigh ? 'rgba(239, 68, 68, 0.4)' : isMed ? 'rgba(249, 115, 22, 0.4)' : 'rgba(234, 179, 8, 0.4)';

      // Custom HTML Marker icon
      const customIcon = L.divIcon({
        className: 'custom-atm-marker',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${pinColor};
            color: #0a0f1d;
            font-weight: 800;
            font-family: monospace;
            font-size: 13px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 16px ${glowColor};
            cursor: pointer;
          ">
            #${item.rank}
            ${isHigh ? `<div style="
              position: absolute;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              border: 2px solid ${pinColor};
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              pointer-events: none;
            "></div>` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${pinColor}25; color: ${pinColor}; border: 1px solid ${pinColor}50;">
              RANK #${item.rank} • ${item.riskLevel} RISK
            </span>
            <span style="font-size: 14px; font-weight: bold; font-family: monospace; color: ${pinColor};">
              ${item.confidence}%
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: bold; color: #f8fafc; margin: 0 0 4px 0;">
            ${item.locationName}
          </h4>
          <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0;">
            ${item.address}
          </p>
          <div style="border-top: 1px solid #1e293b; padding-top: 6px; font-size: 10px; color: #cbd5e1;">
            <strong>Bank:</strong> ${item.bank}<br/>
            <strong>Window:</strong> ${item.window}<br/>
            <strong>Intercept Unit:</strong> ${item.nearestUnit}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedPin(item);
      });

      markersRef.current.push({ item, marker });
      bounds.push([item.lat, item.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Open first popup by default
    if (markersRef.current[0]) {
      markersRef.current[0].marker.openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [complaint]);

  const handleSelectLocation = (item) => {
    setSelectedPin(item);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([item.lat, item.lng], 16, { animate: true });
      const found = markersRef.current.find(m => m.item.rank === item.rank);
      if (found) {
        found.marker.openPopup();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 5: RISK HEATMAP & WITHDRAWAL ATM GEOLOCATION
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
            Geospatial Intercept Perimeter (OpenStreetMap)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pins color-coded by model confidence: Red (High Risk $\ge$ 80%), Orange (Medium Risk $\ge$ 65%), Yellow (Low Risk)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300">High Risk (&gt;80%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">Med (65-79%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-slate-300">Low (&lt;65%)</span>
          </div>
        </div>
      </div>

      {/* Map & List Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map: 2 Cols */}
        <div className="lg:col-span-2 cyber-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative min-h-[460px]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-10" />
        </div>

        {/* Predicted Locations Panel: 1 Col */}
        <div className="cyber-card rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between bg-navy-950">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <NavIcon className="w-4 h-4 text-sih-teal" />
                <span>Target ATM Nodes</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {complaint.predictions.length} PINS
              </span>
            </div>

            <div className="space-y-3">
              {complaint.predictions.map((item) => {
                const isSelected = selectedPin?.rank === item.rank;
                const isHigh = item.confidence >= 80;
                const isMed = item.confidence >= 65;

                return (
                  <div
                    key={item.rank}
                    onClick={() => handleSelectLocation(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-navy-900 border-sih-orange shadow-glow-orange'
                        : 'bg-navy-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isHigh ? 'bg-red-500 text-white' : isMed ? 'bg-orange-500 text-navy-950' : 'bg-yellow-500 text-navy-950'
                        }`}>
                          {item.rank}
                        </span>
                        <h5 className="font-bold text-xs text-slate-200 truncate max-w-[180px]">
                          {item.locationName}
                        </h5>
                      </div>
                      <span className={`font-mono text-xs font-bold ${
                        isHigh ? 'text-red-400' : isMed ? 'text-orange-400' : 'text-yellow-400'
                      }`}>
                        {item.confidence}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {item.address}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.bank}</span>
                      <span className="text-sih-teal font-medium">Pan Map &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Coordinates: Real Metros</span>
            <span className="text-slate-400 font-mono">WGS84 Datum</span>
          </div>
        </div>
      </div>
    </div>
  );
};
