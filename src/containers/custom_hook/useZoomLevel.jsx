import { useState, useEffect } from 'react';

const useZoomLevel = () => {
    const [zoomLevel, setZoomLevel] = useState(window.devicePixelRatio * 100);

    useEffect(() => {
        const handleZoomChange = () => {
            setZoomLevel(window.devicePixelRatio * 100);
        };

        // Lắng nghe sự thay đổi mức zoom
        window.addEventListener('resize', handleZoomChange);

        // Cập nhật zoom ngay khi component được render
        handleZoomChange();

        // Cleanup event listener khi component unmount
        return () => {
            window.removeEventListener('resize', handleZoomChange);
        };
    }, []);

    return zoomLevel;
};

export default useZoomLevel;