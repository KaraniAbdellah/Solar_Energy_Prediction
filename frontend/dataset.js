const dataset = [
    { id: 1, energy: "0.00", ghi: "0.0", temp: "1.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 2, energy: "0.00", ghi: "0.0", temp: "1.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 3, energy: "0.00", ghi: "0.0", temp: "1.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 4, energy: "0.00", ghi: "0.0", temp: "1.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 5, energy: "0.00", ghi: "0.0", temp: "1.7", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 6, energy: "0.00", ghi: "0.0", temp: "1.7", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 7, energy: "0.00", ghi: "0.0", temp: "1.7", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 8, energy: "0.00", ghi: "0.0", temp: "1.7", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 9, energy: "0.00", ghi: "0.0", temp: "1.9", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 10, energy: "0.00", ghi: "0.0", temp: "1.9", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 11, energy: "0.00", ghi: "0.0", temp: "1.9", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 12, energy: "0.00", ghi: "0.0", temp: "1.9", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 13, energy: "0.00", ghi: "0.0", temp: "2.0", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 14, energy: "0.00", ghi: "0.0", temp: "2.0", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 15, energy: "0.00", ghi: "0.0", temp: "2.0", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 16, energy: "0.00", ghi: "0.0", temp: "2.0", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 17, energy: "0.00", ghi: "0.0", temp: "2.5", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 18, energy: "0.00", ghi: "0.0", temp: "2.5", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 19, energy: "0.00", ghi: "0.0", temp: "2.5", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 20, energy: "0.00", ghi: "0.0", temp: "2.5", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 21, energy: "0.00", ghi: "0.0", temp: "2.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 22, energy: "0.00", ghi: "0.0", temp: "2.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 23, energy: "0.00", ghi: "0.0", temp: "2.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 24, energy: "0.00", ghi: "0.0", temp: "2.6", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 25, energy: "0.00", ghi: "0.0", temp: "2.8", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 26, energy: "0.00", ghi: "0.0", temp: "2.8", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 27, energy: "0.00", ghi: "0.0", temp: "2.8", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 28, energy: "0.00", ghi: "0.0", temp: "2.8", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 29, energy: "0.00", ghi: "0.0", temp: "2.9", humidity: "100.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 30, energy: "0.00", ghi: "0.2", temp: "2.9", humidity: "100.0", isSun: 1, sunlightTime: "15.0", dayLength: "450.0", ratio: "0.030" },
    { id: 31, energy: "0.00", ghi: "2.7", temp: "2.9", humidity: "100.0", isSun: 1, sunlightTime: "30.0", dayLength: "450.0", ratio: "0.070" },
    { id: 32, energy: "0.00", ghi: "6.4", temp: "2.9", humidity: "100.0", isSun: 1, sunlightTime: "45.0", dayLength: "450.0", ratio: "0.100" },
    { id: 33, energy: "5.00", ghi: "10.6", temp: "3.5", humidity: "99.0", isSun: 1, sunlightTime: "60.0", dayLength: "450.0", ratio: "0.130" },
    { id: 34, energy: "33.00", ghi: "6.0", temp: "3.5", humidity: "99.0", isSun: 1, sunlightTime: "75.0", dayLength: "450.0", ratio: "0.170" },
    { id: 35, energy: "44.00", ghi: "2.8", temp: "3.5", humidity: "99.0", isSun: 1, sunlightTime: "90.0", dayLength: "450.0", ratio: "0.200" },
    { id: 36, energy: "61.00", ghi: "3.1", temp: "3.5", humidity: "99.0", isSun: 1, sunlightTime: "105.0", dayLength: "450.0", ratio: "0.230" },
    { id: 37, energy: "65.00", ghi: "3.5", temp: "3.6", humidity: "97.0", isSun: 1, sunlightTime: "120.0", dayLength: "450.0", ratio: "0.270" },
    { id: 38, energy: "83.00", ghi: "3.8", temp: "3.6", humidity: "97.0", isSun: 1, sunlightTime: "135.0", dayLength: "450.0", ratio: "0.300" },
    { id: 39, energy: "69.00", ghi: "4.1", temp: "3.6", humidity: "97.0", isSun: 1, sunlightTime: "150.0", dayLength: "450.0", ratio: "0.330" },
    { id: 40, energy: "98.00", ghi: "4.3", temp: "3.6", humidity: "97.0", isSun: 1, sunlightTime: "165.0", dayLength: "450.0", ratio: "0.370" },
    { id: 41, energy: "138.00", ghi: "4.5", temp: "3.8", humidity: "93.0", isSun: 1, sunlightTime: "180.0", dayLength: "450.0", ratio: "0.400" },
    { id: 42, energy: "161.00", ghi: "4.7", temp: "3.8", humidity: "93.0", isSun: 1, sunlightTime: "195.0", dayLength: "450.0", ratio: "0.430" },
    { id: 43, energy: "119.00", ghi: "6.4", temp: "3.8", humidity: "93.0", isSun: 1, sunlightTime: "210.0", dayLength: "450.0", ratio: "0.470" },
    { id: 44, energy: "95.00", ghi: "11.9", temp: "3.8", humidity: "93.0", isSun: 1, sunlightTime: "225.0", dayLength: "450.0", ratio: "0.500" },
    { id: 45, energy: "105.00", ghi: "12.5", temp: "3.8", humidity: "91.0", isSun: 1, sunlightTime: "240.0", dayLength: "450.0", ratio: "0.530" },
    { id: 46, energy: "124.00", ghi: "10.4", temp: "3.8", humidity: "91.0", isSun: 1, sunlightTime: "255.0", dayLength: "450.0", ratio: "0.570" },
    { id: 47, energy: "105.00", ghi: "11.3", temp: "3.8", humidity: "91.0", isSun: 1, sunlightTime: "270.0", dayLength: "450.0", ratio: "0.600" },
    { id: 48, energy: "67.00", ghi: "11.8", temp: "3.8", humidity: "91.0", isSun: 1, sunlightTime: "285.0", dayLength: "450.0", ratio: "0.630" },
    { id: 49, energy: "95.00", ghi: "11.1", temp: "3.8", humidity: "90.0", isSun: 1, sunlightTime: "300.0", dayLength: "450.0", ratio: "0.670" },
    { id: 50, energy: "79.00", ghi: "11.3", temp: "3.8", humidity: "90.0", isSun: 1, sunlightTime: "315.0", dayLength: "450.0", ratio: "0.700" },
    { id: 51, energy: "42.00", ghi: "6.0", temp: "3.8", humidity: "90.0", isSun: 1, sunlightTime: "330.0", dayLength: "450.0", ratio: "0.730" },
    { id: 52, energy: "42.00", ghi: "3.7", temp: "3.8", humidity: "90.0", isSun: 1, sunlightTime: "345.0", dayLength: "450.0", ratio: "0.770" },
    { id: 53, energy: "55.00", ghi: "11.7", temp: "3.9", humidity: "89.0", isSun: 1, sunlightTime: "360.0", dayLength: "450.0", ratio: "0.800" },
    { id: 54, energy: "96.00", ghi: "10.2", temp: "3.9", humidity: "89.0", isSun: 1, sunlightTime: "375.0", dayLength: "450.0", ratio: "0.830" },
    { id: 55, energy: "62.00", ghi: "8.3", temp: "3.9", humidity: "89.0", isSun: 1, sunlightTime: "390.0", dayLength: "450.0", ratio: "0.870" },
    { id: 56, energy: "102.00", ghi: "10.0", temp: "3.9", humidity: "89.0", isSun: 1, sunlightTime: "405.0", dayLength: "450.0", ratio: "0.900" },
    { id: 57, energy: "58.00", ghi: "7.5", temp: "3.8", humidity: "89.0", isSun: 1, sunlightTime: "420.0", dayLength: "450.0", ratio: "0.930" },
    { id: 58, energy: "30.00", ghi: "3.7", temp: "3.8", humidity: "89.0", isSun: 1, sunlightTime: "435.0", dayLength: "450.0", ratio: "0.970" },
    { id: 59, energy: "6.00", ghi: "0.8", temp: "3.8", humidity: "89.0", isSun: 1, sunlightTime: "450.0", dayLength: "450.0", ratio: "1.000" },
    { id: 60, energy: "0.00", ghi: "0.0", temp: "3.8", humidity: "89.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 61, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 62, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 63, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 64, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 65, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 66, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" },
    { id: 67, energy: "0.00", ghi: "0.0", temp: "3.6", humidity: "91.0", isSun: 0, sunlightTime: "0.0", dayLength: "450.0", ratio: "0.000" }
];

