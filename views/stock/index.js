const settingsBtn = document.querySelector('#settings-btn');
const tablesContainer = document.querySelector('#tables-container');
const searchInput = document.querySelector('#search-input');
const productsFounds = document.querySelector('#products-founds');
const descriptionContainer = document.querySelector('#description-container');
const generalInfoBtn = document.querySelector("#general-info-btn");

//Variable para comprobar el cambio de estados de la pantalla
let isWideScreen = window.innerWidth > 1023;
//Variable para comprobar si se renderizara la lista en su version mobile o destock
let phoneResolution = !isWideScreen;
//Guarda el array de productos pertenecientes al stock
let productsArray = [];

//Funcion que se encarga de cargar todos los productos en las cards y renderizarlas
const loadProducts = async (phoneResolution) => {
    try {
        //Llamada a la api a traves de axios 
        const { data } = await axios.get('/api/stock', {
            withCredentials : true
        });

        //Guardar el array en la variable temporal externa
        productsArray = data;

        //Se itera sobre cada objeto del array con los productos para renderizarlos en la lista
        tablesContainer.innerHTML = '';
        if (!phoneResolution) {
            tablesContainer.innerHTML = `
                <table class="w-full 2xl:w-[90%] rounded-3xl h-full py-4 min-w-80 text-center text-white/90 overflow-y-auto">
                    <thead>
                        <tr class="bg-white/10">
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2 rounded-ss-3xl">Nombre</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Codigo</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Fabricante</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Cantidad</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Precio uni.</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Precio total</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Ultima entrada</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-b-2 rounded-se-3xl">Ultima salida</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                    </tbody>
                </table>
            `;
            tablesContainer.classList.remove('gap-1');
            const tbody = document.querySelector('#tbody');

            data.forEach((product, i) => {
                //Separar la fecha de la hora, convertirlo a string y aplicar reverse para renderizarlo
                const date = product.lastEntryDate.split('T')[0].split('-').reverse().join('/');
                const lastExitDate = product.lastExitDate != null ? product.lastExitDate.split('T')[0].split('-').reverse().join('/') : 'Sin salidas';
                //Creo una variable para guardar el color con el que se va a pintar el background de la fila en base a su numero de alerta
                let bgColor = '';
    
                //Seleccionar el color que va a tener el background como resultado de la comparacion entre la cantidad y los numeros de alerta
                if (product.quantity <= Number(product.alertAmounts[0])) {
                    bgColor = 'bg-[#F23F3F]/80';
                } else if (product.quantity <= Number(product.alertAmounts[1])) {
                    bgColor = 'bg-[#F23F3F]/60';
                } else if (product.quantity <= Number(product.alertAmounts[2])) {
                    bgColor = 'bg-[#F23F3F]/30';
                } else {
                    bgColor = 'bg-[#F23F3F]/10';
                }

                //Creo el tr, le agrego un id, una clase y el contenido html que va a tener
                const tr = document.createElement('tr');

                //Asignar el color correspondiente del semaforo
                tr.classList.add(`${bgColor}`, 'relative', 'transition-all');
                tr.id = product.id;

                tr.innerHTML = `
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2 ${i === 0 ? 'rounded-es-3xl' : ''}">${product.name}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.code}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.manufacturer}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.quantity + ' ' + product.unit}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.unitPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.totalPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${date}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal ${i === 0 ? 'rounded-ee-3xl' : ''}">${lastExitDate}</td>
                `;

                //Añado el tr al tbody para añadir los td posteriormente 
                tbody.prepend(tr);

                if (i === data.length - 1) {
                    const fillTable = document.createElement('div');
                    fillTable.classList.add('w-full', 'h-full', 'bg-transparent');
                    tbody.append(fillTable);
                }
            });
            
            //Se crea y añade el div que va a hacer de tope en el scroll, y el contenedor de la descripcion
            const div = document.createElement('div');
            div.classList.add('h-[15rem]', 'w-full');

            tablesContainer.append(div);
        } else if (phoneResolution) {
            tablesContainer.classList.add('gap-1');
            data.forEach(product => {
                //Separar la fecha de la hora, convertirlo a string y aplicar reverse para renderizarlo
                const lastEntryDate = product.lastEntryDate.split('T')[0].split('-').reverse().join('/');
                const lastExitDate = product.lastExitDate != null ? product.lastExitDate.split('T')[0].split('-').reverse().join('/') : 'Sin salidas';
                //Creo una variable para guardar el color con el que se va a pintar el background de la fila en base a su numero de alerta
                let bgColor = '';
    
                //Seleccionar el color que va a tener el background como resultado de la comparacion entre la cantidad y los numeros de alerta
                if (product.quantity <= Number(product.alertAmounts[0])) {
                    bgColor = 'bg-[#F23F3F]/80';
                } else if (product.quantity <= Number(product.alertAmounts[1])) {
                    bgColor = 'bg-[#F23F3F]/60';
                } else if (product.quantity <= Number(product.alertAmounts[2])) {
                    bgColor = 'bg-[#F23F3F]/30';
                } else {
                    bgColor = 'bg-[#F23F3F]/10';
                }
    
                //Creo la tabla, le agrego un id, una clase y el contenido html que va a tener
                const table = document.createElement('table');
                table.id = product.id;
                table.classList.add('w-full', 'rounded-3xl', 'h-80', 'py-4', 'max-w-80');
                //Compruebo si la cantidad del producto es mayor a la del numero de alerta y de no ser asi le asigno el color correspondiente del semaforo
                if (bgColor != '') {
                    table.classList.add(`${bgColor}`);
                }
                table.innerHTML = `
                    <tbody class="w-full">
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base border-r-2 pt-4 pl-6 text-left">Nombre</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-4">${product.name}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base border-r-2 pt-2 pl-6 text-left">Codigo</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.code}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 border-r-2 text-left">Fabricante</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.manufacturer}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 border-r-2 text-left">Cantidad</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.quantity + ' ' + product.unit}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 border-r-2 text-left">Precio uni.</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.unitPrice + ' ' + product.currency}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 border-r-2 text-left">Precio total</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.totalPrice + ' ' + product.currency}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 pb-2 border-r-2 text-left">Ultima entrada</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2 pb-2">${lastEntryDate}</td>
                        </tr>
                        <tr class="align-middle odd:bg-black/10 even:bg-black/0">
                            <td class="w-1/2 text-base pt-2 pl-6 pb-2 border-r-2 text-left">Ultima salida</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2 pb-2">${lastExitDate}</td>
                        </tr>
                        <tr class="text-center align-middle border-t-2 odd:bg-black/10 even:bg-black/0">
                            <td colspan="2" class="px-2 pb-6 text-white">${product.description}</td>
                        </tr>
                    </tbody>
                `;
            
                //Añade la tabla como primer hijo del contenedor
                tablesContainer.prepend(table);
            });
            
            //Añado el div que va a hacer de tope en el scroll
            const div = document.createElement('div');
            div.classList.add('h-36', 'w-full');
            tablesContainer.append(div);
        }
    } catch (error) {
        // window.location.pathname = '/login';
        console.log(error);
        
    }
};

