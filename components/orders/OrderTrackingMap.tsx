'use client';

import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { animate } from 'framer-motion';

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

    useEffect(() => {
        if ((status === 'out_for_delivery' || status === 'shipped') && mapLoaded) {
            setDriverLoc(startPoint);

            const controls = animate(0, 0.9, {
                duration: 60,
                ease: "linear",
                onUpdate: (latest) => {
                    const newLat = startPoint.lat + (destination.lat - startPoint.lat) * latest;
                    const newLng = startPoint.lng + (destination.lng - startPoint.lng) * latest;
                    setDriverLoc({ lat: newLat, lng: newLng });
                }
            });

            return () => controls.stop();
        } else {
            setDriverLoc(null);
        }
    }, [status, mapLoaded]);

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
                        <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                        <div className="bg-white p-2.5 rounded-full shadow-xl border-2 border-orange-500 z-10">
                            <MapPin className="text-orange-600 fill-orange-100" size={24} />
                        </div>
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 mt-2 rounded-full text-xs font-bold shadow-lg border border-gray-100 transform transition-all group-hover:scale-110">
                            Delivery Location
                        </div>
                    </div>
                </Marker>

                {/* Driver Marker */}
                {driverLoc && (
                    <Marker latitude={driverLoc.lat} longitude={driverLoc.lng} anchor="center">
                        <div className="relative">
                            <img
                                src="/Truck.png"
                                alt="Driver"
                                className="w-16 h-16 object-contain drop-shadow-2xl transition-transform duration-500"
                                style={{ transform: 'scaleX(-1)' }} // Flip if needed based on direction
                            />
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
