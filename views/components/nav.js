const navBar = document.querySelector('#navBar');

const createNavSignunp = () => {
    navBar.innerHTML = `
        <a href="/" class="flex justify-center items-center py-2 gap-2 hover:scale-110 text-white cursor-pointer transition-all">
            <img  class="size-6" src="/img/invManageLogo.png" alt="logo">
            <h3>InvManage</h3>
        </a>
        <div class="flex flex-row items-center justify-center gap-4 px-2 h-full w-fit max-w-56">
            <a href="/login/" class="flex items-center w-fit h-full text-center text-white hover:scale-110 font-semibold cursor-pointer decoration-none transition-all">Login</a>
        </div>
    `;
};

const createNavLogin = () => {
    navBar.innerHTML = `
        <a href="/" class="flex justify-center items-center py-2 gap-2 hover:scale-110 text-white cursor-pointer transition-all">
            <img  class="size-6" src="/img/invManageLogo.png" alt="logo">
            <h3>InvManage</h3>
        </a>
        <div class="flex flex-row items-center justify-center gap-4 px-2 h-full w-fit max-w-56">
            <a href="/signup/" class="flex items-center w-fit h-full text-center text-white hover:scale-110 font-semibold cursor-pointer decoration-none transition-all">Registrarse</a>
        </div>
    `;
};

const createNavApp = () => {
    navBar.innerHTML = `
        <a href="/dashboard" class="flex justify-center items-center py-2 gap-2 hover:scale-110 text-white cursor-pointer transition-all">
            <img  class="size-6" src="/img/invManageLogo.png" alt="logo">
            <h3>InvManage</h3>
        </a>
        <div class="flex flex-row items-center justify-center gap-4 px-2 h-full w-fit max-w-56">
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
} else if (window.location.pathname === '/dashboard/') {
    createNavApp();
}

const closeBtn = document.querySelector('.close-btn');

closeBtn?.addEventListener('click', async e => {
    try {
        await axios.get('/api/logout');
        window.location.pathname = '/login';
    } catch (error) {
        console.log(error);
    }
});