//Añade o quita clases cuando se abre la barra de opciones de informacion general abriendola u ocultandola
const toggleGeneralInfo = () => {
    const generalInfoBtns = generalInfoBtn.parentElement.children[1];
    const generalInfoBar = generalInfoBtn.parentElement;
    const generalInfoContainer = generalInfoBtn.parentElement.children[2];

    document.querySelector('.selected')?.classList.remove('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20', 'border-2', 'border-white');
    
    searchInput.parentElement.classList.toggle('w-0');
    generalInfoBar.classList.toggle('md:w-full');
    generalInfoBar.classList.toggle('w-full');
    generalInfoBtn.classList.toggle('w-0');
    //Agregar un retraso cuando se va a mostrar el contenedor de informacion general pero ocultar inmediatamente cuando se cierra
    if (!generalInfoBtns.classList.contains('hidden')) {
        generalInfoBtns.classList.add('hidden');
        searchInput.parentElement.classList.remove('hidden');
        generalInfoBtn.classList.remove('hidden');
        generalInfoContainer.classList.add('hidden');
        generalInfoContainer.innerHTML = '';
    } else {
        setTimeout(() => {
            generalInfoBtns.classList.remove('hidden');
            searchInput.parentElement.classList.add('hidden');
            generalInfoBtn.classList.add('hidden');
            generalInfoContainer.classList.remove('hidden');
        }, 100);
    }
};

