export const getDate = (date) => {
    date = new Date(parseInt(date));
    return String(date).slice(4, 15);
};


export const getDateWithoutTime = (date, x = 0) => {
    if(x) date = String(date) + "000";
    date = String(new Date(Number(date)));
    return date.slice(4, 15);
};

export const Z_ = (z) => {
    return z > 9 ? z : "0"+z;
};

export const getTime = (date, x = 0) => {
    if(x) date = String(date) + "000";
    date = new Date(Number(date));
    const hr = date.getHours();
    let m = "AM";
    if(hr >= 12) m = "PM";
    return `${Z_(hr)}:${Z_(date.getMinutes())} ${m}`;
}

export const getFullDateWithTime = (date, x = 0) => {
    return getDateWithoutTime(date, x) + " at " + getTime(date, x);
};


export const parseStringData = (data, argFn = null) => {
    const res = {};
    const spls = data.split('%x2');
    for(let spl of spls) {
        const [key, value] = spl.split('=');
        if(!key) continue;
        else if(argFn) res[key] = argFn(key, value);
        else res[key] = (value||'').replaceAll('%x3', '\n');
    }
    return res;
};

export const parseOfferData = (data) => {
    const res = { users: [] };
    const spls = data.split('%x2');
    for(let spl of spls) {
        const [key, value] = spl.split('=');
        if(!key) continue;
        else if(key === "users") res[key] = (value || '').split("%+%");
        else res[key] = (value||'').replaceAll('%x3', '\n');
    }
    return res;
}

export const setMessageFn = (fn, text) => {
    fn(text);
    setTimeout(() => fn({}), 2000);
};

export const shortenAddy = (addy) => {
    return addy.slice(0, 6) + '...' + addy.slice(-4);
};