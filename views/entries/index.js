const addModal = document.querySelector('#add-modal');
const addform = document.querySelector('#add-form');
const cancelBtn = document.querySelector('#cancel-btn');
const submitBtn = document.querySelector('#submit');
const openModalBtn = document.querySelector('#open-modal-btn');
const settingsBtn = document.querySelector('#settings-btn');
const tablesContainer = document.querySelector('#tables-container');
const list = document.querySelector('#list');
const divDetector = document.querySelector('#detector');
const addBtn = document.querySelector('#add-btn');
const removeBtn = document.querySelector('#remove-btn');
const editModal = document.querySelector('#edit-modal');
const editCancelBtn = document.querySelector('#edit-cancel-btn');
const editForm = document.querySelector('#edit-form');
const editSubmitBtn = document.querySelector('#edit-submit');
const searchInput = document.querySelector('#search-input');
const productsFounds = document.querySelector('#products-founds');
const descriptionContainer = document.querySelector('#description-container');

//Se declara una variable (let porque se actualiza constantemente) que contendrá todos los li de la lista del formulario del registro
let listItems = document.querySelectorAll('#list li');
//Variable para llevar la distincion de los inputs y sus labels
let productCount = 1;
//liCount es un numero que incrementa por iteracion y se encarga de completar los id para que concuerden con los li del doom en inputsValidation
let liCount = productCount != 1 ? 1 : 0;
//codes almacena cada uno de los codigos ingresados en los li para compararlos y ver si se repiten en inputValidations
let codes = [];
//isValidForm sera false si alguna validacion del formulario falla y en caso de ser true se enviara la peticion a traves de axios
let isValidForm;
//Variable para comprobar el cambio de estados de la pantalla
let isWideScreen = window.innerWidth > 1023;
//Variable para comprobar si se renderizara la lista en su version mobile o destock
let phoneResolution = !isWideScreen;
//Encargada de almacenar el id del producto que se esta editando (se usa en la funcion activateEditBtn y en el evento de submit del formulario de la ediicion)
let productFound = '';
//Guarda el array de productos pertenecientes a la entrada
let productsArray = [];

//Se encarga de actualizar la variable listItems
const listItemsUpdate = () => {
    listItems = document.querySelectorAll('#list li');
}

//Se encarga de vaciar la ul del modal y solo deja un solo li con inputs vacios
const resetList = () => {
    list.innerHTML = `
        <li class="relative flex flex-col w-full max-w-[22rem] h-fit px-6 pb-4 pt-4 gap-x-4 bg-white/30 opacity-80 text-center rounded-xl md:flex-row md:flex-wrap md:max-w-[34rem]">
            <div class="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center text-white hidden"></div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="name" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="name" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Nombre</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="code" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="code" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Codigo</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="lot" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="lot" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Lote</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="manufacturer" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="manufacturer" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3  transition-all">Fabricante</label>
            </div>
            <div class="flex flex-row justify-between h-fit w-full md:max-w-[15rem] mb-6 pr-2 rounded-full bg-white text-[#09041C] border-2 border-white">
                <div class="max-h-8 w-full">
                    <input type="number" placeholder="" id="quantity" class="peer w-full min-h-6 py-1 px-4 rounded-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none transition-all">
                    <label for="quantity" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Cantidad</label>
                </div>
                <select id="select-unid" class="w-[35%] max-h-8 my-1 border-l-2 outline-none text-center full bg-transparent text-[#09041C]">
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="Uni.">Uni.</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="N/A">N/A</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="kg">kg</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="g">g</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="mg">mg</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="lb">lb</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="oz">oz</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ton">ton</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="lts">Lts</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ml">ml</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="m³">m³</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cm³">cm³</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="m">m</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cm">cm</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="mm">mm</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ft">ft</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="in">in</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="paq">paq</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="doc">doc</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cajas">Cajas</option>
                </select>
            </div>
            <div class="flex flex-row justify-between h-fit w-full md:max-w-[15rem] mb-6 pr-2 rounded-full bg-white text-[#09041C] border-2 border-white">
                <div class="max-h-8 w-full">
                    <input type="number" placeholder="" id="unit-price" class="peer w-full min-h-6 py-1 px-4 rounded-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none">
                    <label for="unit-price" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Precio uni.</label>
                </div>
                <select id="select-currency" class="w-[35%] max-h-8 my-1 border-l-2 outline-none text-center full bg-transparent text-[#09041C]">
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="$">$</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="€">€</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="Bs">Bs</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ARS">ARS</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="COP">COP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="MXN">MXN</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="PEN">PEN</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="CLP">CLP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="BRL">BRL</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="UYU">UYU</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="PYG">PYG</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="DOP">DOP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="GTQ">GTQ</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="CRC">CRC</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="HNL">HNL</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="NIO">NIO</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="BOV">BOB</option>
                </select>
            </div>
            <div class="mb-6 max-h-8 w-full text-[#09041C]">
                <input type="text" placeholder="" id="alert-amount" class="peer w-[97%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none [&::-webkit-inner-spin-button]:appearance-none transition-all">
                <label for="alert-amount" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Minimo de alerta</label>
            </div>
            <div class="mb-4 h-8 w-full text-[#09041C]">
                <textarea placeholder="Descripcion" id="description" 
                class="description w-full min-h-6 h-9 focus:h-28 resize-none py-1 px-4 bg-white rounded-3xl border-2 border-white/90 outline-none text-base placeholder:text-[#09041C] placeholder:text-center"></textarea>
            </div>
        </li>
    `;
};