//Aplica estilos de seleccion y de apertura variando entre el modo mobile y el modo destock
const generalInfoStylized = (button, generalInfoContainer, generalInfoBtns, firstBtn, lastBtn) => {
    //Eliminar las clases correspondientes al boton seleccionado y añadirselas al nuevo boton seleccionado
    if (button && !button.classList.contains('selected')) {
        //Añadir borde blanco en caso de que phoneResolution sea true 
        if (phoneResolution) {
            document.querySelector('.selected')?.classList?.remove('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20', 'border-2', 'border-white');
            button.classList.add('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20', 'border-2', 'border-white');
        } else {
            document.querySelector('.selected')?.classList?.remove('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20');
            button.classList.add('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20');
        }
        //Eliminar border radious de las esquinas inferiores del contenedor de los botones, en version mobile no es necesario eliminarlo
        if (!phoneResolution) {
            generalInfoBtns.classList.remove('rounded-xl');
            generalInfoBtns.classList.add('rounded-t-xl');
            firstBtn.classList.remove('lg:rounded-s-xl', );
            firstBtn.classList.add('lg:rounded-ss-xl');
            lastBtn.classList.remove('lg:rounded-e-xl');
            lastBtn.classList.add('lg:rounded-se-xl');
        }
    } else {
        //Añadir borde blanco en caso de que phoneResolution sea true
        if (phoneResolution) {
            document.querySelector('.selected')?.classList?.remove('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20', 'border-2', 'border-white');
        } else {
            document.querySelector('.selected')?.classList?.remove('selected', 'lg:bg-white/20', 'lg:hover:bg-white/20', 'bg-white/20', 'hover:bg-white/20');
        }
        //Añadir border radious a las esquinas inferiores del contenedor de los botones y vaciar el generalInfoContainer, en version mobile no es necesario añadirlo
        if (!phoneResolution) {
            generalInfoBtns.classList.add('rounded-xl');
            generalInfoBtns.classList.remove('rounded-t-xl');
            firstBtn.classList.add('lg:rounded-s-xl');
            firstBtn.classList.remove('lg:rounded-ss-xl');
            lastBtn.classList.add('lg:rounded-e-xl');
            lastBtn.classList.remove('lg:rounded-se-xl');
        }
        generalInfoContainer.innerHTML = '';
    }

    //Separar un poco el contenedor de la informacion general y agregarle border radius si se esta renderizando el modo movil
    if (phoneResolution) {
        generalInfoContainer.classList.add('mt-2', 'rounded-xl');
        generalInfoContainer.classList.remove('rounded-es-xl', 'rounded-ee-xl');
    } else {
        generalInfoContainer.classList.remove('mt-2', 'rounded-xl');
        generalInfoContainer.classList.add('rounded-es-xl', 'rounded-ee-xl');
    }
};

