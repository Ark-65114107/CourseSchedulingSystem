

export const debounce = (fun, delay) => {
    let timer;
    return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fun();
        }, delay)
    }
}