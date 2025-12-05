/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format datetime to readable string
 */
export const formatDateTime = (date) => {
    if (!date) return '-';
    return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Format currency in IDR
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format duration in hours
 */
export const formatDuration = (hours) => {
    if (!hours) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export default {
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency,
    formatDuration,
};
