import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore) => {
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = useCallback(() => {
        if (isFetching || !hasMore) return;

        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 500
        ) {
            setIsFetching(true);
            callback().finally(() => setIsFetching(false));
        }
    }, [callback, isFetching, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { isFetching };
};

export default useInfiniteScroll;