//Se encarga de hacer scroll hasta el producto que encuentre en base al id que se pase como parametro
const scrollToProduct = (id) => {
    const products = document.querySelector('#tbody').children;

    for (const product of products) {
        if (product.id === id) product.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};

//Evento que renderiza el contenido de la infoBar dependiendo del boton cliqueado, se estan seleccionando los botones al principio del evento
generalInfoBtn.parentElement.children[1].addEventListener('click', e => {
    const button = e.target.closest('button');
    const generalInfoContainer = button.parentElement.parentElement.children[2];
    const generalInfoBtns = button.parentElement;
    const firstBtn = button.parentElement.children[0];
    const lastBtn = button.parentElement.children[4];

    generalInfoStylized(button, generalInfoContainer, generalInfoBtns, firstBtn, lastBtn);

    //Renderizar el contenido correspondiente a cada boton seleccionado
    if (button.textContent == 'Total de productos' && button.classList.contains('selected')) {
        const totalProducts = phoneResolution ? tablesContainer.children.length - 1 : document.querySelector('#tbody').children.length - 1;
        generalInfoContainer.innerHTML = '';

        const div = document.createElement('div');
        div.classList.add('flex', 'flex-wrap', 'justify-center', 'items-center', 'w-full', 'h-fit', 'p-4', 'text-white');

        div.innerHTML = `
            <p class="font-regular text-lg text-center px-2">Cantidad total de productos en el stock:</p>
            <p class="font-regular text-lg text-center px-2">${totalProducts}</p>
        `;
        generalInfoContainer.append(div);

    } else if (button.textContent == 'Productos con stock bajo' && button.classList.contains('selected')) {
        //renderizar la estructura donde van a ir los li que contendran a los productos
        generalInfoContainer.innerHTML = `
            <div class="flex flex-wrap justify-center items-center w-full h-fit pt-2 pb-4 px-4 text-white">
                <ul class="flex flex-wrap justify-center items-center gap-2 w-full max-h-[55vh] overflow-y-auto"></ul>
            </div>
        `;

        //Filtrar y asignar a constantes todos los productos que esten bajo el umbral de alerta maxima 
        const productsCriticAlert = productsArray.filter(product => product.quantity <= Number(product.alertAmounts[1]) && product.quantity > Number(product.alertAmounts[0]));
        const productsMinimumAlert = productsArray.filter(product => product.quantity < Number(product.alertAmounts[0]));

        //En caso de que no existan productos bajo el umbral de alerta entonces se mostrara un mensaje y si no, se renderizaran los productos
        if (!productsCriticAlert && !productsMinimumAlert) {
            const li = document.createElement('li');
            li.classList.add('w-[18%]', 'mb-4', 'rounded-xl', 'bg-white/20');
            li.innerHTML = `<p class="flex justify-center items-center size-full p-2">Actualmente no hay productos con bajo stock</p>`;
            generalInfoContainer.children[0].children[0].append(li);

        } else {
            //Iterar sobre cada producto filtrado y renderizarlo para que se muestren en orden descendente en base a su fecha de entrada
            productsMinimumAlert?.forEach(product => {
                const li = document.createElement('li');
                li.id = product.id;
                li.classList.add('w-[18%]', 'my-4', 'rounded-xl', 'bg-white/20', 'hover:bg-white/30', 'hover:scale-105', 'transition-all');
                li.innerHTML = `
                    <button class="flex flex-col items-center size-full p-2">
                        <p class="border-b-2 border-white/40 w-full pb-1">${product.name}</p>
                        <p class="border-b-2 border-white/40 w-full pb-1">${product.code}</p>
                        <p class="w-full pb-1">Cantidad: ${product.quantity} ${product.unit}</p>
                    </button>
                `;
                generalInfoContainer.children[0].children[0].prepend(li);

                //Agregar un evento de cliclk al li despues de crearlo en donde se llamara a una funcion encargada de hacer scroll hasta donde este el producto cliqueado
                li.addEventListener('click', e => {
                    if (e.target.closest('li')) scrollToProduct(li.id);
                    toggleGeneralInfo();
                });
            });

            productsCriticAlert?.forEach(product => {
                const li = document.createElement('li');
                li.id = product.id;
                li.classList.add('w-[18%]', 'my-4', 'rounded-xl', 'bg-[#F23F3F]/70', 'hover:bg-[#F23F3F]/80', 'hover:scale-105', 'transition-all');
                li.innerHTML = `
                    <button class="flex flex-col items-center size-full p-2">
                        <p class="border-b-2 border-white/40 w-full pb-1">${product.name}</p>
                        <p class="border-b-2 border-white/40 w-full pb-1">${product.code}</p>
                        <p class="w-full pb-1">Cantidad: ${product.quantity} ${product.unit}</p>
                    </button>
                `;
                generalInfoContainer.children[0].children[0].prepend(li);

                //Agregar un evento de cliclk al li despues de crearlo en donde se llamara a una funcion encargada de hacer scroll hasta donde este el producto cliqueado
                li.addEventListener('click', e => {
                    if (e.target.closest('li')) scrollToProduct(li.id);
                    toggleGeneralInfo();
                });
            });
        }
    } else if (button.textContent == 'Productos mas vendidos' && button.classList.contains('selected')) {
    } else if (button.textContent == 'Productos menos vendidos' && button.classList.contains('selected')) {
    } else if (button.children[0]) {
        toggleGeneralInfo();
    }
});

//Evento que abre la barra con las opciones para visulizar la informacion general
generalInfoBtn.addEventListener('click', e => {
    toggleGeneralInfo();
});

//Selecciona el producto cliqueado para extraer su descripcion y añadirla al contenedor de descripciones
tablesContainer.addEventListener('click', e => {
    //En caso de que la resolucion sea de telefono o que el tr seleccionado sea el encabezado se detendra la ejecucion
    if (phoneResolution || e.target.closest('tr')?.parentElement.tagName === 'THEAD') return;

    //Seleccionar el contenedor de descripcion y tambien el tr, en caso de que el elemento cliqueado no sea un tr se muestra el mensaje default
    const deskDescription = document.querySelector('#deskDescription');
    const tr = e.target.closest('tr') ? e.target.closest('tr') : deskDescription.textContent = 'Seleccione un producto para ver su descripcion';
    
    //Seleccionar la seleccion antigua y quitarle las clases de la seleccion para añadirselas al nuevo producto cliqueado
    const lastSelection = document.querySelector('.desktopSelection');
    lastSelection?.classList.remove('translate-y-[-5px]', 'desktopSelection', 'shadow-[0px_8px_8px_rgba(9,4,28,0.5)]');

    //Detener la ejecucion del evento en caso de que el elemento cliqueado no sea un tr valido
    if (typeof tr === 'string') return;
    tr?.classList.add('translate-y-[-5px]', 'desktopSelection', 'shadow-[0px_8px_8px_rgba(9,4,28,0.5)]');

    //Seleccionar el codigo y la fecha del producto para buscarlo dentro del array que contiene todos los productos 
    const productCode = tr?.children[1].textContent;
    const productObject = productsArray.find(product => product.code === productCode);
    //Asignar el valor encontrado en la descripcion del objeto del producto al mostrador de descripciones
    if (productObject) deskDescription.textContent = productObject.description;
});

//Se detecta cada vez que se escribe en el input y se buscan los productos mediante su nombre para añadirlos a la lista de coincidencias
searchInput.addEventListener('input', e => {
    //Si el input esta vacio se vacia la lista que contiene las coincidencias
    if (e.target.value === '') {
        productsFounds.innerHTML = '';
    } else {
        productsFounds.innerHTML = '';
        //Despues de limpiar la lista iterar sobre todos los productos de la lista de entries para encontrar todos aquellos que coincidan con la busqueda y añadirlos a la lista por medio de un div
        for (const product of phoneResolution ? tablesContainer.children : tablesContainer.children[0].children[1].children) {
            let productName = '';
            let productCode = '';
            
            //En caso de que la vista sea mobile se buscara en las cards y en caso de que sea destock se buscara en la tabla
            if (phoneResolution) {
                productName = product.children[0]?.children[0].children[1].textContent;
                productCode = product.children[0]?.children[1].children[1].textContent;
            } else {
                productName = product.children[0]?.textContent;
                productCode = product.children[1]?.textContent;
            }

            //Crear li, agregar clases y añadirlo a la lista de productos encontrados en caso de que su nombre coincida con el valor del input
            if (productName && productName.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())) {
                const li = document.createElement('li');
                li.classList.add('w-full', 'h-fit', 'py-1', 'odd:bg-black/20', 'even:bg-black/0');
                li.innerHTML = `<button class="w-full px-2">${productName} ${productCode}</button>`;
                productsFounds.append(li);

                //Agregar evento de click a la lista para detectar los click sobre los nombres de los productos y mover el scroll de la lista hasta llegar a dicho producto
                li.addEventListener('mousedown', e => {
                    const item = product;
                    
                    item.scrollIntoView({ behavior: "smooth", block: "center" });

                    searchInput.value = '';
                    productsFounds.innerHTML = '';
                });
            }
        };
    }
});
//Al dejar de hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se contrae
searchInput.addEventListener('focusout', e => {
    setTimeout(() => {
        if (searchInput.value != '') {
            productsFounds.classList.add('h-0');
        }
    }, 150);

    if (phoneResolution) {
        //Reducir el width del contenedor padre cuando se deja de hacer focus
        searchInput.parentElement.classList.remove('w-full');
        //Expandir el width y mostrar el boton de añadir cuando se deja de hacer focus
        setTimeout(() => {
            //Usar setTimeout para evitar distorciones mientras ambos botones cambian su tamaño en resoluciones de telefono
            searchInput.parentElement.parentElement.children[1]?.classList.remove('w-0', 'hidden');
        }, 100);
    }
});
//Al hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se expando hasta la altura de su contenido
searchInput.addEventListener('focusin', e => {
    if (productsFounds.classList.contains('h-0')) productsFounds.classList.remove('h-0');

    if (phoneResolution) {
        //Expandir el width del contenedor padre cuando se hace focus
        searchInput.parentElement.classList.add('w-full');
        //Reducir el width y esconder el boton de añadir cuando se hace focus
        searchInput.parentElement.parentElement.children[1]?.classList.add('w-0', 'hidden');
    }
});

//Detectar cuando la ventana cambia de resolucion
window.addEventListener("resize", () => {
    const newState = window.innerWidth > 1023;

    if (window.innerWidth > 1023) {
        descriptionContainer.classList.remove('hidden');
    } else {
        descriptionContainer.classList.add('hidden');
    }

    // Solo ejecuta si el estado cambio
    if (newState !== isWideScreen) { 
        isWideScreen = newState;
        if (isWideScreen) {
            phoneResolution = false;
            loadProducts(phoneResolution);
        } else {
            phoneResolution = true;
            loadProducts(phoneResolution);
        }
    }
});

window.onload = () => {
    //Renderizar el div que muestra la descripcion del producto seleccionado en caso de que la resolucion actual sea desktop
    if (!phoneResolution) {
        descriptionContainer.classList.remove('hidden');
    } else {
        descriptionContainer.classList.add('hidden');
    }
    //Se llama a la funcion encargada de cargar los productos en las cards
    loadProducts(phoneResolution);
}