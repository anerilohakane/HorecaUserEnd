'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';

// Define the type locally to avoid import issues
interface ViewStateChangeEvent {
    viewState: {
        latitude: number;
        longitude: number;
        zoom: number;
        pitch: number;
        bearing: number;
    };
}
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FtZWVyMjcyOSIsImEiOiJjbWswdWtmMGMwMDdmM2Zxc3ludjF2eTZkIn0._DvjqPsOzDNAlUIPs4xJlQ";

interface AddressMapProps {
    onLocationSelect: (location: any) => void;
    initialLat?: number;
    initialLng?: number;
}

const AddressMap: React.FC<AddressMapProps> = ({ onLocationSelect, initialLat = 28.6139, initialLng = 77.2090 }) => {
    const [viewState, setViewState] = useState({
        latitude: initialLat,
        longitude: initialLng,
        zoom: 16, // High zoom for 3D effect
        pitch: 60, // Tilted for 3D effect
        bearing: 0
    });
    const [loadingAddress, setLoadingAddress] = useState(false);

    // Debounce function to avoid too many API calls while dragging
    const fetchAddress = async (lat: number, lng: number) => {
        setLoadingAddress(true);
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,poi`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const context = feature.context || [];

                const city = context.find((c: any) => c.id.includes('place'))?.text || '';
                const state = context.find((c: any) => c.id.includes('region'))?.text || '';
                const pincode = context.find((c: any) => c.id.includes('postcode'))?.text || '';
                const country = context.find((c: any) => c.id.includes('country'))?.text || '';
                const street = feature.place_name.split(',')[0];

                const fullAddress = {
                    addressLine1: street,
                    city,
                    state,
                    pincode,
                    country,
                    lat,
                    lng,
                    fullAddress: feature.place_name
                };

                console.log("📍 Location Found:", fullAddress);
                onLocationSelect(fullAddress);
            }
        } catch (error) {
            console.error("Failed to fetch address:", error);
        } finally {
            setLoadingAddress(false);
        }
    };

    const handleMoveEnd = useCallback((evt: ViewStateChangeEvent) => {
        const { latitude, longitude } = evt.viewState;
        setViewState(evt.viewState);
        fetchAddress(latitude, longitude);
    }, []);

    return (
        <div className="w-full h-[400px] relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <Map
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                onMoveEnd={handleMoveEnd}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/standard"
                style={{ width: '100%', height: '100%' }}
                maxPitch={85}
            >
                {/* Controls */}
                <NavigationControl position="top-right" />
                <GeolocateControl position="top-right" />

                {/* Center Pin Marker (Fixed in center of view) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center pb-8">
                    <div className="relative">
                        <MapPin size={40} className="text-[#D97706] drop-shadow-lg fill-white" />
                        <div className="w-2 h-2 bg-black/30 rounded-full blur-[2px] absolute bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                </div>

                {/* Address Toast */}
                {loadingAddress && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-medium z-10 animate-pulse">
                        Fetching location...
                    </div>
                )}
            </Map>
        </div>
    );
};

export default AddressMap;
