import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Clock, MapPin, Shield, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { getConfidenceColor } from '../../utils/helpers';

export const Step4Prediction = ({ complaint }) => {
  const [isInferring, setIsInferring] = useState(false);
  const [displayedPredictions, setDisplayedPredictions] = useState(complaint.predictions);

  const handleReInference = () => {
    setIsInferring(true);
    setDisplayedPredictions([]);
    setTimeout(() => {
      setDisplayedPredictions(complaint.predictions);
      setIsInferring(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 4: GEOSPATIAL & TEMPORAL ML CASH-OUT PREDICTION ENGINE
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
            Likely Cash Withdrawal Locations Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Predictive neural model correlating mule geofence, ATM telemetry, and historical withdrawal timing
          </p>
        </div>

        <button
          onClick={handleReInference}
          disabled={isInferring}
          className="px-3.5 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-sih-orange border border-sih-orange/40 text-xs font-mono flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isInferring ? 'animate-spin' : ''}`} />
          <span>{isInferring ? 'Running Neural Inference...' : 'Re-Run ML Predictor'}</span>
        </button>
      </div>

      {/* Model Running Animation Banner (if inferring) */}
      {isInferring ? (
        <div className="cyber-card-glow rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-sih-teal/50">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-sih-teal animate-spin mx-auto" />
            <Cpu className="w-7 h-7 text-sih-teal absolute inset-0 m-auto" />
          </div>
          <div>
            <h4 className="font-mono font-bold text-slate-100 text-base sm:text-lg">
              CALCULATING GEOSPATIAL EXTRACTION VECTOR...
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Analyzing 14,800 ATM transaction topologies across active mule cell towers
            </p>
          </div>
        </div>
      ) : (
        /* Ranked Predictions List */
        <div className="space-y-4">
          {displayedPredictions.map((item) => {
            const isTopRank = item.rank === 1;

            return (
              <div
                key={item.rank}
                className={`cyber-card rounded-2xl p-4 sm:p-6 border transition-all duration-300 ${
                  isTopRank
                    ? 'border-sih-orange/60 bg-gradient-to-r from-navy-900 via-navy-850 to-orange-950/20 shadow-glow-orange'
                    : 'border-slate-800 hover:border-slate-700 bg-navy-900/70'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank, Name & Address */}
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 ${
                        isTopRank
                          ? 'bg-gradient-to-br from-sih-orange to-red-600 text-navy-950 shadow-glow-orange'
                          : 'bg-navy-850 text-slate-300 border border-slate-700'
                      }`}
                    >
                      #{item.rank}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-slate-100">
                          {item.locationName}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-cyan-300 border border-cyan-800 font-semibold">
                          {item.bank}
                        </span>
                        {isTopRank && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase animate-pulse">
                            Primary Intercept Target
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sih-orange flex-shrink-0" />
                        <span>{item.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Confidence Score */}
                  <div className="flex flex-col items-start md:items-end flex-shrink-0">
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Prediction Confidence</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                        item.confidence >= 80 ? 'text-red-400' : item.confidence >= 65 ? 'text-orange-400' : 'text-teal-400'
                      }`}>
                        {item.confidence}%
                      </span>
                    </div>
                    {/* Confidence Progress Bar */}
                    <div className="w-36 bg-navy-950 rounded-full h-2 mt-1 border border-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.confidence >= 80 ? 'bg-red-500' : item.confidence >= 65 ? 'bg-orange-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Intelligence Row */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-navy-950/70 p-2.5 rounded-lg border border-slate-800/80 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-sih-teal flex-shrink-0" />
                    <div>
                      <span className="text-slate-500 text-[10px] block font-mono">Predicted Window</span>
                      <span className="font-semibold text-slate-200">{item.window}</span>
                    </div>
                  </div>

                  <div className="bg-navy-950/70 p-2.5 rounded-lg border border-slate-800/80 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-sih-orange flex-shrink-0" />
                    <div>
                      <span className="text-slate-500 text-[10px] block font-mono">Nearest Intercept Unit</span>
                      <span className="font-semibold text-slate-200 truncate block max-w-[200px]" title={item.nearestUnit}>
                        {item.nearestUnit}
                      </span>
                    </div>
                  </div>

                  <div className="bg-navy-950/70 p-2.5 rounded-lg border border-slate-800/80 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500 text-[10px] block font-mono">Historical Extractions</span>
                      <span className="font-semibold text-slate-200">{item.historicalWithdrawals} prior incidents</span>
                    </div>
                  </div>
                </div>

                {/* ML Rationale */}
                <div className="mt-3 text-xs text-slate-400 bg-navy-950/40 px-3 py-2 rounded-lg border border-slate-800/60 font-sans">
                  <span className="text-sih-teal font-medium">Model Rationale: </span>
                  {item.rationale}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
