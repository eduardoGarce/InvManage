const navBar = document.querySelector('#navBar');

const createNavSignunp = () => {
    navBar.innerHTML = `
        <div class="flex flex-row items-center justify-between gap-4 px-2 h-full w-fit min-w-36 max-w-56">
            <a href="/login/" class="flex items-center w-fit h-full text-center text-white hover:scale-110 font-semibold cursor-pointer decoration-none transition-all">Login</a>
        </div>
    `;
};

const createNavLogin = () => {
    navBar.innerHTML = `
    <div class="flex flex-row items-center justify-between gap-4 px-2 h-full w-fit min-w-36 max-w-56">
            <a href="/signup/" class="flex items-center w-fit h-full text-center text-white hover:scale-110 font-semibold cursor-pointer decoration-none transition-all">Registrarse</a>
        </div>
    `;
};

const createNavApp = () => {
    navBar.innerHTML = `
        <div class="flex flex-row items-center justify-between gap-4 px-2 h-full w-fit min-w-36 max-w-56">
            <a href="/settings/" id="settings-btn" class="flex items-center w-fit h-full hover:scale-110 cursor-pointer decoration-none transition-all">
                <svg  class="flex items-center min-w-6 stroke-[2px] stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </bottom>
            <a class="close-btn flex items-center w-fit h-full text-center text-white hover:scale-110 font-semibold cursor-pointer decoration-none transition-all">Cerrar sesion</a>
        </div>
    `;
};

//Determino que nav voy a crear en base al path que tenga la url
if (window.location.pathname === '/signup/') {
    createNavSignunp()
} else if (window.location.pathname === '/login/') {
    createNavLogin();
} else if (window.location.pathname === '/entries/' || window.location.pathname === '/stock/' || window.location.pathname === '/sales/') {
    createNavApp();
}

const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', async e => {
    try {
        await axios.get('/api/logout');
        window.location.pathname = '/login';
    } catch (error) {
        console.log(error);
    }
});