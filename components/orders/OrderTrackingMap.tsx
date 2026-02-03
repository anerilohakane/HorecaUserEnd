'use client';

import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl/mapbox'; // Use the /mapbox import!
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FtZWVyMjcyOSIsImEiOiJjbWswdWtmMGMwMDdmM2Zxc3ludjF2eTZkIn0._DvjqPsOzDNAlUIPs4xJlQ";

interface OrderTrackingMapProps {
    destination: {
        lat: number;
        lng: number;
        address?: string;
    };
    status: string; // 'out_for_delivery', etc.
}

// Helper to calculate distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ destination, status }) => {
    const mapRef = useRef<MapRef>(null);
    const [driverLoc, setDriverLoc] = useState<{ lat: number; lng: number } | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // Initial driver start point (simulate 2-3km away)
    // Offset roughly 0.02 degrees ~ 2.2km
    const startPoint = {
        lat: destination.lat - 0.015,
        lng: destination.lng - 0.015
    };

    useEffect(() => {
        // If out for delivery, simulate movement
        if ((status === 'out_for_delivery' || status === 'shipped') && mapLoaded) {
            setDriverLoc(startPoint);

            // Animate progress from 0 to 1 over 60 seconds (slow approach)
            const controls = animate(0, 0.9, {
                duration: 60,
                ease: "linear",
                onUpdate: (latest) => {
                    setProgress(latest);
                    // Linear interpolation
                    const newLat = startPoint.lat + (destination.lat - startPoint.lat) * latest;
                    const newLng = startPoint.lng + (destination.lng - startPoint.lng) * latest;
                    setDriverLoc({ lat: newLat, lng: newLng });

                    // Update Camera to follow midpoint
                    if (mapRef.current) {
                        mapRef.current.flyTo({
                            center: [newLng, newLat],
                            zoom: 15,
                            pitch: 60,
                            essential: false // smooth
                        });
                    }
                }
            });

            return () => controls.stop();
        } else {
            // If not out for delivery, just show destination
            setDriverLoc(null);
        }
    }, [status, destination.lat, destination.lng, mapLoaded]);


    // Route Line GeoJSON
    const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [
                [startPoint.lng, startPoint.lat],
                [destination.lng, destination.lat]
            ]
        }
    };

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-100 relative">
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: destination.lat,
                    longitude: destination.lng,
                    zoom: 14,
                    pitch: 60,
                    bearing: -20
                }}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/standard"
                style={{ width: '100%', height: '100%' }}
                onLoad={() => setMapLoaded(true)}
            >
                {/* Destination Marker */}
                <Marker latitude={destination.lat} longitude={destination.lng} anchor="bottom">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-full shadow-lg border border-red-500">
                            <MapPin className="text-red-500 fill-red-100" size={24} />
                        </div>
                        <div className="bg-white/90 backdrop-blur px-2 py-1 mt-1 rounded text-xs font-bold shadow-md">
                            You
                        </div>
                    </div>
                </Marker>

                {/* Driver Marker (Animated) */}
                {driverLoc && mapLoaded && (
                    <Marker latitude={driverLoc.lat} longitude={driverLoc.lng} anchor="center">
                        <div className="relative">
                            <img
                                src={`/Truck.png?v=${new Date().getTime()}`}
                                alt="Delivery Partner"
                                width={80}
                                height={80}
                                className="drop-shadow-2xl -mt-10"
                            />
                        </div>
                    </Marker>
                )}

                {/* Route Line (Simple straight line) */}
                {driverLoc && mapLoaded && (
                    <Source id="route-source" type="geojson" data={routeGeoJSON as any}>
                        <Layer
                            id="route-layer"
                            type="line"
                            paint={{
                                'line-color': '#D97706',
                                'line-width': 4,
                                'line-opacity': 0.6,
                                'line-dasharray': [2, 1]
                            }}
                        />
                    </Source>
                )}

            </Map>

            {/* Status Overlay */}
            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">
                            {status === 'out_for_delivery' ? 'Order is on the way!' : 'Locating order...'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {status === 'out_for_delivery'
                                ? 'Your delivery partner is moving towards your location.'
                                : `Current Status: ${status?.replace(/_/g, ' ')}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingMap;
