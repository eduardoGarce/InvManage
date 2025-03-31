const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        }
        await axios.post('/api/login', user)
        window.location.pathname = `/dashboard/`
    } catch (error) {
        emailInput.classList.add('text-[#F23F3F]', 'border-[#F23F3F]');
        passwordInput.classList.add('text-[#F23F3F]', 'border-[#F23F3F]');
        setTimeout(() => {
            emailInput.classList.remove('text-[#F23F3F]', 'border-[#F23F3F]');
            passwordInput.classList.remove('text-[#F23F3F]', 'border-[#F23F3F]');
        }, 3000);

        console.log(error);
        //Mostrar el texto de error y se expande el alto del texto de error
        errorText.innerHTML = error.response.data.error;
        errorText.classList.add('h-4');
    }
})