let currentPage = 1;
const rowsPerPage = 10;

function renderTable() {
    const tbody = document.querySelector("tbody.divide-y.divide-slate-100.text-slate-700");
    if (!tbody) return;
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = dataset.slice(start, end);

    paginatedItems.forEach(item => {
        const isEnergyZero = parseFloat(item.energy) === 0;
        const energyClass = isEnergyZero ? "text-slate-400" : "text-amber-600";

        const sunBadge = item.isSun === 1
            ? '<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">1</span>'
            : '<span class="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">0</span>';

        const row = document.createElement("tr");
        row.className = "hover:bg-amber-50/50";
        row.innerHTML = `
            <td class="py-2.5 px-3 text-left font-sans text-slate-400 font-bold">${item.id}</td>
            <td class="py-2.5 px-3 font-bold ${energyClass}">${item.energy}</td>
            <td class="py-2.5 px-3">${item.ghi}</td>
            <td class="py-2.5 px-3">${item.temp}</td>
            <td class="py-2.5 px-3">${item.humidity}</td>
            <td class="py-2.5 px-3 font-sans">${sunBadge}</td>
            <td class="py-2.5 px-3">${item.sunlightTime}</td>
            <td class="py-2.5 px-3">${item.dayLength}</td>
            <td class="py-2.5 px-3">${item.ratio}</td>
        `;
        tbody.appendChild(row);
    });

    updatePaginationUI();
}

function updatePaginationUI() {
    const totalPages = Math.ceil(dataset.length / rowsPerPage);
    const startRecord = (currentPage - 1) * rowsPerPage + 1;
    const endRecord = Math.min(currentPage * rowsPerPage, dataset.length);

    const infoDiv = document.getElementById("pagination-info");
    if (infoDiv) {
        infoDiv.innerHTML = `Showing <span class="font-semibold text-slate-700">${startRecord}-${endRecord}</span> of <span class="font-semibold text-slate-700">${dataset.length}</span> records`;
    }

    const btnContainer = document.getElementById("pagination-buttons");
    if (btnContainer) {
        let buttonsHTML = `
            <button onclick="changePage(${currentPage - 1})" class="px-3 py-1.5 rounded-lg border border-slate-200 ${currentPage === 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                buttonsHTML += `<button class="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold">${i}</button>`;
            } else {
                buttonsHTML += `<button onclick="changePage(${i})" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700">${i}</button>`;
            }
        }

        buttonsHTML += `
            <button onclick="changePage(${currentPage + 1})" class="px-3 py-1.5 rounded-lg border border-slate-200 ${currentPage === totalPages ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        btnContainer.innerHTML = buttonsHTML;
    }
}

function changePage(page) {
    const totalPages = Math.ceil(dataset.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

document.addEventListener("DOMContentLoaded", renderTable);