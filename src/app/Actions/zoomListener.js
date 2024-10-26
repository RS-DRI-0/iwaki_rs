import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setZoomLevel } from './getZoomScreen';

const ZoomListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const detectZoom = () => {
      const zoom = Math.round(window.devicePixelRatio * 100);
      dispatch(setZoomLevel(zoom));
    };

    window.addEventListener('resize', detectZoom);
    detectZoom(); // Gọi ngay khi component mount

    return () => {
      window.removeEventListener('resize', detectZoom);
    };
  }, [dispatch]);

  return null; // Component này không render gì cả
};

export default ZoomListener;