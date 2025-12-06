class Cache {
    constructor(maxAge = 5 * 60 * 1000) { // Default 5 minutes
        this.cache = new Map();
        this.maxAge = maxAge;
    }

    set(key, value, maxAge = this.maxAge) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            maxAge
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > item.maxAge) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clear() {
        this.cache.clear();
    }

    delete(key) {
        this.cache.delete(key);
    }

    // Clean expired items
    clean() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.maxAge) {
                this.cache.delete(key);
            }
        }
    }
}

// Create different cache instances for different data types
export const tableCache = new Cache(2 * 60 * 1000); // 2 minutes for tables
export const promoCache = new Cache(10 * 60 * 1000); // 10 minutes for promos
export const dashboardCache = new Cache(30 * 1000); // 30 seconds for dashboard data

// Auto clean cache every minute
setInterval(() => {
    tableCache.clean();
    promoCache.clean();
    dashboardCache.clean();
}, 60 * 1000);

export default Cache;