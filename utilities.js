function generateRandomWord(length) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';

    let word = '';
    for (let i = 0; i < length; i++) {
        const letters = i % 2 === 0 ? consonants : vowels;
        word += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return word;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getNextMonday() {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const daysTillNextMonday = (7 - dayOfWeek + 1) % 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysTillNextMonday);
}
