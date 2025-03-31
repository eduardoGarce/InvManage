const productsAlertsList = document.querySelector('#products-alerts-list');
const productsAlertsContainer = document.querySelector('#products-alerts-container');

//Declarar una funcion autoinvocada en la que se desarrollara toda la logica del renderizado de la lista con los productos con bajo stock
( async () => {
    try {
        //realizar una petición a la api para obtener todos los productos pertenecientes al stock
        const { data } = await axios.get('/api/stock');
        //Detener la ejecución en caso de que no existan productos en stock
        if (!data) return;

        //Limpiar la lista
        productsAlertsList.innerHTML = '';

        for (const product of data) {
            //Saltar esta iteración en caso de que el producto no tenga bajo stock
            if (product.quantity < product.alertAmounts[1]) {
                //Crear, añadir id, añadir clases, añadir su contenido y añadir a la lista de alerta el producto
                const li = document.createElement('li');
                li.id = product.id; // onclick="location.href='/stock'" role="link" tabindex="0"
                li.onclick = 'location.href=/stock';
                li.role = 'link';
                li.tabIndex = '0';
                li.classList.add('flex', 'items-center', 'w-fit', 'bg-[#F23F3F]/30', 'hover:scale-105', 'p-2', 'rounded-xl', 'transition-all', 'cursor-pointer');
                li.innerHTML = `
                    <svg class="size-10 mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>                      
                    <div class="flex-col px-2 gap-2">
                        <h3>${product.name}</h3>
                        <p>Codigo: ${product.code}</p>
                        <p>Solo quedán ${product.quantity + ' ' + product.unit}</p>
                    </div>
                `;
                productsAlertsList.prepend(li);
            }
        }
        //Mostrar el div que contendrá los productos con bajo stock en caso de que este existan productos en ese estado
        productsAlertsList.children.length > 0 ? productsAlertsContainer.classList.remove('hidden') : document.querySelector('footer').classList.replace('relative', 'fixed');

    } catch (error) {
        window.location.pathname = '/login';
    }
})();

//Determina si el contenedor principal estará centrado en base a la altura de la pantalla
window.addEventListener('resize', () => {
    //Si la altura de la pantalla es menor a 710 pixeles entonces dejara de centrar el contenido para que no se expanda hacia arriba y deje de ser visible
    if (window.innerHeight < 710) {
        document.querySelector('main').classList.remove('justify-center');
    } else {
        document.querySelector('main').classList.add('justify-center');
    }
});
//Determina si el contenedor principal estará centrado en base a la altura de la pantalla cada vez que se termina de cargar el DOM
window.onload = () => {
    //Si la altura de la pantalla es menor a 710 pixeles entonces dejara de centrar el contenido para que no se expanda hacia arriba y deje de ser visible
    if (window.innerHeight < 710) {
        document.querySelector('main').classList.remove('justify-center');
    } else {
        document.querySelector('main').classList.add('justify-center');
    }
};