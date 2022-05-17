import dictionary from "./content";

function validateEmail(mailString) {
    const mailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mailString.match(mailRegex)) {
        return true;
    } else {
        return false;
    }
}

function generateLikeText(likes, language) {
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

export {
    validateEmail,
    generateLikeText
}