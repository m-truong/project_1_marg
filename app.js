const $monsterCard = $('#monster')
let monsterList = []

// ============================================================= // 

/* ======================
CACHED DOM NOTES
=========================*/
const introModal = $(".intro")
const duelBtn = $(".duelBtn")
const duelistCarousel = $(".duelistCarousel")
const selectDuelist = $(".selectDuelist");

/* ======================
GLOBAL VARS
=========================*/
// const mainTheme = new Audio("Yu-Gi-Oh - Sound Duel 1 - Passionate Duelist.mp3");
// setTimeout(() => {mainTheme.play()}, 500);

/* =============================
MAIN FUNCTIONS FOR THEN()
============================= */
const randMonsCard = (array) => {
    const randIndex = Math.floor(Math.random() * array.length);
    console.log(`This card's Index is ${randIndex}`)
    return array[randIndex]; 
}
/* =============================
HELPER FUNCTIONS FOR DOM-MANIPULATION
============================= */
const removeIntro = () => {
    introModal.remove();
}
const showDuelistCarousel = () => {
    duelistCarousel.toggleClass("open");
}
const removeDuelistCarousel = () => {
    duelistCarousel.remove()
}

/* =============================
EVENT LISTENERS
============================= */
duelBtn.click(removeIntro);
duelBtn.click(showDuelistCarousel);
selectDuelist.click(removeDuelistCarousel)

/* =============================
CLASSES
============================= */

/* =============================
Yu-Gi-Oh API Database
============================= */
let cardData
const yugioh = async () => {
    try {
        const data = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?type=normal%20monster')
        const json = await data.json();
        cardData = json.data;
        return json;
    }
    catch (err) {
        console.error(err);
    }
}
yugioh().then(
    () => {
        console.log('Execute all JavaScript inside this .then() method');
        console.log('inside', cardData);
        const currMonstCard = randMonsCard(cardData);

        console.log(currMonstCard);
        const monsterCardObj = {
            name: currMonstCard.name, // string
            race: currMonstCard.race, // string
            desc: currMonstCard.desc, // string
            atk: currMonstCard.atk, // int
            def: currMonstCard.def, // int
            cardImg: currMonstCard.card_images[0].image_url, // string of image URL
        }
        displayMonsterCard(monsterCardObj);
        monsterList.push(monsterCardObj);
    }

);

// ================= Appending monsterCard to the DOM =========================== // 
const displayMonsterCard = (isRenderedCard) => {
    isRenderedCard = $(`
        <div class="monsterCard">
        <img src="${isRenderedCard.cardImg}" alt="card image">
        </div> 
    `)
    $('#monster').append(isRenderedCard);
}
