function leadingZero(i) {
    return (i < 10) ? "0" + i : i;
}

const data = new Date();

function showTextTime() {
    const data = new Date();
    const menutime = document.querySelector("#menutime");
    const dniTygodnia = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const dzien = `${dniTygodnia[data.getDay()]}, ${leadingZero(data.getDate())} . ${leadingZero(data.getMonth() + 1)} . ${data.getFullYear()}`
    const godzina = `${leadingZero(data.getHours())} : ${leadingZero(data.getMinutes())} : ${leadingZero(data.getSeconds())}`
    menutime.innerHTML = dzien + "<br>" + godzina;
}
showTextTime();
const timeRefresh = setInterval(showTextTime, 1000);

let currentDay = parseInt(data.getDay());
switch (currentDay) {
    case 1:
        document.querySelector("#days div:nth-child(1)").style.textDecoration = ("underline");
        break;
    case 2:
        document.querySelector("#days div:nth-child(2)").style.textDecoration = ("underline");
        break;
    case 3:
        document.querySelector("#days div:nth-child(3)").style.textDecoration = ("underline");
        break;
    case 4:
        document.querySelector("#days div:nth-child(4)").style.textDecoration = ("underline");
        break;
    case 5:
        document.querySelector("#days div:nth-child(5)").style.textDecoration = ("underline");
        break;
}

const lekcje = document.querySelectorAll(".lekcje .lekcja");
for (let i = 0; i < lekcje.length; i++) {
    lekcje[i].id = i;
}
let daneLekcji = [];
for (let i = 0; i < lekcje.length; i++) {
    daneLekcji[i] = [];
}
if (localStorage.length != 0) {
    daneLekcji = JSON.parse(localStorage.getItem("daneLekcjiStorage"));
    for (let i = 0; i < lekcje.length; i++) {
        if (daneLekcji[i].length != 0) {
            const lekcja = document.querySelector(`div[id="${i}"]`);
            lekcja.innerHTML = (`<h2>${daneLekcji[i][0].substring(0, 15)}${(daneLekcji[i][0].length > 15) ? "..." : ""}</h2><p>${daneLekcji[i][1]} - ${daneLekcji[i][2]}</p>`);
            if (daneLekcji[i][3]) lekcja.innerHTML += (`<p>sala ${daneLekcji[i][3]}</p>`);
            lekcja.className = "lekcja submitted";
        }
    }
}

