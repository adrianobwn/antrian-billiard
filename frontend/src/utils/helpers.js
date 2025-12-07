import { format } from 'date-fns';

// Utility function to concatenate class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  if (!date) return '-';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return format(dateObj, formatString);
};

// Format time
export const formatTime = (date) => {
  if (!date) return '-';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return format(dateObj, 'HH:mm');
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '-';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';
  return format(dateObj, 'dd MMM yyyy, HH:mm');
};

// Format duration in hours
export const formatDuration = (hours) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes} menit`;
  } else if (minutes === 0) {
    return `${wholeHours} jam`;
  } else {
    return `${wholeHours} jam ${minutes} menit`;
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Status color mapping
export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error',
    available: 'success',
    occupied: 'error',
    maintenance: 'warning',
  };
  return colors[status] || 'default';
};

// Get table status text
export const getTableStatusText = (status) => {
  const texts = {
    available: 'Tersedia',
    occupied: 'Terpakai',
    maintenance: 'Maintenance',
  };
  return texts[status] || status;
};

// Get reservation status text
export const getReservationStatusText = (status) => {
  const texts = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return texts[status] || status;
};