//Esta funcion se encarga de detectar si hay colision entre el div detector y el li de la ul
const checkCardPosition = () => {
    listItemsUpdate();
    if (window.innerWidth <= 768) {
        listItems.forEach(li => {
            //El método getBoundingClientRect devuelve un objeto con las coordenadas y dimensiones del elemento en la pantalla.
            const detector = divDetector.getBoundingClientRect();
            const detected = li.getBoundingClientRect();
            
            if (detector.bottom > detected.top && detector.top < detected.bottom && detector.right > detected.left && detector.left < detected.right ) {
                if (!li.classList.contains('selected')) {
                    const previousSelected = document.querySelector('.selected');

                    previousSelected?.classList.remove('selected', 'bg-white/70', 'opacity-100');
                    previousSelected?.classList.add('bg-white/30', 'opacity-80');
                    li.classList.remove('bg-white/30', 'opacity-80');
                    li.classList.add('selected', 'bg-white/70', 'opacity-100');
                }
            }
        });
    }
};

//Se seleccionan todos los btn de editar y a cada uno se le agrega un evento de click con la logica de cargar los valores en sus respectivos inputs
const activateEditBtn = () => {
    //Despues de cargar por completo el DOOM se selecciona el btn de edit y a traves de un evento se le remueve la clase hidden
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            editModal.classList.remove('hidden');
            //Seleccionar el id del producto
            const productId = phoneResolution ? e.target.closest('.edit-btn').parentElement.parentElement.parentElement.parentElement.id : e.target.closest('.edit-btn').parentElement.parentElement.id;

            //Se transforman se array a todos los inputs del formulario de editar para iterar sobre ellos y se selecciona el objeto del producto
            const inputsContainers = [ ...editForm.children[0].children[0].children ];
            productFound = productsArray.find(product => product.id === productId);

            //Mapa que relaciona los labels de los inputs con las propiedades del objeto
            const propertyMap = {
                "Nombre": "name",
                "Codigo": "code",
                "Lote": "lot",
                "Fabricante": "manufacturer",
                "Cantidad": "quantity",
                "Precio uni.": "unitPrice",
                "Minimo de alerta": "alertAmounts",
                "Descripcion": "description"
            };

            //Iterar sobre cada input del formulario y añadir su valor
            inputsContainers.forEach((div, index) => {
                //Omitir el primer elemento de la iteracion porque es un texto informativo
                if (index != 0) {
                    //Comprobamos en que posicion se encuentra el input y se añade a una constante al igual que el select
                    const input = ['TEXTAREA', 'INPUT'].includes(div.children[0].tagName) ? div.children[0] : div.children[0].children[0];
                    const select = div.children[1] && ['SELECT'].includes(div.children[1]?.tagName) ? div.children[1] : '';
                    let textLabel = '';
                    let property = '';

                    //Se comprueba si el campo no es un text area para selecionar el texto de su label y con el buscar en el mapa de relaciones el valor que deberia llevar la propiedad del objeto
                    if (!'TEXTAREA'.includes(div.children[0].tagName)) {
                        textLabel = ['INPUT'].includes(div.children[0].tagName) ? div.children[1].textContent : div.children[0].children[1].textContent;
                        property = propertyMap[textLabel];
                        
                        //En caso de que select exista se busca su valor correspondiente en el objeto del producto y se renderiza
                        if (select) select.value = textLabel === 'Cantidad' ? productFound.unit : productFound.currency;
                        input.value = property != 'alertAmounts' ? productFound[property] : productFound[property][0];
                    } else {
                        input.value = productFound.description;
                    }
                }
            });
        });
    });

};

