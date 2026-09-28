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

const ownerLeadForm = document.querySelector('#owner-lead-form');
const ownerFormStatus = document.querySelector('#owner-form-status');
const ownerPhoneInput = document.querySelector('#owner-phone');

const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const areaCode = digits.slice(0, 2);
    const subscriber = digits.slice(2);

    if (digits.length <= 2) {
        return digits ? `(${areaCode}` : '';
    }

    const firstPart = subscriber.slice(0, 5);
    const lastPart = subscriber.slice(5);
    return `(${areaCode}) ${firstPart}${lastPart ? `-${lastPart}` : ''}`;
};

ownerPhoneInput.addEventListener('input', () => {
    const cursorPosition = ownerPhoneInput.selectionStart ?? ownerPhoneInput.value.length;
    const digitsBeforeCursor = ownerPhoneInput.value.slice(0, cursorPosition).replace(/\D/g, '').length;
    ownerPhoneInput.value = formatPhone(ownerPhoneInput.value);

    let formattedCursorPosition = 0;
    let countedDigits = 0;

    while (formattedCursorPosition < ownerPhoneInput.value.length && countedDigits < digitsBeforeCursor) {
        if (/\d/.test(ownerPhoneInput.value[formattedCursorPosition])) {
            countedDigits += 1;
        }
        formattedCursorPosition += 1;
    }

    ownerPhoneInput.setSelectionRange(formattedCursorPosition, formattedCursorPosition);
});

ownerLeadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(ownerLeadForm);
    const optionalDetails = [
        formData.get('purpose') ? `Interesse: ${formData.get('purpose')}` : '',
        formData.get('propertyType') ? `Tipo de imóvel: ${formData.get('propertyType')}` : '',
        formData.get('location') ? `Localização: ${formData.get('location')}` : '',
        formData.get('message') ? `Detalhes: ${formData.get('message')}` : ''
    ].filter(Boolean);
    const message = [
        'Olá Olicarpe Imóveis! Quero anunciar meu imóvel.',
        '',
        `Nome: ${formData.get('name')}`,
        `Telefone: ${formData.get('phone')}`,
        ...optionalDetails
    ].join('\n');

    const whatsappUrl = `https://wa.me/5585997980123?text=${encodeURIComponent(message)}`;
    ownerFormStatus.textContent = 'Abrindo o WhatsApp com os dados preenchidos para você revisar e enviar.';
    window.location.assign(whatsappUrl);
});
