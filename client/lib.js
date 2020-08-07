//generates random id;
let guidItem = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    let finalStr = '';
    for (let i = 0; i < 8; i++) {
        finalStr += s4();
    }
    return finalStr;
}

export default guidItem;