function editLesson() {
    const menuContent = document.querySelector("#menucontent");
    let i = parseInt(this.id);
    if (this.className != "lekcja submitted") {
        console.log(i);
        menuContent.innerHTML =
            (`
        <form>
            <p>Lekcja:</p>
            <input type="text" name="nazwaLekcji" placeholder="Nazwa lekcji" required="required" maxlength="50">
            <p>Trwa od:</p>
            <input type="time" name="czasOd" min="07:00" max="18:00" required="required">
            <p>do:</p>
            <input type="time" name="czasDo" min="07:00" max="18:00" required="required">
            <p>Sala (opcjonalnie):</p>
            <input type="text" name="sala" placeholder="Numer sali">
            <p>Nauczyciel (opcjonalnie):</p>
            <input type="text" name="nauczyciel" placeholder="Nauczyciel">
            <br>
            <div id="buttons">
                <input type="submit" name="dodaj" value="Dodaj">
                <input type="button" name="anuluj" value="Anuluj">
            <div>
        </form>
        `)

        const formularz = document.querySelector('#menucontent form');
        const nazwaLekcji = document.querySelector('input[name="nazwaLekcji"]');
        const czasOd = document.querySelector('input[name="czasOd"]');
        const czasDo = document.querySelector('input[name="czasDo"]');
        const sala = document.querySelector('input[name="sala"]');
        const nauczyciel = document.querySelector('input[name="nauczyciel"]');
        const dodaj = document.querySelector('input[name="dodaj"]');
        const lekcja = document.querySelector(`div[id="${i}"]`);
        const anuluj = document.querySelector('input[name="anuluj"]');

        anuluj.addEventListener("click", startShowingCurrentLesson)
        dodaj.addEventListener("click", () => {
            const liczbaSekundOd = ((parseInt(czasOd.value.substring(0, 2)) * 60) + parseInt(czasOd.value.substring(3, 5))) * 60;
            const liczbaSekundDo = ((parseInt(czasDo.value.substring(0, 2)) * 60) + parseInt(czasDo.value.substring(3, 5))) * 60;

            if (liczbaSekundOd >= liczbaSekundDo) {
                alert("Podane godziny są nieprawidłowe: godzina zakończenia lekcji jest wcześniejsza lub równa godzinie rozpoczęcia");
            } else if (liczbaSekundOd < 25200 || liczbaSekundDo > 64800) {
                alert("Podane godziny są nieprawidłowe: godziny rozpoczęcia i zakończenia lekcji muszą znajdować się w przedziale od 07:00 do 18:00");
            } else if (i % 9 != 0) {
                let warunek1 = true;
                let warunek2 = true;
                for (let j = i - 1; j >= parseInt(i / 9) * 9; j--) {

                    if (daneLekcji[j][6] != undefined && liczbaSekundOd < daneLekcji[j][6]) {
                        alert("Podane godziny są nieprawidłowe: lekcja musi zaczynać się po tej, która jest wyżej w planie");
                        warunek1 = false;
                        break;
                    }
                }
                for (let j = i + 1; j <= parseInt((i / 9)) * 9 + 8; j++) {
                    if (daneLekcji[j][5] != undefined && liczbaSekundDo > daneLekcji[j][5]) {
                        alert("Podane godziny są nieprawidłowe: lekcja musi kończyć się przed tą, która jest niżej w planie");
                        warunek2 = false;
                        break;
                    }
                }
                if (warunek1 && warunek2) {
                    if (nazwaLekcji.value && czasOd.value && czasDo.value) {
                        submitLesson(liczbaSekundOd, liczbaSekundDo);
                        startShowingCurrentLesson();
                    } else {
                        alert("Nie podano wymaganych wartości");
                    }
                }
            } else {
                let warunek = true;
                for (let j = i + 1; j <= parseInt((i / 9)) * 9 + 8; j++) {
                    if (daneLekcji[j][5] != undefined && liczbaSekundDo > daneLekcji[j][5]) {
                        alert("Podane godziny są nieprawidłowe: lekcja musi kończyć się przed tą, która jest niżej w planie");
                        warunek = false;
                        break;
                    }
                }
                if (warunek) {
                    if (nazwaLekcji.value && czasOd.value && czasDo.value) {
                        submitLesson(liczbaSekundOd, liczbaSekundDo);
                        startShowingCurrentLesson();
                    } else {
                        alert("Nie podano wymaganych wartości");
                    }
                }
            }
        })

        function submitLesson(liczbaSekundOd, liczbaSekundDo) {
            daneLekcji[i] = [nazwaLekcji.value, czasOd.value, czasDo.value, sala.value, nauczyciel.value, liczbaSekundOd, liczbaSekundDo]
            localStorage.setItem("daneLekcjiStorage", JSON.stringify(daneLekcji));
            lekcja.innerHTML = (`<h2>${daneLekcji[i][0].substring(0, 15)}${(daneLekcji[i][0].length > 15) ? "..." : ""}</h2><p>${daneLekcji[i][1]} - ${daneLekcji[i][2]}</p>`);
            if (sala.value) lekcja.innerHTML += (`<p>sala ${daneLekcji[i][3]}</p>`);
            lekcja.className = "lekcja submitted";
        }

        formularz.addEventListener("submit", function (event) {
            event.preventDefault();
        })
    }
    else {
        menuContent.innerHTML =
            (`
        <section>
            <p>Lekcja:</p>
            <h1>${daneLekcji[i][0]}</h1>
            <p>Trwa od:</p>
            <h1>${daneLekcji[i][1]}</h1>
            <p>do:</p>
            <h1>${daneLekcji[i][2]}</h1>
            <p>Sala:</p>
            <h1>${daneLekcji[i][3]}</h1>
            <p>Nauczyciel:</p>
            <h1>${daneLekcji[i][4]}</h1>
            <br>
            <div id="buttons">
                <input type="button" name="edytuj" value="Edytuj">
                <input type="button" name="anuluj" value="Anuluj">
                <br><br>
                <input type="button" name="usun" value="Usuń">
            </div>
        </section>
        `)
        const edytuj = document.querySelector('input[name="edytuj"]');
        const anuluj = document.querySelector('input[name="anuluj"]');
        const usun = document.querySelector('input[name="usun"]')
        anuluj.addEventListener("click", startShowingCurrentLesson)
        usun.addEventListener("click", function () {
            const lekcja = document.querySelector(`div[id="${i}"]`);
            if (confirm("Czy na pewno chcesz usunąć lekcję?")) {
                daneLekcji[i] = [];
                localStorage.setItem("daneLekcjiStorage", JSON.stringify(daneLekcji));
                lekcja.className = "lekcja";
                lekcja.innerHTML = "";
                startShowingCurrentLesson();
            }
        })
        edytuj.addEventListener("click", () => {
            const menuContent = document.querySelector("#menucontent");
            let i = parseInt(this.id);
            console.log(i);
            const lekcja = document.querySelector(`div[id="${i}"]`);
            menuContent.innerHTML =
                (`
            <form>
                <p>Lekcja:</p>
                <input type="text" name="nazwaLekcji" placeholder="Nazwa lekcji" required="required" maxlength="50">
                <p>Trwa od:</p>
                <input type="time" name="czasOd" min="07:00" max="18:00" required="required">
                <p>do:</p>
                <input type="time" name="czasDo" min="07:00" max="18:00" required="required">
                <p>Sala (opcjonalnie):</p>
                <input type="text" name="sala" placeholder="Numer sali">
                <p>Nauczyciel (opcjonalnie):</p>
                <input type="text" name="nauczyciel" placeholder="Nauczyciel">
                <br>
                <div id="buttons">
                    <input type="submit" name="potwierdz" value="Potwierdź">
                    <input type="button" name="anuluj" value="Anuluj">
                </div>
            </form>
            `)

            const formularz = document.querySelector('#menucontent form');
            const nazwaLekcji = document.querySelector('input[name="nazwaLekcji"]');
            const czasOd = document.querySelector('input[name="czasOd"]');
            const czasDo = document.querySelector('input[name="czasDo"]');
            const sala = document.querySelector('input[name="sala"]');
            const nauczyciel = document.querySelector('input[name="nauczyciel"]');
            const potwierdz = document.querySelector('input[name="potwierdz"]');
            const anuluj = document.querySelector('input[name="anuluj"]');

            nazwaLekcji.value = daneLekcji[i][0];
            czasOd.value = daneLekcji[i][1];
            czasDo.value = daneLekcji[i][2];
            sala.value = daneLekcji[i][3];
            nauczyciel.value = daneLekcji[i][4];


            anuluj.addEventListener("click", startShowingCurrentLesson)
            potwierdz.addEventListener("click", () => {
                const liczbaSekundOd = ((parseInt(czasOd.value.substring(0, 2)) * 60) + parseInt(czasOd.value.substring(3, 5))) * 60;
                const liczbaSekundDo = ((parseInt(czasDo.value.substring(0, 2)) * 60) + parseInt(czasDo.value.substring(3, 5))) * 60;
                if (liczbaSekundOd >= liczbaSekundDo) {
                    alert("Podane godziny są nieprawidłowe: godzina zakończenia lekcji jest wcześniejsza lub równa godzinie rozpoczęcia");
                } else if (liczbaSekundOd < 25200 || liczbaSekundDo > 64800) {
                    alert("Podane godziny są nieprawidłowe: godziny rozpoczęcia i zakończenia lekcji muszą znajdować się w przedziale od 07:00 do 18:00");
                } else if (i % 9 != 0) {
                    let warunek1 = true;
                    let warunek2 = true;
                    for (let j = i - 1; j >= parseInt(i / 9) * 9; j--) {

                        if (daneLekcji[j][6] != undefined && liczbaSekundOd < daneLekcji[j][6]) {
                            alert("Podane godziny są nieprawidłowe: lekcja musi zaczynać się po tej, która jest wyżej w planie");
                            warunek1 = false;
                            break;
                        }
                    }
                    for (let j = i + 1; j <= parseInt((i / 9)) * 9 + 8; j++) {
                        if (daneLekcji[j][5] != undefined && liczbaSekundDo > daneLekcji[j][5]) {
                            alert("Podane godziny są nieprawidłowe: lekcja musi kończyć się przed tą, która jest niżej w planie");
                            warunek2 = false;
                            break;
                        }
                    }
                    if (warunek1 && warunek2) {
                        if (nazwaLekcji.value && czasOd.value && czasDo.value) {
                            submitEditedLesson(liczbaSekundOd, liczbaSekundDo);
                            startShowingCurrentLesson();
                        } else {
                            alert("Nie podano wymaganych wartości");
                        }
                    }
                } else {
                    let warunek = true;
                    for (let j = i + 1; j <= parseInt((i / 9)) * 9 + 8; j++) {
                        if (daneLekcji[j][5] != undefined && liczbaSekundDo > daneLekcji[j][5]) {
                            alert("Podane godziny są nieprawidłowe: lekcja musi kończyć się przed tą, która jest niżej w planie");
                            warunek = false;
                            break;
                        }
                    }
                    if (warunek) {
                        if (nazwaLekcji.value && czasOd.value && czasDo.value) {
                            submitEditedLesson(liczbaSekundOd, liczbaSekundDo);
                            startShowingCurrentLesson();
                        } else {
                            alert("Nie podano wymaganych wartości");
                        }
                    }
                }
            })

            function submitEditedLesson(liczbaSekundOd, liczbaSekundDo) {
                daneLekcji[i] = [nazwaLekcji.value, czasOd.value, czasDo.value, sala.value, nauczyciel.value, liczbaSekundOd, liczbaSekundDo]
                localStorage.setItem("daneLekcjiStorage", JSON.stringify(daneLekcji));
                lekcja.innerHTML = (`<h2>${daneLekcji[i][0].substring(0, 15)}${(daneLekcji[i][0].length > 15) ? "..." : ""}</h2><p>${daneLekcji[i][1]} - ${daneLekcji[i][2]}</p>`);
                if (sala.value) lekcja.innerHTML += (`<p>sala ${daneLekcji[i][3]}</p>`);
            }

            formularz.addEventListener("submit", function (event) {
                event.preventDefault();
            })

        })

    }
}

