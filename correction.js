console.log("script loaded");
const form = document.querySelector("form");
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regexTel = /^(\+33\s?|0)\s?[1-9]\s?(\d{2}\s?){3}\d{2}$/;
const info = document.createElement("p");

// Ecouteurs d'événements
form.firstName.addEventListener("keyup", () => {
    countChar(form.firstName);
});

form.lastName.addEventListener("keyup", () => {
    countChar(form.lastName);
});

form.email.addEventListener("keyup", () => {
    validationUI(form.email, regexEmail);
});

form.pass1.addEventListener("keyup", () => {
    checkPass(form.pass1, form.pass2);
});

form.pass2.addEventListener("keyup", () => {
    checkPass(form.pass1, form.pass2);
});

form.contact.addEventListener("keyup", () => {
    validationUI(form.contact, regexTel);
});

form.majeur.addEventListener("change", () => {
    isMajor(form.majeur);
});

// Soumission du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("==================> form submitted");
    let isValid = false;
    let verif = [];
    for (let i = 0; i < form.elements.length; i++) {
        let field = form.elements[i];
        if (field.id === "firstName") {
            field.value = sanitizeInput(field.value);
            isValid = countChar(field);
            verif.push(isValid);
        }
        if (field.id === "lastName") {
            field.value = sanitizeInput(field.value);
            isValid = countChar(field);
            verif.push(isValid);
        }
        if (field.id === "email") {
            isValid = validationUI(field, regexEmail);
            verif.push(isValid);
        }
        if (field.id === "pass1" || field.id === "pass2") {
            isValid = checkPass(form.pass1, form.pass2);
            // hashage du mot de passe

            verif.push(isValid);
        }
        if (field.id === "contact") {
            isValid = validationUI(field, regexTel);
            verif.push(isValid);
        }
        if (field.id === "majeur") {
            isValid = isMajor(field);
            verif.push(isValid);
        }
    }

    console.log("verif => ", verif);

    let checker = (arr) => arr.every((v) => v === true);

    console.log("checker => ", checker(verif));

    if (checker(verif)) {
        setInterval(() => {
            console.log("✅ data sent to server");
            localStorage.setItem("id", Date.now());
            form.reset();
            // Stocker les données dans le localStorage
        }, 2000);
    } else {
        console.warn("FORM IS INVALID");
    }
});

// Compter le nombre de caractères
function countChar(input) {
    if (input.value.length > 4 && input.value.length <= 20) {
        input.classList.remove("danger");
        input.classList.add("success");
        input.parentElement.classList.add("success-checked");
        return true;
    } else {
        input.classList.remove("success");
        input.parentElement.classList.remove("success-checked");
        input.classList.add("danger");
        return false;
    }
}

// Vérifier la présence d'un mail valide ou d'un numéro de téléphone valide
function validationUI(input, regex) {
    if (regex.test(input.value)) {
        input.classList.remove("danger");
        input.classList.add("success");
        input.parentElement.classList.add("success-checked");
        console.info(`✅ ${input.id} is valid`);
        return true;
    } else {
        input.classList.remove("success");
        input.parentElement.classList.remove("success-checked");
        input.classList.add("danger");
        console.warn(`${input.id} is invalid`);
        return false;
    }
}

// Tester si les mots de passe sont identiques
function checkPass(pass1, pass2) {
    // console.log('pass1 => ', pass1.value);
    // console.log('pass2 => ', pass2.value);

    if (
        pass1.value === pass2.value &&
        pass1.value.length > 4 &&
        pass2.value.length > 4
    ) {
        pass1.classList.remove("danger");
        pass1.classList.add("success");
        pass2.classList.remove("danger");
        pass2.classList.add("success");
        console.info(`✅ passwords are identical`);
        return true;
    } else {
        pass1.classList.remove("success");
        pass1.classList.add("danger");
        pass2.classList.remove("success");
        pass2.classList.add("danger");
        console.warn(`passwords are different`);
        return false;
    }
}

function isMajor(input) {
    if (input.checked) {
        input.parentElement.classList.remove("danger");
        input.parentElement.classList.add("success");
        console.info(`✅ user is major`);
        return true;
    } else {
        input.parentElement.classList.remove("success");
        input.parentElement.classList.add("danger");
        console.warn(`user is minor`);
        return false;
    }
}

// Empêcher les injections de code ou de caractères spéciaux
function sanitizeInput(input) {
    // Enlever les balises HTML
    input = input.replace(/<[^>]*>/g, "");
    // Enlever les caractères spéciaux dangereux
    input = input.replace(/[^a-zA-Z0-9 ]/g, "");
    // Enlever les espaces multiples
    input = input.replace(/\s\s+/g, " ");
    // Enlever les espaces en début et fin de chaîne
    input = input.trim();
    return input;
}


// REVIEW Exporter les fonctions dans un fichier JS
