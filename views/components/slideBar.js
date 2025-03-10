const slideBar = document.querySelector('#slideBar');

const createSlideBar = () => {
    slideBar.innerHTML = `
        <div class="flex flex-row items-center justify-around m-auto max-w-[60rem] h-full">
            <button id="entries-btn" class="border-2 border-white/90 hover:border-white rounded-full px-[6%] md:px-[10%] font-semibold text-lg text-white hover:scale-110 transition-all">
                <p>Entradas</p>
            </button>
            <button id="stock-btn" class="border-2 border-white/90 hover:border-white rounded-full px-[6%] md:px-[10%] font-semibold text-lg text-white hover:scale-110 transition-all">
                <p>Stock</p>
            </button>
            <button id="sales-btn" class="border-2 border-white/90 hover:border-white rounded-full px-[6%] md:px-[10%] font-semibold text-lg text-white hover:scale-110 transition-all">
                <p>Salidas</p>
            </button>
        </div>
    `;
};

//Determino que nav voy a crear en base al path que tenga la url
if (window.location.pathname === '/entries/') {
    createSlideBar();

    const entriesBtn = document.querySelector('#entries-btn');
    entriesBtn.classList.remove('text-white');
    entriesBtn.classList.add('bg-white', 'text-[#09041C]', 'scale-110');

} else if (window.location.pathname === '/stock/') {
    createSlideBar();

    const stockBtn = document.querySelector('#stock-btn');
    stockBtn.classList.remove('text-white');
    stockBtn.classList.add('bg-white', 'text-[#09041C]', 'scale-110');

} else if (window.location.pathname === '/sales/') {
    createSlideBar();

    const salesBtn = document.querySelector('#sales-btn');
    salesBtn.classList.remove('text-white');
    salesBtn.classList.add('bg-white', 'text-[#09041C]', 'scale-110');
}

const entriesBtn = document.querySelector('#entries-btn');
const stockBtn = document.querySelector('#stock-btn');
const salesBtn = document.querySelector('#sales-btn');

entriesBtn.addEventListener('click', e => {
    window.location.pathname = '/entries';
});

stockBtn.addEventListener('click', e => {
    window.location.pathname = '/stock';
});

salesBtn.addEventListener('click', e => {
    window.location.pathname = '/sales';
});