//Funcion que se encarga de cargar todos los productos en las cards y renderizarlas
const loadProducts = async (phoneResolution) => {
    
    try {
        //Llamada a la api a traves de axios 
        const { data } = await axios.get('/api/entries', {
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
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Lote</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Cantidad</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Precio uni.</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Precio total</th>
                            <th class="p-4 min-w-16 min-h-6 text-base font-bold border-white/40 border-r-2 border-b-2">Fecha de entrada</th>
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

                tr.classList.add('bg-[#F23F3F]/10', 'relative', 'transition-all');
                tr.id = product.id;

                tr.innerHTML = `
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2 ${i === 0 ? 'rounded-es-3xl' : ''}">${product.name}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.code}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.manufacturer}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.lot}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.quantity + ' ' + product.unit}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.unitPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${product.totalPrice + ' ' + product.currency}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal border-white/40 border-r-2">${date}</td>
                    <td class="py-3 px-1 min-w-16 h-8 text-base font-normal ${i === 0 ? 'rounded-ee-3xl' : ''}">
                        <button ${product.isEditable ? '' : 'disabled'} class="edit-btn flex items-center justify-center relative z-20 h-full w-full m-auto disabled:opacity-40 disabled:hover:scale-100 hover:scale-110 transition-all">
                            <svg class="stroke-white h-full w-full max-h-8 max-w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                    </td>
                    <div class="flex items-center absolute inset-0 z-10 bg-[#09041C]/0 hover:bg-[#09041C]/70 py-1 text-white/0 hover:text-white transition-all ${i === 0 ? 'rounded-b-3xl' : ''}">
                        <p class="h-fit w-full text-center transition-all">${product.editDate != null ? 'Ultima edicion ' + editDate : editDate} ${product.isEditable ? '' : 'Ya se registro una salida del producto, no se puede editar'}</p>
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
                            <td class="w-1/2 text-base pt-2 pl-6 border-r-2 text-left">Lote</td>
                            <td class="w-1/2 text-base font-semibold text-center pt-2">${product.lot}</td>
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
                                <button ${product.isEditable ? '' : 'disabled'} class="edit-btn flex flex-row items-center justify-center h-8 w-full my-2 px-2 gap-2 mx-auto disabled:opacity-40 hover:scale-110 transition-all">
                                    <svg class="stroke-white max-h-8 max-w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <p class="max-h-8 text-sm text-white text-center">${product.editDate != null ? 'Ultima edicion ' + editDate : editDate} ${product.isEditable ? '' : 'No se puede editar'}</p>
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
            div.classList.add('h-[15rem]', 'w-full');
            tablesContainer.append(div);

            activateEditBtn();
        }
    } catch (error) {
        window.location.pathname = '/login';
    }
};

//Esta funcion se encarga de agregarle los estilos y los mensajes a los inputs y las labels
const validationStyles = (input, label) => {
    const textLabel = label.textContent;
    isValidForm = false;

    if (label.innerHTML === 'Cantidad' || label.innerHTML === 'Precio uni.') {
        const inputContainer = input.parentElement.parentElement;
        const selectValue = inputContainer.children[1];
        
        label.innerHTML = 'Campo obligatorio';
        label.classList.add('text-red-600');
        selectValue.classList.add('text-red-600');
        inputContainer.classList.add('ring-2', 'ring-red-600', 'focus:ring-red-600');

        setTimeout(() => {
            label.innerText = textLabel;
            label.classList.remove('text-red-600');
            selectValue.classList.remove('text-red-600');
            inputContainer.classList.remove('ring-2', 'ring-red-600','focus:ring-red-600');
        }, 5000);
    } else {
        label.innerHTML = 'Campo obligatorio';
        label.classList.add('text-red-600');
        input.classList.add('ring-2', 'ring-red-600', 'focus:ring-red-600');

        setTimeout(() => {
            label.innerText = textLabel;
            label.classList.remove('text-red-600');
            input.classList.remove('ring-2', 'ring-red-600','focus:ring-red-600');
        }, 5000);
    }

};

//Esta funcion se encarga de validar los inputs (que no estenvacios y que los inputs de cantidad y numero de alerta se validen con sus regex)
const inputValidations = (li) => {
    [ ...li.children ].forEach((container, index) => {
        if (index === 0) return;
        const input = container.children[0].tagName === 'DIV' ? container.children[0].children[0] : container.children[0];
        const label = container.children[0].tagName === 'DIV' ? container.children[0].children[1] : container.children[1];
        
        if (!input.value && input.id != 'description') {
            if (label) {
                validationStyles(input, label);
            }
        } else if (input.id.includes('code')) { //Comprobar si el codigo esta repetido comparando el valor altual con los valores del array que contiene los codigos
            if (codes.includes(input.value)) {
                validationStyles(input, label);
                label.innerHTML = 'Codigo repetido';
            } else {
                //Almacenar el valor alctual en el array que contiene los codigos para verificar que no esten repetidos en las siguientes iteraciones
                codes.push(input.value);
            }
        }
    });

    liCount++;
};

//Encargada de extraer la informacion de los inputs y devolver un objeto con sus valores dependiendo el caso
const infoExtractor = (container, purpose) => {
    switch (purpose) {
        case 'edit':
            const nameEdit = container.children[1].children[0].value;
            const codeEdit = container.children[2].children[0].value;
            const lotEdit = container.children[3].children[0].value;
            const manufacturerEdit = container.children[4].children[0].value;
            const quantityEdit = container.children[5].children[0].children[0].value;
            const unitEdit = container.children[5].children[1].value;
            const unitPriceEdit = container.children[6].children[0].children[0].value;
            const currencyEdit = container.children[6].children[1].value;
            const alertAmountEdit = container.children[7].children[0].value;
            const descriptionEdit = container.children[8].children[0].value;
            const totalPriceEdit = unitPriceEdit * quantityEdit;
            const alertAmountsEdit = [
                alertAmountEdit,
                alertAmountEdit * 2,
                alertAmountEdit * 3
            ];

            inputValidations(container);
            
            const editedProduct = {
                nameEdit,
                codeEdit,
                lotEdit,
                manufacturerEdit,
                quantityEdit,
                unitEdit,
                unitPriceEdit,
                currencyEdit,
                totalPriceEdit,
                alertAmountsEdit,
                descriptionEdit,
            }

            return editedProduct;

        case 'add':
            const name = container.children[1].children[0].value;
            const code = container.children[2].children[0].value;
            const lot = container.children[3].children[0].value;
            const manufacturer = container.children[4].children[0].value;
            const quantity = container.children[5].children[0].children[0].value;
            const unit = container.children[5].children[1].value;
            const unitPrice = container.children[6].children[0].children[0].value;
            const currency = container.children[6].children[1].value;
            const alertAmount = container.children[7].children[0].value;
            const description = container.children[8].children[0].value;
            const totalPrice = unitPrice * quantity;
            const alertAmounts = [
                alertAmount,
                alertAmount * 2,
                alertAmount * 3
            ];

            inputValidations(container);

            const product = {
                name,
                code,
                lot,
                manufacturer,
                quantity,
                unit,
                unitPrice,
                currency,
                totalPrice,
                alertAmounts,
                description,
            }

            return product;
    
        default:
            return 'caso invalido';
    }
};

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
    const productEntryDate = tr?.children[7].textContent;
    const productObject = productsArray.find(product => product.code === productCode && product.date.split('T')[0].split('-').reverse().join('/') === productEntryDate);
    //Asignar el valor encontrado en la descripcion del objeto del producto al mostrador de descripciones
    if (productObject && productObject.description && productObject.description != '') {
        deskDescription.textContent = productObject.description;
    } else if (productObject) {
        deskDescription.textContent = 'Sin descripcion';
    }
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
            let productDate = '';
            
            //En caso de que la vista sea mobile se buscara en las cards y en caso de que sea destock se buscara en la tabla
            if (phoneResolution) {
                productName = product.children[0]?.children[0].children[1].textContent;
                productDate = product.children[0]?.children[7].children[1].textContent;
            } else {
                productName = product.children[0]?.textContent;
                productDate = product.children[7]?.textContent;
            }

            //Crear li, agregar clases y añadirlo a la lista de productos encontrados en caso de que su nombre coincida con el valor del input
            if (productName && productName.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())) {
                const li = document.createElement('li');
                li.classList.add('w-full', 'h-fit', 'py-1', 'odd:bg-black/20', 'even:bg-black/0');
                li.innerHTML = `<button class="w-full px-2">${productName} ${productDate}</button>`;
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

//Agrega el evento de submit y envia todos los datos editados a la api 
editForm.addEventListener('submit', async e => {
    e.preventDefault();

    editSubmitBtn.disabled = true;
    setTimeout(() => {
        editSubmitBtn.disabled = false;
    }, 5100);

    try {
        isValidForm = true;

        const inputsContainer = editForm.children[0].children[0];
        
        const product = infoExtractor(inputsContainer, 'edit');
    
        if (isValidForm) {
            await axios.patch(`/api/entries/${productFound.id}`, product);

            editModal.classList.add('hidden');
            productFound = '';
            loadProducts(phoneResolution);
        }

        codes = [];

    } catch (error) {
        console.log(error);
    }
});

//Cierra el modal de editar agregandole la clase hidden
editCancelBtn.addEventListener('click', e => {
    editModal.classList.add('hidden');
});

//Abre el modal de añadir entradas
openModalBtn.addEventListener('click', e => {
    list.firstElementChild.classList.add('selected', 'bg-white/70', 'opacity-100');
    addModal.classList.remove('hidden');
});

//Cierra el modal de añadir entradas
cancelBtn.addEventListener('click', e => {
    addModal.classList.add('hidden');
    productCount = 1;
    resetList();
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
        listItemsUpdate();
        let products = [];
    
        listItems.forEach(li => {
            const product = infoExtractor(li, 'add');
            
            if (typeof product != 'string') products.push(product);
        });
        
        if (isValidForm) {
            //Se envia el array de productos a la api
            await axios.post('/api/entries', products);
            loadProducts(phoneResolution);
            resetList();
            addModal.classList.add('hidden');
            productCount = 1;
        }
        
        liCount = 0;
        codes = [];
        products = [];
    } catch (error) {
        console.log(error);
    }
});

//Añade un nuevo producto al formulario de registro de entradas
addform.addEventListener('click', e => {
    //Se comprueba si se cliqueo el boton de añadir producto al formulario
    if (e.target.closest('#add-btn')?.id === 'add-btn') {
        //Se crea el li que va a ser añadido y se le añaden sus respectivas clases
        const li = document.createElement('li');
        li.classList.add('relative', 'flex', 'flex-col', 'w-full', 'max-w-[19rem]', 'h-fit', 'px-6', 'pb-4', 'pt-4', 'gap-x-4', 'text-center', 'rounded-xl', 'md:flex-row', 'md:flex-wrap', 'bg-white/30', 'opacity-80', 'md:max-w-[34rem]');
        li.innerHTML = `
            <div class="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center text-white hidden"></div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="name${productCount}" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="name${productCount}" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Nombre</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="code${productCount}" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="code${productCount}" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Codigo</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="lot${productCount}" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="lot${productCount}" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3 transition-all">Lote</label>
            </div>
            <div class="mb-6 max-h-8 w-full md:max-w-[15rem] text-[#09041C]">
                <input type="text" placeholder="" id="manufacturer${productCount}" class="peer w-[95%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none transition-all">
                <label for="manufacturer${productCount}" class="relative bottom-12 text-[#09041C] peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3  transition-all">Fabricante</label>
            </div>
            <div class="flex flex-row justify-between h-fit w-full md:max-w-[15rem] mb-6 pr-2 rounded-full bg-white text-[#09041C] border-2 border-white">
                <div class="max-h-8 w-full">
                    <input type="number" placeholder="" id="quantity${productCount}" class="peer w-full min-h-6 py-1 px-4 rounded-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none transition-all">
                    <label for="quantity${productCount}" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Cantidad</label>
                </div>
                <select id="select-unid" class="w-[35%] max-h-8 my-1 border-l-2 outline-none text-center full bg-transparent text-[#09041C]">
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="Uni.">Uni.</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="N/A">N/A</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="kg">kg</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="g">g</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="mg">mg</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="lb">lb</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="oz">oz</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ton">ton</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="lts">Lts</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ml">ml</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="m³">m³</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cm³">cm³</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="m">m</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cm">cm</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="mm">mm</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ft">ft</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="in">in</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="paq">paq</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="doc">doc</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="cajas">Cajas</option>
                </select>
            </div>
            <div class="flex flex-row justify-between h-fit w-full md:max-w-[15rem] mb-6 pr-2 rounded-full bg-white text-[#09041C] border-2 border-white">
                <div class="max-h-8 w-full">
                    <input type="number" placeholder="" id="unit-price${productCount}" class="peer w-full min-h-6 py-1 px-4 rounded-full bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none">
                    <label for="unit-price${productCount}" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Precio uni.</label>
                </div>
                <select id="select-currency" class="w-[35%] max-h-8 my-1 border-l-2 outline-none text-center full bg-transparent text-[#09041C]">
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="$">$</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="€">€</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="Bs">Bs</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="ARS">ARS</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="COP">COP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="MXN">MXN</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="PEN">PEN</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="CLP">CLP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="BRL">BRL</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="UYU">UYU</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="PYG">PYG</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="DOP">DOP</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="GTQ">GTQ</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="CRC">CRC</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="HNL">HNL</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="NIO">NIO</option>
                    <option class="text-black/90 odd:bg-black/10 even:bg-black/0 backdrop-blur-2xl" value="BOV">BOB</option>
                </select>
            </div>
            <div class="mb-6 max-h-8 w-full text-[#09041C]">
                <input type="text" placeholder="" id="alert-amount${productCount}" class="peer w-[97%] focus:w-full min-h-6 py-1 px-4 rounded-full bg-white border-2 border-white outline-none [&::-webkit-inner-spin-button]:appearance-none transition-all">
                <label for="alert-amount${productCount}" class="relative bottom-12 text-black transition-all peer-placeholder-shown:bottom-7 peer-focus:bottom-12 peer-focus:text-sm bg-white rounded-full px-3">Minimo de alerta</label>
            </div>
            <div class="mb-4 h-8 w-full text-[#09041C]">
                <textarea placeholder="Descripcion" id="description" 
                class="description w-full min-h-6 h-9 focus:h-28 resize-none py-1 px-4 bg-white rounded-3xl border-2 border-white/90 outline-none text-base placeholder:text-[#09041C] placeholder:text-center"></textarea>
            </div>
        `;
    
        //Se añade el li a la ul, se incrementa productCount y se actualiza el array que va a contener a todos los li
        list.append(li);

        productCount ++;
        listItemsUpdate();

    } else if (e.target.closest('#remove-btn')?.id === 'remove-btn') {
        //Si en la ul existe un solo hijo entonces no se elimina
        if (listItems.length > 1) {
            //Se selecciona en el doom el li que tenga la clase selected y si existe entondes es eliminado
            const liSelected = document.querySelector('.selected');
            liSelected?.remove();

            //Se llama a la funcion encargada de añadir la clase selected y se actualiza listItems
            checkCardPosition();
            listItemsUpdate();
        }
    }
});

//Se activa cuando el usuario hace focus en algun text area de descripcion del formulario 
list.addEventListener('focusin', e => {
    if (e.target.classList.contains('description')) {
        const parentDiv = e.target.parentElement;
    
        parentDiv.classList.remove('h-8');
        parentDiv.classList.add('h-fit');
    }
});
list.addEventListener('focusout', e => {
    if (e.target.classList.contains('description')) {
        const parentDiv = e.target.parentElement;
    
        parentDiv.classList.remove('h-fit');
        parentDiv.classList.add('h-8');
    }
});

//Llama a la funcion encargada de verificar la card que debe estar seleccionada
list.addEventListener('scroll', e => {
    checkCardPosition();
});

//Cuando se esta en modo destock comprueba cual card ha sido clicqueada para seleccionarla
list.addEventListener('click', e => {
    if (window.innerWidth > 768) {
        const li = e.target.closest('li');
        const previousSelected = document.querySelector('.selected');

        previousSelected?.classList.remove('selected', 'bg-white/70', 'opacity-100');
        previousSelected?.classList.add('bg-white/30', 'opacity-80');
        li?.classList.remove('bg-white/30', 'opacity-80');
        li?.classList.add('selected', 'bg-white/70', 'opacity-100');
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
    //Se llama a la funcion encargada de resetear la lista del modal
    resetList();
}