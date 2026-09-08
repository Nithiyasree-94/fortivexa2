import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ArrowRight, ShieldAlert, Layers } from 'lucide-react';
import { formatINR, getStatusBadgeClass } from '../utils/helpers';

export const FullMapPage = ({ complaints = [], onSelectCase }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedCase, setSelectedCase] = useState(complaints[0] || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Centered on Central/Northern India
    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569], // Central India
      zoom: 5,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds = [];

    complaints.forEach((c) => {
      const pred = c.predictions[0];
      if (!pred) return;

      const isIntercepted = c.status === 'Intercepted';
      const isHigh = pred.confidence >= 80;
      const color = isIntercepted ? '#10b981' : isHigh ? '#ef4444' : '#f97316';

      const customIcon = L.divIcon({
        className: 'custom-all-atm-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${color};
            color: #0a0f1d;
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 0 14px ${color}80;
            cursor: pointer;
          ">
            ${pred.confidence}%
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([pred.lat, pred.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="min-width: 220px;">
          <div style="font-size: 10px; font-family: monospace; color: ${color}; font-weight: bold; margin-bottom: 2px;">
            ${c.id} • ${c.status}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">
            ${pred.locationName}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
            ${pred.address}
          </div>
          <div style="font-size: 11px; color: #e2e8f0; font-family: monospace; border-top: 1px solid #334155; padding-top: 4px;">
            Siphoned: <strong>${formatINR(c.amount)}</strong><br/>
            Confidence: <strong>${pred.confidence}%</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => setSelectedCase(c));
      bounds.push([pred.lat, pred.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [complaints]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 bg-navy-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-sih-teal uppercase tracking-wider">
            PAN-INDIA GEOSPATIAL INTELLIGENCE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
            Predicted Cybercrime Cash-Out Hotspots
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated predictive targets across NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Ahmedabad, Jaipur, and Lucknow
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono bg-navy-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300">High Risk</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">Medium</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Intercepted</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cyber-card rounded-2xl border border-slate-800 overflow-hidden min-h-[500px] relative shadow-2xl">
          <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-10" />
        </div>

        <div className="cyber-card rounded-2xl border border-slate-800 p-5 bg-navy-950 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Selected Regional Target
              </h3>
              <span className="text-[10px] font-mono text-sih-teal">ACTIVE DOSSIER</span>
            </div>

            {selectedCase ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Target Location</span>
                  <h4 className="font-bold text-sm text-slate-100 mt-0.5">
                    {selectedCase.predictions[0]?.locationName}
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {selectedCase.predictions[0]?.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-navy-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">Case ID</span>
                    <span className="font-bold font-mono text-slate-200">{selectedCase.id}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-navy-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">Confidence</span>
                    <span className="font-bold font-mono text-sih-orange">{selectedCase.predictions[0]?.confidence}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-navy-900/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Victim:</span>
                    <span className="text-slate-200 font-semibold">{selectedCase.victim.name}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-slate-100 font-bold">{formatINR(selectedCase.amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${getStatusBadgeClass(selectedCase.status)}`}>
                      {selectedCase.status}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-900/40 border border-slate-800/80 text-[11px] text-slate-400">
                  <span className="text-sih-teal font-medium">Nearest Unit: </span>
                  {selectedCase.predictions[0]?.nearestUnit}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-12 text-center">Click a marker to inspect details.</p>
            )}
          </div>

          {selectedCase && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => onSelectCase(selectedCase.id)}
                className="w-full py-2.5 rounded-xl bg-sih-orange hover:bg-orange-500 text-navy-950 font-bold text-xs font-mono flex items-center justify-center space-x-2 shadow-glow-orange transition-all"
              >
                <span>Launch 6-Step Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
