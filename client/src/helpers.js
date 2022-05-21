import dictionary from "./content";

export function validateEmail(mailString) {
    const mailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mailString.match(mailRegex)) {
        return true;
    } else {
        return false;
    }
}

export function generateLikeText(likes, language) {
    switch (likes) {
        case 0: {
            return dictionary.nolikes[language];
        }
        case 1: {
            return dictionary.onelike[language];
        }
        default: {
            return `${likes} ${dictionary.morelikes[language]}!`;
        }
    }
}

export function removeDuplicates(array) {
    return [...array].filter((item,
        index) => array.indexOf(item) === index);
};

export function filterFromObject(object, property) {
    const {
        [Object.keys(property)]: removedProperty, ...newObject
    } = object;
    return newObject
}

export function hasNumber(myString) {
    return /\d/.test(myString);
}

export function filterByTerm (data, term, size) {
    return data.filter(a => a >= term).slice(0, size);
};