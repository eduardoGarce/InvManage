const div = document.querySelector('#notification');

export const createNotification = (isError, message) => {
    if (isError) {
        div.innerHTML = `
        <div class="w-1/3 ml-auto px-4 flex justify-end text-white">
            <p class="bg-[#F23F3F]/90 p-4 w-full rounded-lg font-bold">${message}</p>
        </div>
    `;
    } else {
    div.innerHTML = `
        <div class="w-1/3 ml-auto px-4 flex justify-end text-white">
            <p class="bg-white/30 p-4 w-full rounded-lg font-bold">${message}</p>
        </div>
    `
    }
}