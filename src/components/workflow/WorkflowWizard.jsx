import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, RotateCcw } from 'lucide-react';
import { Step1Intake } from './Step1Intake';
import { Step2Cleaning } from './Step2Cleaning';
import { Step3MuleGraph } from './Step3MuleGraph';
import { Step4Prediction } from './Step4Prediction';
import { Step5RiskMap } from './Step5RiskMap';
import { Step6AlertDispatch } from './Step6AlertDispatch';
import { formatINR, getStatusBadgeClass } from '../../utils/helpers';

export const WorkflowWizard = ({ complaint, onUpdateStatus, onBackToDashboard, onSelectCase, allComplaints = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Intake Dossier', subtitle: 'Raw NCRP data' },
    { number: 2, title: 'Data Cleaning', subtitle: 'Standardization' },
    { number: 3, title: 'Mule Graph', subtitle: 'Network topology' },
    { number: 4, title: 'ML Prediction', subtitle: 'ATM forecasting' },
    { number: 5, title: 'Risk Map', subtitle: 'Geospatial pins' },
    { number: 6, title: 'Tactical Alert', subtitle: 'Interception memo' },
  ];

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="cyber-card rounded-2xl p-8 border border-slate-800 space-y-4">
          <h3 className="text-xl font-bold text-slate-100">No Case Selected for Analysis</h3>
          <p className="text-sm text-slate-400">
            Please select a live complaint from the dashboard to launch the 6-step cash-out prediction pipeline.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onBackToDashboard}
              className="px-5 py-2 rounded-xl bg-sih-orange text-navy-950 font-bold text-sm shadow-glow-orange"
            >
              Go to Dashboard Complaints
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Case Summary & Switcher Bar */}
      <div className="cyber-card rounded-2xl p-4 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900/60">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold font-mono text-slate-100">
                {complaint.id}
              </h2>
              <span className="text-slate-500">•</span>
              <span className="text-sm text-slate-300 font-semibold">{complaint.victim.name}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${getStatusBadgeClass(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {complaint.fraudType} • Siphoned: <span className="font-mono text-slate-200 font-bold">{formatINR(complaint.amount)}</span>
            </p>
          </div>
        </div>

        {/* Quick Case Switcher */}
        {allComplaints.length > 0 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono hidden sm:inline">Switch Case:</span>
            <select
              value={complaint.id}
              onChange={(e) => onSelectCase(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-sih-teal"
            >
              {allComplaints.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.victim.name} ({formatINR(c.amount)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress Bar & Stepper */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 bg-navy-950">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 hidden md:block -z-0">
            <div
              className="h-full bg-gradient-to-r from-sih-teal via-sih-orange to-red-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 relative z-10">
            {steps.map((step) => {
              const isPassed = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-300 flex md:flex-col items-center md:items-start space-x-2 md:space-x-0 md:space-y-1.5 ${
                    isCurrent
                      ? 'bg-navy-900 border-sih-orange shadow-glow-orange'
                      : isPassed
                      ? 'bg-navy-900/60 border-sih-teal/60 text-slate-300'
                      : 'bg-navy-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-sih-orange text-navy-950'
                        : isPassed
                        ? 'bg-sih-teal text-navy-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-slate-100' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
                      Step {step.number}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                      {step.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content Area */}
      <div className="min-h-[460px]">
        {currentStep === 1 && <Step1Intake complaint={complaint} />}
        {currentStep === 2 && <Step2Cleaning complaint={complaint} />}
        {currentStep === 3 && <Step3MuleGraph complaint={complaint} />}
        {currentStep === 4 && <Step4Prediction complaint={complaint} />}
        {currentStep === 5 && <Step5RiskMap complaint={complaint} />}
        {currentStep === 6 && <Step6AlertDispatch complaint={complaint} onUpdateStatus={onUpdateStatus} />}
      </div>

      {/* Navigation Footer (Back / Next) */}
      <div className="cyber-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between bg-navy-900/80">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 border transition-all ${
            currentStep === 1
              ? 'opacity-40 cursor-not-allowed bg-navy-950 border-slate-800 text-slate-600'
              : 'bg-navy-950 hover:bg-navy-850 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Step {currentStep} of 6 : <span className="text-sih-teal font-semibold">{steps[currentStep - 1].title}</span>
        </div>

        {currentStep < 6 ? (
          <button
            onClick={handleNext}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-sih-orange to-amber-600 hover:from-orange-500 hover:to-amber-500 text-navy-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-glow-orange transition-all"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onBackToDashboard}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-navy-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-glow-teal transition-all"
          >
            <span>Return to Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
