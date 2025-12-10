export const getAQIColorClass = (value: number) => {
    if (value <= 50) return 'text-aqi-good';
    if (value <= 100) return 'text-aqi-moderate';
    if (value <= 150) return 'text-aqi-sensitive';
    if (value <= 200) return 'text-aqi-unhealthy';
    if (value <= 300) return 'text-aqi-very_unhealthy';
    return 'text-aqi-hazardous';
};

// Map metric values to intensity colors
export const getMetricColorClass = (type: 'pm2_5' | 'pm10' | 'no2' | 'o3' | 'temp' | 'humidity' | 'wind' | 'uv', value: number) => {
    switch (type) {
        case 'pm2_5':
            if (value <= 12) return 'text-aqi-good';
            if (value <= 35) return 'text-aqi-moderate';
            if (value <= 55) return 'text-aqi-sensitive';
            if (value <= 150) return 'text-aqi-unhealthy';
            if (value <= 250) return 'text-aqi-very_unhealthy';
            return 'text-aqi-hazardous';

        case 'pm10':
            if (value <= 54) return 'text-aqi-good';
            if (value <= 154) return 'text-aqi-moderate';
            if (value <= 254) return 'text-aqi-sensitive';
            if (value <= 354) return 'text-aqi-unhealthy';
            if (value <= 424) return 'text-aqi-very_unhealthy';
            return 'text-aqi-hazardous';

        case 'no2': // ppb approx
            if (value <= 53) return 'text-aqi-good';
            if (value <= 100) return 'text-aqi-moderate';
            if (value <= 360) return 'text-aqi-sensitive'; // Simplified
            return 'text-aqi-unhealthy';

        case 'o3': // ppb approx
            if (value <= 54) return 'text-aqi-good';
            if (value <= 70) return 'text-aqi-moderate';
            if (value <= 85) return 'text-aqi-sensitive';
            if (value <= 105) return 'text-aqi-unhealthy';
            return 'text-aqi-very_unhealthy';

        case 'temp': // Celsius - Logic: Comfortable is Good, Extremes are Bad
            if (value < 0) return 'text-aqi-hazardous'; // Freezing
            if (value < 10) return 'text-aqi-sensitive'; // Cold
            if (value < 18) return 'text-aqi-moderate'; // Cool
            if (value <= 28) return 'text-aqi-good'; // Ideal
            if (value <= 32) return 'text-aqi-moderate'; // Warm
            if (value <= 38) return 'text-aqi-sensitive'; // Hot
            return 'text-aqi-hazardous'; // Extreme Heat

        case 'humidity': // %
            if (value < 20) return 'text-aqi-unhealthy'; // Too Dry
            if (value < 30) return 'text-aqi-moderate';
            if (value <= 60) return 'text-aqi-good'; // Ideal
            if (value <= 70) return 'text-aqi-moderate';
            if (value <= 80) return 'text-aqi-sensitive';
            return 'text-aqi-unhealthy'; // Too Humid

        case 'wind': // km/h
            if (value < 20) return 'text-aqi-good';
            if (value < 40) return 'text-aqi-moderate';
            if (value < 60) return 'text-aqi-sensitive';
            if (value < 90) return 'text-aqi-unhealthy';
            return 'text-aqi-hazardous';

        case 'uv':
            if (value <= 2) return 'text-aqi-good';
            if (value <= 5) return 'text-aqi-moderate';
            if (value <= 7) return 'text-aqi-sensitive';
            if (value <= 10) return 'text-aqi-unhealthy';
            return 'text-aqi-hazardous'; // Extreme

        default:
            return 'text-text-primary';
    }
};
