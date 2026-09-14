/**
 * Application Configuration & Environment
 */
export const ENV = {
    API_URL: window.ENV?.API_URL || 'http://localhost:8000',
    STORAGE_KEY: 'solar_prediction_history'
};

/**
 * Solar Prediction API Service
 * Endpoint: POST {API_URL}/get-prediction
 * Request Body:
 * {
 *   "ghi": float,
 *   "humidity": float,
 *   "temp": float,
 *   "is_sun": int (0 or 1),
 *   "sunlightTime": float,
 *   "dayLength": float,
 *   "SunlightTime_daylength": float
 * }
 * Response Body:
 * {
 *   "Energy": float
 * }
 */
export async function predictSolarEnergy(payload) {
    const endpoint = `${ENV.API_URL}/get-prediction`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Inference request failed [${response.status}]: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract exact "Energy" attribute from API response
    const rawValue = typeof data.Energy === 'number' ? data.Energy : 0;
    
    return {
        raw: rawValue,
        energy: Math.max(0, rawValue) // Solar output cannot be physically negative
    };
}

/**
 * Historical Data Service
 */
export const HistoryService = {
    getAll() {
        try {
            return JSON.parse(localStorage.getItem(ENV.STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    },
    save(entry) {
        const history = this.getAll();
        history.unshift({
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString(),
            ...entry
        });
        if (history.length > 20) history.pop();
        localStorage.setItem(ENV.STORAGE_KEY, JSON.stringify(history));
        return history;
    },
    clear() {
        localStorage.removeItem(ENV.STORAGE_KEY);
        return [];
    }
};

/**
 * Feature Contribution Attribution
 */
export function calculateAttributions(params) {
    const weights = [
        { name: 'Global Horizontal Irradiance (GHI)', value: params.ghi, weight: 0.35 },
        { name: 'Sunlight Duration', value: params.sunlightTime, weight: 0.25 },
        { name: 'Temperature Exposure', value: params.temp, weight: 0.15 },
        { name: 'Sunlight / Day Length Ratio', value: params.SunlightTime_daylength, weight: 0.15 },
        { name: 'Relative Humidity', value: params.humidity, weight: -0.10 }
    ];

    return weights.map(item => ({
        ...item,
        impact: (item.weight * 100).toFixed(1),
        isPositive: item.weight > 0
    }));
}

/**
 * Export Utilities
 */
export const ExportService = {
    toCSV(records) {
        if (!records.length) return alert('No history to export.');
        const headers = ['Time', 'Energy_Wh', 'Raw_Energy', 'GHI', 'Temp', 'Humidity', 'IsSun', 'SunlightTime', 'DayLength', 'Ratio'];
        const rows = records.map(r => [
            `"${r.formattedTime}"`,
            r.energy,
            r.rawEnergy,
            r.params?.ghi ?? '',
            r.params?.temp ?? '',
            r.params?.humidity ?? '',
            r.params?.is_sun ?? '',
            r.params?.sunlightTime ?? '',
            r.params?.dayLength ?? '',
            r.params?.SunlightTime_daylength ?? ''
        ]);
        
        const blob = new Blob([[headers.join(','), ...rows.map(e => e.join(','))].join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar_predictions_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    },

    toPDF(containerId) {
        const element = document.getElementById(containerId);
        if (!element || typeof html2pdf === 'undefined') return alert('html2pdf library is required.');
        html2pdf().set({
            margin: 10,
            filename: `solar-prediction-report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        }).from(element).save();
    }
};