for (let i = 0; i < lekcje.length; i++) {
    lekcje[i].addEventListener('click', editLesson);
    lekcje[i].addEventListener('click', stopShowingCurrentLesson);
}

function showCurrentLesson() {
    const data = new Date();
    const dzienTygodnia = parseInt(data.getDay());
    const currentLiczbaSekund = (data.getHours() * 3600) + (data.getMinutes() * 60) + data.getSeconds();
    const menuContent = document.querySelector("#menucontent");
    let czyJestLekcja = false;
    let j;

    for (let i = (dzienTygodnia - 1) * 9; i <= (dzienTygodnia * 9) - 1; i++) {
        if (currentLiczbaSekund >= daneLekcji[i][5] && currentLiczbaSekund <= daneLekcji[i][6]) {
            czyJestLekcja = true;
            j = i;
            break;
        }
    }
    if (czyJestLekcja) {
        menuContent.innerHTML =
            (`
        <section>
            <p>Obecnie trwa:</p>
            <h1>${daneLekcji[j][0]}</h1>
            <p>Do końca zostało:</p>
            <h1>${parseInt((daneLekcji[j][6] - currentLiczbaSekund) / 60)} min ${(daneLekcji[j][6] - currentLiczbaSekund) - (parseInt((daneLekcji[j][6] - currentLiczbaSekund) / 60) * 60)} sek</h1>
        </section>
        `)
    } else {
        menuContent.innerHTML =
            (`
        <section>
            <p>Obecnie trwa:</p>
            <h1>Przerwa</h1>
        </section>
        `)
    }
}

function startShowingCurrentLesson() {
    showCurrentLesson();
    timeRefresh2 = setInterval(showCurrentLesson, 1000);
}
function stopShowingCurrentLesson() {
    clearInterval(timeRefresh2);
}
showCurrentLesson();
startShowingCurrentLesson();