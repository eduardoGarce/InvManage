const addModal = document.querySelector('#add-modal');
const editModal = document.querySelector('#edit-modal');
const addform = document.querySelector('#add-form');
const editForm = document.querySelector('#edit-form');
const submitBtn = document.querySelector('#submit');
const openModalBtn = document.querySelector('#open-modal-btn');
const tablesContainer = document.querySelector('#tables-container');
const list = document.querySelector('#list');
const editList = document.querySelector('#edit-list');
const editCancelBtn = document.querySelector('#edit-cancel-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const editSubmitBtn = document.querySelector('#edit-submit');
const descriptionContainer = document.querySelector('#description-container');
const productsFounds = document.querySelector('#products-founds');
const productsFoundsAdd = document.querySelector('#products-founds-add');
const productsFoundsEdit = document.querySelector('#products-founds-edit');
const searchInput = document.querySelector('#search-input');
const searchInputAdd = document.querySelector('#search-input-add');
const searchInputEdit = document.querySelector('#search-input-edit');

//codes almacena cada uno de los codigos ingresados en los li para compararlos y ver si se repiten en inputValidations
let codes = [];
//isValidForm sera false si alguna validacion del formulario falla y en caso de ser true se enviara la peticion a traves de axios
let isValidForm;
//Variable para comprobar el cambio de estados de la pantalla
let isWideScreen = window.innerWidth > 1023;
//Variable para comprobar si se renderizara la lista en su version mobile o destock
let phoneResolution = !isWideScreen;
//Encargada de almacenar el id del producto que se esta editando (se usa en la funcion activateEditBtn y en el evento de submit del formulario de edicion)
let productFound = '';
//Guarda el array de productos pertenecientes a la salida
let productsArray = [];
//Guarda el array de productos del stock
let stockArray = [];

//Se encarga de vaciar la ul del modal y solo deja un solo li con inputs vacios
const resetForm = (nameSelect, codeSelect, isAdd) => {
    //Declarar una constante que almacenará el input de cantidad
    const quantityInput = nameSelect.parentElement.children[2].children[0];

    //Añadir la opcion por defecto en cada input en caso de que se este limpiando el input de añadir salida
    if (isAdd) {
        nameSelect.innerHTML = `
            <option value="default">Nombre</option>
        `;
        codeSelect.innerHTML = `
            <option value="default">Codigo</option>
        `;
        quantityInput.value = '';
    }

    //Añadir los options tanto del input name como del input code
    stockArray.forEach(product => {
        const nameOption = document.createElement('option');
        const codeOption = document.createElement('option');

        nameOption.value = product.name;
        nameOption.innerHTML = product.name;
        codeOption.value = product.code;
        codeOption.innerHTML = product.code;

        nameSelect.append(nameOption);
        codeSelect.append(codeOption);
    })

    //Añadir un evento de tipo select al input de name y code, evento en el que se añadiran las funcionalidades de que al seleccionar una opcion automaticamente se autocomplete la otra
    nameSelect.addEventListener('input', e => {
        const productFound = stockArray.find(product => product.name === e.target.value);

        for (const option of codeSelect.children) {
            if (productFound.code === option.value) {
                option.selected = true;
                //Si el valor del input es mayor a la cantidad del producto en stock entonces se limpia el input
                if (quantityInput.value > productFound.quantity) quantityInput.value = '';
                //Establecer una cantidad maxima para el input de cantidad en base a lo que queda en stock
                quantityInput.max = productFound.quantity;
                break;
            }
        }
    });

    codeSelect.addEventListener('input', e => {
        const productFound = stockArray.find(product => product.code === e.target.value);

        for (const option of nameSelect.children) {
            if (productFound.name === option.value) {
                option.selected = true;
                //Si el valor del input es mayor a la cantidad del producto en stock entonces se limpia el input
                if (quantityInput.value > productFound.quantity) quantityInput.value = '';
                //Establecer una cantidad maxima para el input de cantidad en base a lo que queda en stock
                quantityInput.max = productFound.quantity;
                break;
            }
        }
    });
};

//Se seleccionan todos los btn de editar y a cada uno se le agrega un evento de click con la logica de cargar los valores en sus respectivos inputs
const activateEditBtn = () => {
    //Despues de cargar por completo el DOOM se selecciona el btn de edit y a traves de un evento se le remueve la clase hidden
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            editModal.classList.remove('hidden');

            //seleccionar los inputs de nombre y codigo correspondientes al modal de añadir para enviarlos a la funcion que va a cargar los options dentro de los selects y añadir sus respectivos eventos de click
            const nameSelect = editList.children[1].children[0];
            const codeSelect = editList.children[1].children[1];
            const quantityInput = editList.children[1].children[2].children[0];
            resetForm(nameSelect, codeSelect, isAdd = false);

            //Seleccionar el id del producto
            const productId = phoneResolution ? e.target.closest('.edit-btn').parentElement.parentElement.parentElement.parentElement.id : e.target.closest('.edit-btn').parentElement.parentElement.id;
            productFound = productsArray.find(product => product.id === productId);
            
            //Buscar entre todos los options cuales corresponden a la salida que se está editando y seleccionarlos
            for (const option of nameSelect.children) {
                if (productFound.name === option.value) {
                    option.selected = true;
                }
            }
            for (const option of codeSelect.children) {
                if (productFound.code === option.value) {
                    option.selected = true;
                }
            }

            //Cargar la cantidad actual de la salida al input de cantidad 
            quantityInput.value = productFound.quantity;
            //establecer un max en base a la cantidad del produto disponible en stock
            quantityInput.max = stockArray.find(product => product.code === productFound.code).quantity;
        });
    });
};

