const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-navigation');
const serviceDropdown = navigation.querySelector('.services-dropdown');

menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navigation.addEventListener('click', (event) => {
    if (event.target.closest('.services-submenu a')) {
        serviceDropdown.open = false;
    }

    if (event.target.closest('a')) {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
});

document.addEventListener('click', (event) => {
    if (!serviceDropdown.contains(event.target)) {
        serviceDropdown.open = false;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && serviceDropdown.open) {
        serviceDropdown.open = false;
        serviceDropdown.querySelector('summary').focus();
    }
});

const periods = [
    { value: '2026-07', label: 'jul/2026' },
    { value: '2026-08', label: 'ago/2026' },
    { value: '2026-09', label: 'set/2026' }
];

const indexRates = [
    { id: 'igp-di', name: 'IGP-DI', publisher: 'FGV', values: { '2026-07': 3.5758, '2026-08': 2.7570, '2026-09': 2.6134 } },
    { id: 'igp-m', name: 'IGP-M', publisher: 'FGV', values: { '2026-07': 3.1776, '2026-08': 2.7721, '2026-09': 2.1782 } },
    { id: 'ivar', name: 'IVAR', publisher: 'FGV', values: { '2026-07': 4.4776, '2026-08': 5.1040, '2026-09': 5.1145 } },
    { id: 'inpc', name: 'INPC', publisher: 'IBGE', values: { '2026-07': 4.3270, '2026-08': 4.0980, '2026-09': 3.9832 } },
    { id: 'ipca', name: 'IPCA', publisher: 'IBGE', values: { '2026-07': 4.6413, '2026-08': 4.4430, '2026-09': 4.2234 } },
    { id: 'ipc-fipe', name: 'IPC', publisher: 'FIPE', values: { '2026-07': 3.9065, '2026-08': 3.5853, '2026-09': 3.5542 } },
    { id: 'ipc-di', name: 'IPC-DI', publisher: 'FGV', values: { '2026-07': 4.3155, '2026-08': 3.8478, '2026-09': 3.9208 } },
    { id: 'ipca-e', name: 'IPCA-E', publisher: 'IBGE', values: { '2026-07': 4.7977, '2026-08': 4.5156, '2026-09': 4.2435 } }
];

const calculator = document.querySelector('#rent-calculator');
const rentInput = document.querySelector('#rent-value');
const indexChoice = document.querySelector('#index-choice');
const periodChoice = document.querySelector('#period-choice');
const tableBody = document.querySelector('#index-table-body');
const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percentageFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

indexRates.forEach((index) => {
    const option = document.createElement('option');
    option.value = index.id;
    option.textContent = `${index.name} (${index.publisher})`;
    indexChoice.append(option);

    const row = document.createElement('tr');
    const nameCell = document.createElement('th');
    nameCell.scope = 'row';
    nameCell.textContent = `${index.name} (${index.publisher})`;
    row.append(nameCell);

    periods.forEach((period) => {
        const valueCell = document.createElement('td');
        valueCell.textContent = `${percentageFormat.format(index.values[period.value])}%`;
        row.append(valueCell);
    });

    tableBody.append(row);
});

const updateEstimate = () => {
    const selectedIndex = indexRates.find((index) => index.id === indexChoice.value);
    const selectedPeriod = periodChoice.value;
    const currentRent = Number(rentInput.value);

    if (!selectedIndex || !selectedPeriod || !Number.isFinite(currentRent) || currentRent <= 0) {
        return;
    }

    const rate = selectedIndex.values[selectedPeriod];
    const increase = Math.round(currentRent * rate) / 100;
    const adjustedRent = Math.round((currentRent + increase) * 100) / 100;
    const periodLabel = periods.find((period) => period.value === selectedPeriod).label;

    document.querySelector('#adjusted-rent').textContent = currencyFormat.format(adjustedRent);
    document.querySelector('#result-rate').textContent = `${percentageFormat.format(rate)}%`;
    document.querySelector('#result-change').textContent = currencyFormat.format(increase);
    document.querySelector('#result-period').textContent = `${selectedIndex.name} (${selectedIndex.publisher}) · ${periodLabel}`;
};

calculator.addEventListener('submit', (event) => {
    event.preventDefault();
    updateEstimate();
});

calculator.addEventListener('input', updateEstimate);
calculator.addEventListener('change', updateEstimate);
updateEstimate();
