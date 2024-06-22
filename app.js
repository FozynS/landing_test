const inputs = document.querySelectorAll(".input");
const btnSignup = document.querySelector('.btn_signup');

const validateField = (input) => {
  const type = input.getAttribute('data-type');
  const value = input.value.trim();
  let isValid = false;

  if (type === 'full_name') {
    isValid = value.split(' ').length >= 2;
  } else if (type === 'phone') {
    isValid = /^\+?\d{10,15}$/.test(value);
  } else if (type === 'email') {
    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  return isValid;
};

const validateInputs = () => {
  let allFieldsValid = true;

  inputs.forEach(input => {
    if (!validateField(input)) {
      allFieldsValid = false;
    }
  });

  if (allFieldsValid) {
    btnSignup.removeAttribute('disabled');
  } else {
    btnSignup.setAttribute('disabled', '');
  }
};

const handleChangeOnInputs = (event) => {
  const clickedItem = event.target;

  if (clickedItem.classList.contains('input')) {
    if (clickedItem.value.trim() === '' || !validateField(clickedItem)) {
      clickedItem.style.border = '2px solid red';
    } else {
      clickedItem.style.border = '';
    }
  }

  validateInputs();
};


const onSendData = () => {
  const fullNameInput = document.querySelector('[data-type="full_name"]');
  const emailInput = document.querySelector('[data-type="email"]');
  const phoneInput = document.querySelector('[data-type="phone"]');

  const countryCodeSelect = document.getElementById('country_code');
  const countryCode = countryCodeSelect.options[countryCodeSelect.selectedIndex].value.trim();

  const phoneNumber = countryCode + phoneInput.value.trim();

  if (!fullNameInput || !phoneNumber || !emailInput) {
    alert('Пожалуйста, заполните все поля формы.');
    return;
  }

  const message = `
    Новая заявка с формы:
    Имя и фамилия: ${fullNameInput.value}
    Номер телефона: ${phoneNumber}
    Email: ${emailInput.value}
  `;

  fetch('https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: '@rgb_hr',
      text: message,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    alert('Заявка отправлена успешно!');
    inputs.forEach(input => input.value = '');
    btnSignup.disabled = true;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    alert('Произошла ошибка при отправке заявки.');
  });
};

inputs.forEach(input => {
  input.addEventListener('blur', handleChangeOnInputs);
})

btnSignup.addEventListener('click', onSendData)