//Funcion que se encarga de cargar todos los productos en las cards y renderizarlas
const loadProducts = async (phoneResolution) => {
    
    try {
        //Llamada a la api a traves de axios 
        const { data } = await axios.get('/api/sales', {
            withCredentials : true
        });

        //Guardar el array en la variable temporal externa
        productsArray = data;
        //Guardar todos los productos del stock
        const stockResponse = await axios.get('/api/stock');
        stockArray = stockResponse.data.reverse();

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
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Fecha</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-b-2 rounded-se-3xl"></th>
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
                const date = product.date.split('T')[0].split('-').reverse().join('/');
                const editDate = product.editDate != null ? product.editDate.split('T')[0].split('-').reverse().join('/') : 'Sin editar.';
                //Creo el tr, le agrego un id, una clase y el contenido html que va a tener
                const tr = document.createElement('tr');

                //Asignar el color correspondiente del semaforo
                tr.classList.add('bg-[#F23F3F]/10', 'relative', 'transition-all');
                tr.id = product.id;

                tr.innerHTML = `
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2 ${i === 0 ? 'rounded-es-3xl' : ''}">${product.name}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.code}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.manufacturer}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.quantity + ' ' + product.unit}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.unitPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.totalPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${date}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal ${i === 0 ? 'rounded-ee-3xl' : ''}">
                        <button class="edit-btn flex items-center justify-center relative z-20 h-full w-full m-auto disabled:opacity-40 disabled:hover:scale-100 hover:scale-110 transition-all">
                            <svg class="stroke-white h-full w-full max-h-8 max-w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                    </td>
                    <div class="flex items-center absolute inset-0 z-10 bg-[#09041C]/0 hover:bg-[#09041C]/70 py-1 text-white/0 hover:text-white transition-all ${i === 0 ? 'rounded-b-3xl' : ''}">
                        <p class="h-fit w-full text-center transition-all">${product.editDate != null ? 'Ultima edicion ' + editDate : editDate}</p>
                    </div>
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

            activateEditBtn();
        } else if (phoneResolution) {
            tablesContainer.classList.add('gap-1');
            data.forEach(product => {
                //Separar la fecha de la hora, convertirlo a string y aplicar reverse para renderizarlo
                const date = product.date.split('T')[0].split('-').reverse().join('/');
                const editDate = product.editDate != null ? product.editDate.split('T')[0].split('-').reverse().join('/') : 'Sin editar.';

                //Creo la tabla, le agrego un id, una clase y el contenido html que va a tener
                const table = document.createElement('table');
                table.id = product.id;
                table.classList.add('w-full', 'rounded-3xl', 'h-80', 'py-4', 'max-w-80', 'bg-[#F23F3F]/10');

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
                            <td class="w-1/2 text-base pt-2 pl-6 pb-2 border-r-2 text-left">Fecha de entrada</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2 pb-2">${date}</td>
                        </tr>
                        <tr class="text-center align-middle border-t-2 odd:bg-black/10 even:bg-black/0">
                            <td colspan="2" class="p-2 text-white">${product.description && product.description != '' ? product.description : 'Sin descripcion'}</td>
                        </tr>
                        <tr class="align-middle border-t-2 odd:bg-black/10 even:bg-black/0">
                            <td colspan="2" class="text-white font-semibold bg-[#09041C]/20 rounded-b-3xl">
                                <button class="edit-btn flex flex-row items-center justify-center h-8 w-full my-2 px-2 gap-2 mx-auto disabled:opacity-40 hover:scale-110 transition-all disabled">
                                    <svg class="stroke-white max-h-8 max-w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <p class="max-h-8 text-sm text-white text-center">${product.editDate != null ? 'Ultima edicion ' + editDate : editDate}</p>
                                </button>
                            </td>
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

            activateEditBtn();
        }
    } catch (error) {
        window.location.pathname = '/login';
    }
};

//Esta funcion se encarga de agregarle los estilos y los mensajes de error a los inputs
const validationStyles = (input, mesage) => {
    const textBase = addform.children[0].textContent;
    const textInformative = addform.children[0];
    const inputsContainer = list.children[1];

    //Asignar false a la variable que se va a encargar de almacenar si el formulario se puede enviar
    isValidForm = false;

    //Cambiar el texto superior y aplicar borde rojo a el input y el contenedor de los inputs
    textInformative.textContent = mesage;
    textInformative.classList.add('text-red-600');
    input.classList.add('ring-2', 'ring-red-600', 'focus:ring-red-600');
    inputsContainer.classList.add('ring-2', 'ring-red-600');

    //Después de 5 segundos quitar todos los estilos de error
    setTimeout(() => {
        textInformative.textContent = textBase;
        textInformative.classList.remove('text-red-600');
        input.classList.remove('ring-2', 'ring-red-600', 'focus:ring-red-600');
        inputsContainer.classList.remove('ring-2', 'ring-red-600');
    }, 5000);
};

//Esta funcion se encarga de validar los inputs (que no estenvacios y que los inputs de cantidad y numero de alerta se validen con sus regex)
const inputValidations = (li) => {
    const nameSelect = li.children[0];
    const codeSelect = li.children[1];
    const quantityInput = li.children[2].children[0];

    //Buscar el producto correspondiente en stock para verificar que el producto exista
    const productStockFound = stockArray.find(product => product.code === codeSelect.value);

    if (!nameSelect.value || !codeSelect.value || !quantityInput.value) {
        //Iterar sobre cada input para detectar cual de ellos es el que esta vacio y pasarlo a validationStyles
        for (const container of li.children) {
            //Si el elemento de la iteracion tiene una hijo de tipo input enotonces se selecciona su hijo y en caso de no ser así se selecciona al mismo elemento
            const input = container.children[0].tagName = 'INPUT' ? container.children[0] : container;
            if (!input.value) validationStyles(input, 'Todos los campos son requeridos');;
        };
    } else if (!productStockFound) {
        validationStyles(codeSelect, 'El producto no existe en stock');
    } else if (productStockFound.name != nameSelect.value) {
        validationStyles(nameSelect, 'El nombre del producto es incorrecto');
    } else if (quantityInput.value > productStockFound.quantity) {
        validationStyles(quantityInput, 'La cantidad de la salida exede la cantidad en stock');
    }
};

//Encargada de extraer la informacion de los inputs y devolver un objeto con sus valores dependiendo el caso
const infoExtractor = (container, purpose) => {
    switch (purpose) {
        case 'edit':
            inputValidations(container);
            if (!isValidForm)  return;

            const nameEdit = container.children[0].value;
            const codeEdit = container.children[1].value;
            const quantityEdit = container.children[2].children[0].value;
            

            const stockProductEdit = stockArray.find(product => product.code === codeEdit);

            const manufacturerEdit = stockProductEdit.manufacturer;
            const unitEdit = stockProductEdit.unit;
            const unitPriceEdit = stockProductEdit.unitPrice;
            const currencyEdit = stockProductEdit.currency;
            const totalPriceEdit = quantityEdit * unitPriceEdit;
            const descriptionEdit = stockProductEdit.description;
            
            const editedProduct = {
                nameEdit,
                codeEdit,
                manufacturerEdit,
                quantityEdit,
                unitEdit,
                unitPriceEdit,
                currencyEdit,
                totalPriceEdit,
                descriptionEdit
            }

            return editedProduct;

        case 'add':
            inputValidations(container);
            if (!isValidForm)  return;

            const name = container.children[0].value;
            const code = container.children[1].value;
            const quantity = container.children[2].children[0].value;

            const stockProduct = stockArray.find(product => product.code === code);

            const manufacturer = stockProduct.manufacturer;
            const unit = stockProduct.unit;
            const unitPrice = stockProduct.unitPrice;
            const currency = stockProduct.currency;
            const totalPrice = quantity * unitPrice;
            const description = stockProduct.description;

            const product = {
                name,
                code,
                manufacturer,
                quantity,
                unit,
                unitPrice,
                currency,
                totalPrice,
                description
            }

            return product;
    
        default:
            return 'caso invalido';
    }
};

//Busca y muestra sugerencias de busqueda del input y ademas añade un tipo de funcionalidad al seleccionar una coincidencia en base al parametro que se les pase
const searchAndDisplay = (input, value, productsFounds, productsList, inputsList, itsModal) => {
    //Si el input esta vacio se vacia la lista que contiene las coincidencias
    if (value === '') {
        productsFounds.innerHTML = '';
    } else {
        productsFounds.innerHTML = '';
        //Despues de limpiar la lista iterar sobre todos los productos de la lista de stock para encontrar todos aquellos que coincidan con la busqueda y añadirlos a la lista por medio de un div
        for (const product of productsList) {
            //Crear li, agregar clases y añadirlo a la lista de productos encontrados en caso de que su nombre coincida con el valor del input
            if (product.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                || product.code.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                //Extraer la fecha del producto y transformarla al formato a renderizar
                const date = product.date?.split('T')[0].split('-').reverse().join('/');

                //Crear li, aplicar sus clases, definir su contenido HTML y agregarlo al contenedor de coincidencias todo dependiendo del caso (buscador en modal o bucador general)
                const li = document.createElement('li');
                li.classList.add('w-full', 'h-fit', 'py-1', `${itsModal ? 'odd:bg-[#09041C]/90' : 'odd:bg-[#09041C]/30'}`, 'even:bg-[#09041C]/0');
                li.innerHTML = `<button type="button" class="w-full px-2">${product.name} ${product.code} ${itsModal ? '' : date}</button>`;
                productsFounds.append(li);

                //Agregar evento de click a la lista para detectar los click sobre los nombres de los productos y mover el scroll de la lista hasta llegar a dicho producto
                li.addEventListener('mousedown', e => {
                    const item = product;

                    //Agregamos la informacion correspondiente a cada input segun la seleccion de alguno de ellos
                    if (itsModal) {
                        //seleccionar los inputs de nombre y codigo
                        const nameSelect = inputsList.children[1].children[0];
                        const codeSelect = inputsList.children[1].children[1];
                        const quantityInput = inputsList.children[1].children[2].children[0];

                        //Añadir valores dependiendo de la seleccion de alguno de ellos
                        for (const option of codeSelect.children) {
                            if (item.code === option.value) {
                                option.selected = true;
                            }
                        }
                        for (const option of nameSelect.children) {
                            if (item.name === option.value) {
                                option.selected = true;
                            }
                        }
                        //Si el valor del input es mayor a la cantidad del producto en stock entonces se limpia el input
                        if (quantityInput.value > item.quantity) quantityInput.value = '';
                        //Establecer una cantidad maxima para el input de cantidad en base a lo que queda en stock
                        quantityInput.max = item.quantity;
                    } else {
                        //A partir del producto seleccionado del array de SALES, buscar a cual elemento html renderizado pertenece para hacer scroll hasta donde este
                        //Seleccionar la lista de productos renderizados en el HTML
                        const listElements = tablesContainer.children[0].children[1].children;
                        const itemDate = date;

                        //Buscar en la coleccion HTML mediante el codigo y la fecha del producto seleccionado
                        for (const element of listElements) {
                            if (element.children[6].textContent === itemDate && element.children[1].textContent === item.code) {
                                //Hacer scroll hasta el elemento seleccionado en caso de que la busqueda sea en la vista general
                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                                break;
                            }
                        }
                    }

                    //Vaciar tanto el input como la lista de coincidencias
                    input.value = '';
                    productsFounds.innerHTML = '';
                });
            }
        };
    }
};
const searchContainerContraccion = (input, productsFounds) => {
    setTimeout(() => {
        if (input.value != '') {
            productsFounds.classList.add('h-0');
        }
    }, 150);

    if (phoneResolution) {
        //Reducir el width del contenedor padre cuando se deja de hacer focus
        input.parentElement.classList.remove('w-full');
        //Expandir el width y mostrar el boton de añadir cuando se deja de hacer focus
        setTimeout(() => {
            //Usar setTimeout para evitar distorciones mientras ambos botones cambian su tamaño en resoluciones de telefono
            input.parentElement.parentElement.children[1]?.classList.remove('w-0', 'hidden');
        }, 100);
    }
};
const searchContainerExpansion = (input, productsFounds, itsModal) => {
    if (productsFounds.classList.contains('h-0')) productsFounds.classList.remove('h-0');

    //Expandir el width del contenedor padre cuando se hace focus
    input.parentElement.classList.add('w-full');

    //Reducir el width y esconder el boton de añadir cuando se hace focus
    if (!itsModal && phoneResolution) searchInput.parentElement.parentElement.children[1]?.classList.add('w-0', 'hidden');
};

//Se detecta cada vez que se escribe en el input y se buscan los productos mediante su nombre o codigo para añadirlos a la lista de coincidencias
searchInputEdit.addEventListener('input', e => {
    searchAndDisplay(searchInputEdit, e.target.value, productsFoundsEdit, stockArray, editList, true);
});
//Al dejar de hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se contrae
searchInputEdit.addEventListener('focusout', e => {
    searchContainerContraccion(searchInputEdit, productsFoundsEdit);
});
//Al hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se expando hasta la altura de su contenido
searchInputEdit.addEventListener('focusin', e => {
    searchContainerExpansion(searchInputEdit, productsFoundsEdit, true);
});

//Se detecta cada vez que se escribe en el input y se buscan los productos mediante su nombre o codigo para añadirlos a la lista de coincidencias
searchInputAdd.addEventListener('input', e => {
    searchAndDisplay(searchInputAdd, e.target.value, productsFoundsAdd, stockArray, list, true);
});
//Al dejar de hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se contrae
searchInputAdd.addEventListener('focusout', e => {
    searchContainerContraccion(searchInputAdd, productsFoundsAdd);
});
//Al hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se expando hasta la altura de su contenido
searchInputAdd.addEventListener('focusin', e => {
    searchContainerExpansion(searchInputAdd, productsFoundsAdd, true);
});

//Se detecta cada vez que se escribe en el input y se buscan los productos mediante su nombre para añadirlos a la lista de coincidencias
searchInput.addEventListener('input', e => {
    searchAndDisplay(searchInput, e.target.value, productsFounds, productsArray, null, false)
});
//Al dejar de hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se contrae
searchInput.addEventListener('focusout', e => {
    searchContainerContraccion(searchInputAdd, productsFoundsAdd);
});
//Al hacer focus en el input de busqueda si tiene un valor entonces la lista de coincidencias se expando hasta la altura de su contenido
searchInput.addEventListener('focusin', e => {
    searchContainerExpansion(searchInputAdd, productsFoundsAdd, true);
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
    if (productObject && productObject.description && productObject.description != '') {
        deskDescription.textContent = productObject.description;
    } else if (productObject) {
        deskDescription.textContent = 'Sin descripcion';
    }
});

//Envia todos los datos de los inputs a infoextractor para posteriormente enviarlos a la api
editForm.addEventListener('submit', async e => {
    e.preventDefault();

    editSubmitBtn.disabled = true;
    setTimeout(() => {
        editSubmitBtn.disabled = false;
    }, 5100);

    try {
        isValidForm = true;

        const inputsContainer = editForm.children[0].children[1];

        const product = infoExtractor(inputsContainer, 'edit');
    
        if (isValidForm) {
            await axios.patch(`/api/sales/${productFound.id}`, product);

            editModal.classList.add('hidden');
            productFound = '';
            loadProducts(phoneResolution);
        }
    } catch (error) {
        console.log(error);
    }
});

//Cierra el modal de editar agregandole la clase hidden
editCancelBtn.addEventListener('click', e => {
    editModal.classList.add('hidden');
});

//Abre el modal de añadir salidas
openModalBtn.addEventListener('click', e => {
    addModal.classList.remove('hidden');

    //seleccionar los inputs de nombre y codigo correspondientes al modal de añadir para enviarlos a la funcion
    const nameSelect = list.children[1].children[0];
    const codeSelect = list.children[1].children[1];

    resetForm(nameSelect, codeSelect, isAdd = true);
});

//Cierra el modal de añadir salidas
cancelBtn.addEventListener('click', e => {
    addModal.classList.add('hidden');
});

//Envia los datos añadidos al formulario de salidas
addform.addEventListener('submit', async e => {
    e.preventDefault();
    isValidForm = true;

    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.disabled = false;
    }, 5100);

    try {
        const product = infoExtractor(list.children[1], 'add');
        
        if (isValidForm) {
            //Se envia el array de productos a la api
            await axios.post('/api/sales', product);
            loadProducts(phoneResolution);
            addModal.classList.add('hidden');
        }
    } catch (error) {
        console.log(error);
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