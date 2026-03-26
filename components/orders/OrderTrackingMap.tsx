'use client';

import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Truck } from 'lucide-react';
import { animate, motion } from 'framer-motion';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FtZWVyMjcyOSIsImEiOiJjbWswdWtmMGMwMDdmM2Zxc3ludjF2eTZkIn0._DvjqPsOzDNAlUIPs4xJlQ";

interface OrderTrackingMapProps {
    destination: {
        lat: number;
        lng: number;
        address?: string;
    };
    status: string;
}

const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ destination, status }) => {
    const mapRef = useRef<MapRef>(null);
    const [driverLoc, setDriverLoc] = useState<{ lat: number; lng: number } | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Initial driver start point (simulate 2-3km away)
    const startPoint = {
        lat: destination.lat - 0.015,
        lng: destination.lng - 0.015
    };

    // State for bearing (rotation)
    const [driverBearing, setDriverBearing] = useState<number>(0);

    // Poll for driver location every 4 seconds
    useEffect(() => {
        if (!['out_for_delivery', 'shipped'].includes(status)) {
            setDriverLoc(null);
            return;
        }

        const pollLocation = async () => {
            try {
                // Get Order ID from URL
                const pathParts = window.location.pathname.split('/');
                const orderId = pathParts[pathParts.length - 1]; // /orders/[id]

                if (!orderId) return;

                // Use environment variable for production
                const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";
                const res = await fetch(`${backendUrl}/api/order?id=${orderId}`);
                const data = await res.json();
                
                if (data.success && data.order?.driverLocation) {
                    const loc = data.order.driverLocation;
                    if (loc.lat && loc.lng) {
                        setDriverLoc({ lat: loc.lat, lng: loc.lng });
                        if (loc.bearing !== undefined) setDriverBearing(loc.bearing);
                    }
                } else if (!driverLoc && ['out_for_delivery', 'shipped'].includes(status)) {
                    // Fallback: Use simulated start point if no location in DB but out for delivery
                    setDriverLoc(startPoint);
                    setDriverBearing(45); // Point towards destination-ish
                }
            } catch (err) {
                console.error("Polling Error:", err);
            }
        };

        // Initial fetch
        pollLocation();

        const interval = setInterval(pollLocation, 4000); // 4 seconds

        return () => clearInterval(interval);
    }, [status]);

    // Determine simplified bounds when map loads or status changes
    useEffect(() => {
        if (mapLoaded && mapRef.current) {
            if (driverLoc) {
                // Safely access map instance
                const mapInstance = mapRef.current.getMap();
                if (mapInstance) {
                    try {
                        mapInstance.fitBounds(
                            [
                                [Math.min(driverLoc.lng, destination.lng), Math.min(driverLoc.lat, destination.lat)],
                                [Math.max(driverLoc.lng, destination.lng), Math.max(driverLoc.lat, destination.lat)]
                            ],
                            {
                                padding: { top: 160, bottom: 120, left: 50, right: 50 },
                                duration: 2000
                            }
                        );
                    } catch (e) {
                        console.error("Error fitting bounds:", e);
                    }
                }
            } else {
                mapRef.current.flyTo({
                    center: [destination.lng, destination.lat],
                    zoom: 15,
                    duration: 2000
                });
            }
        }
    }, [mapLoaded, driverLoc === null]); // Trigger when driverLoc availability changes

    // Route Line GeoJSON
    const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: driverLoc ? [
                [driverLoc.lng, driverLoc.lat],
                [destination.lng, destination.lat]
            ] : []
        }
    };

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: destination.lat,
                    longitude: destination.lng,
                    zoom: 15,
                    pitch: 60, // 3D view
                    bearing: -17.6,
                }}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/standard"
                style={{ width: '100%', height: '100%' }}
                maxPitch={85}
                onLoad={() => setMapLoaded(true)}
                attributionControl={false}
            >
                {/* Destination Marker */}
                <Marker latitude={destination.lat} longitude={destination.lng} anchor="bottom">
                    <div className="relative flex flex-col items-center group">
                        {/* Floating Label - Moved to top so MapPin is at the bottom anchor */}
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1 mb-2 rounded-full text-xs font-black shadow-lg border border-gray-100 transform transition-all group-hover:scale-110 uppercase tracking-wider">
                            Delivery Location
                        </div>
                        <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute bottom-4 opacity-20"></div>
                        <div className="bg-white p-2.5 rounded-full shadow-xl border-2 border-orange-500 z-10 relative">
                            <MapPin className="text-orange-600 fill-orange-100" size={24} />
                        </div>
                    </div>
                </Marker>

                {/* Driver Marker - Premium Navigation UI */}
                {driverLoc && (
                    <Marker
                        latitude={driverLoc.lat}
                        longitude={driverLoc.lng}
                        anchor="center"
                    >
                        <div className="relative flex items-center justify-center cursor-pointer z-[100] group w-12 h-12">
                            
                            {/* In-built Status Beacon (Pulsing Halo) */}
                            <div className="absolute w-14 h-14 bg-orange-500/20 rounded-full animate-pulse blur-lg -z-10" />
                            <div className="absolute w-10 h-10 border-[1.5px] border-orange-500/40 rounded-full animate-ping -z-10 duration-1000" />

                            {/* Floating Label - Absolute positioned to not shift the icon's center */}
                            <div className="absolute -top-12 bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-xl text-[9px] font-black shadow-lg border border-white/50 whitespace-nowrap uppercase tracking-[0.15em] transition-all group-hover:-translate-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Live Tracking
                                </div>
                            </div>

                            {/* Navigation Directional Container */}
                            <motion.div 
                                style={{ rotate: driverBearing }}
                                className="relative flex items-center justify-center transition-all duration-700 ease-in-out"
                            >
                                {/* Directional Heading Cone */}
                                <div className="absolute -top-10 w-12 h-20 bg-gradient-to-t from-orange-500/30 to-transparent opacity-60" 
                                     style={{ clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)', filter: 'blur(1.5px)' }} 
                                />

                                {/* Orange-Themed Vehicle Marker (Matches Brand Colors) */}
                                <div className="bg-[#F97316] w-12 h-12 rounded-full shadow-[0_15px_35px_rgb(249,115,22,0.35)] border-[3px] border-white flex items-center justify-center relative z-10">
                                    {/* -rotate-90 to make truck face UP by default (matching the indicator) */}
                                    <Truck className="text-white fill-white/20 transform -rotate-90" size={24} />
                                    
                                    {/* Direction Indicator */}
                                    <div className="absolute -top-1.5 w-3 h-3 bg-white rotate-45 border-2 border-[#F97316] rounded-sm shadow-sm" />
                                </div>
                            </motion.div>
                        </div>
                    </Marker>
                )}

                {/* Route Line */}
                {driverLoc && mapLoaded && (
                    <Source id="route-source" type="geojson" data={routeGeoJSON as any}>
                        <Layer
                            id="route-layer"
                            type="line"
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round'
                            }}
                            paint={{
                                'line-color': '#F97316', // Orange-500
                                'line-width': 6,
                                'line-opacity': 0.9
                            }}
                        />
                        <Layer
                            id="route-layer-dashed"
                            type="line"
                            paint={{
                                'line-color': '#ffffff',
                                'line-width': 2,
                                'line-opacity': 0.6,
                                'line-dasharray': [2, 2]
                            }}
                        />
                    </Source>
                )}
            </Map>
        </div>
    );
};

export default OrderTrackingMap;
