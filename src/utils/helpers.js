export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-950/70 text-red-400 border border-red-800/80 animate-pulse';
    case 'HIGH':
      return 'bg-amber-950/70 text-amber-400 border border-amber-800/80';
    case 'MEDIUM':
      return 'bg-sky-950/70 text-sky-400 border border-sky-800/80';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Intercepted':
      return 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/60 font-semibold';
    case 'Alert Dispatched':
    case 'Under Watch':
      return 'bg-orange-950/80 text-orange-400 border border-orange-600/60 font-medium';
    case 'Under Investigation':
      return 'bg-cyan-950/80 text-cyan-400 border border-cyan-600/60';
    case 'Pending Analysis':
    case 'Pending':
      return 'bg-yellow-950/80 text-yellow-400 border border-yellow-600/60';
    case 'Missed':
      return 'bg-rose-950/80 text-rose-400 border border-rose-600/60';
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700';
  }
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-red-400 bg-red-500/20 border-red-500/40';
  if (confidence >= 65) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
  return 'text-teal-400 bg-teal-500/20 border-teal-500/40';
};
