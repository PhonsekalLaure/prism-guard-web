export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

export const fmtMoney = (v) =>
  v == null ? 'N/A' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v);
