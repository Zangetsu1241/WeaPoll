import React, { useEffect } from 'react';
import { MapContainer as PacketMap, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import type { Coordinates, MedicalFacility } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Medical
const medicalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    coords: Coordinates;
    onLocationSelect: (coords: Coordinates) => void;
    facilities?: MedicalFacility[];
}

// Component to handle click events on the map
function LocationMarker({ onLocationSelect, coords }: { onLocationSelect: (c: Coordinates) => void, coords: Coordinates }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo([coords.lat, coords.lng], map.getZoom());
    }, [coords, map]);

    useMapEvents({
        click(e) {
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return coords ? <Marker position={[coords.lat, coords.lng]} /> : null;
}

const MapContainer: React.FC<MapProps> = ({ coords, onLocationSelect, facilities = [] }) => {
    // Check if map is mounted (client-side)
    const [isMounted, setIsMounted] = React.useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-navy-surface">
                <span className="text-text-muted animate-pulse">Loading Maps...</span>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-hidden rounded-2xl border border-navy-border shadow-navy">
            <PacketMap center={[coords.lat, coords.lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} coords={coords} />

                {facilities.map(fac => (
                    <Marker key={fac.id} position={[fac.coords.lat, fac.coords.lng]} icon={medicalIcon}>
                        <Popup>
                            <div className="text-navy-main p-1 bg-white rounded-md">
                                <strong className="block text-sm font-bold">{fac.name}</strong>
                                <span className="text-xs text-gray-600 block">{fac.type}</span>
                                <span className="text-xs text-gray-500 block">{fac.distance} away</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </PacketMap>
        </div>
    );
};

export default MapContainer;
