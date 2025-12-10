import type { Coordinates } from "../types";

const API_URL = 'http://localhost:3001/api';

export const getPollutionData = async (coords: Coordinates) => {
    try {
        const res = await fetch(`${API_URL}/pollution?lat=${coords.lat}&lng=${coords.lng}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getWeatherData = async (coords: Coordinates) => {
    try {
        const res = await fetch(`${API_URL}/weather?lat=${coords.lat}&lng=${coords.lng}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getMedicalFacilities = async (coords: Coordinates) => {
    try {
        const res = await fetch(`${API_URL}/facilities?lat=${coords.lat}&lng=${coords.lng}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getCoordinates = async (city: string) => {
    try {
        const res = await fetch(`${API_URL}/geocode?city=${encodeURIComponent(city)}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

// Updated getNews to accept detailed location info, scope, or specific category
export const getNews = async (
    topic: string,
    location?: { city?: string, state?: string, country?: string, scope?: 'global', category?: string }
) => {
    try {
        const params = new URLSearchParams({ topic });
        if (location?.scope === 'global') {
            params.append('scope', 'global');
            if (location.category) {
                params.append('category', location.category);
            }
        } else {
            if (location?.city) params.append('city', location.city);
            if (location?.state) params.append('state', location.state);
            if (location?.country) params.append('country', location.country);
        }

        const res = await fetch(`${API_URL}/news?${params}`);
        if (!res.ok) throw new Error('News fetch failed');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

// NEW: Trade Data
export const getTradeData = async () => {
    try {
        const res = await fetch(`${API_URL}/trade`);
        if (!res.ok) throw new Error('Trade API Error');
        return await res.json();
    } catch (e) {
        console.error(e);
        return { indices: [] };
    }
};
