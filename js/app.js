// ============================================================= // 
/* ======================
CACHED DOM NOTES
=========================*/

// ====== Show/Hide Modal & Carousel ====== // 
const $introModal = $(".intro")
const $duelBtn = $(".duelBtn")
const $duelistCarousel = $(".duelistCarousel")
const $selectDuelist = $(".selectDuelist")

// ====== Game Container ====== // 
const $gameContainer = $('.gameContainer')

// ======= Monster Card Img <div> ======= //
const $playerMonsterCard = $('.playerMonsterCard')
const $computerMonsterCard = $('.computerMonsterCard')

// ======= Life Points <div> ======= // 
const $playerLifePoints = $('.playerLifePoints')
const $computerLifePoints = $('.computerLifePoints')

/* ======================
GLOBAL VARS
=========================*/

// ======= Array of Monster Card Objects ======= // 
const monsterList = []

const mainTheme = new Audio("Yu-Gi-Oh - Sound Duel 1 - Passionate Duelist.mp3");
setTimeout(() => {mainTheme.play()}, 500);

/* =============================
MAIN FUNCTIONS FOR then() 
============================= */

/* =============================
HELPER FUNCTIONS FOR DOM-MANIPULATION
============================= */
const removeIntroShowCarousel = () => {
    $introModal.remove();
    $duelistCarousel.toggleClass("show");
}
const removeDuelistCarouselshowGameContainer = () => {
    $duelistCarousel.remove()
    $gameContainer.toggleClass("show");
}

/* =============================
EVENT LISTENERS
============================= */
$duelBtn.click(removeIntroShowCarousel);
$selectDuelist.click(removeDuelistCarouselshowGameContainer)

/* =============================
CLASSES
============================= */
class Player {
    constructor() {
        this.lifePoints = 2000;
        this.monsterCard = null;
    }
}
/**
 * The GameState class contains two properties for the player object and computer object.
 */
class GameState {
    constructor() {
        this.state = true;
        this.iterable = 0;
        this.player = new Player();
        this.computer = new Player();
    }
    // ================= Appending monsterCard to the page =========================== // 
    displayMonsterCard(card, node) {
        node.html(`<img src="${card.cardImg}" alt="card">`);
    }
    // ======= Get Random Monster Card ======= // 
    getRandMonstCard(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    // ======= Updates HTML to Display Life Points ============= //
    updateLifePoints(player, node) {
        node.html(`
        <div class="col card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${player.lifePoints}</h5>
                <a href="#" class="drawBtn btn btn-secondary">Draw</a>
                <a href="#" class="atkBtn btn btn-success">Attack</a>
            </div>
        </div>
        `);
    }
    initialTurn() {
        this.player.monsterCard = this.getRandMonstCard(monsterList);
        this.computer.monsterCard = this.getRandMonstCard(monsterList);
        // console.logs here
        console.log(this.player.monsterCard.atk);
        console.log(this.computer.monsterCard.atk);
        //  works here 
        this.displayMonsterCard(this.player.monsterCard, $playerMonsterCard);
        this.displayMonsterCard(this.computer.monsterCard, $computerMonsterCard);
        this.updateLifePoints(this.player, $playerLifePoints);
        this.updateLifePoints(this.computer, $computerLifePoints);
    }
    sentToGraveyardDrawNewCard(player, node) {
        player.monsterCard = this.getRandMonstCard(monsterList);
        this.displayMonsterCard(player.monsterCard, node)
        // debugging
        // console.log(player.monsterCard);
    }

    // this turn happens instantaneously 
    // add setTimeout() and alert() to slow pace of battle

    // going to have "MODULARIZE" this to pass in SEPARATE "player" depending on WHICH PLAYER calls this method
    singleBattlePhase() {

        console.log("Single battle-phase has occurred!");
        // console.log(this.player.monsterCard.atk);
        // Uncaught TypeError ??? 
        if (this.player.monsterCard.atk > this.computer.monsterCard.atk) {

            // place alerts before every step 
            alert(`You are initiating your attack phase against the opponent's Monster Card!`);

            this.computer.lifePoints -= (this.player.monsterCard.atk - this.computer.monsterCard.atk)

            alert(`The attack did ${(this.player.monsterCard.atk - this.computer.monsterCard.atk)} to your opponent's Life Points!`);

            this.updateLifePoints(this.computer, $computerLifePoints);

            alert(`${this.computer.monsterCard.name} has been sent to the Graveyard!`);

            this.sentToGraveyardDrawNewCard(this.computer, $computerMonsterCard)

        } else if (this.player.monsterCard.atk < this.computer.monsterCard.atk) {

            alert(`The opponent has initiated their attack phase against your Monster Card!`);

            this.player.lifePoints -= (this.computer.monsterCard.atk - this.player.monsterCard.atk)

            alert(`The attack did ${(this.computer.monsterCard.atk - this.player.monsterCard.atk)} to your Life Points!`);

            this.updateLifePoints(this.player, $playerLifePoints);

            alert(`${this.player.monsterCard.name} has been sent to the Graveyard!`);

            this.sentToGraveyardDrawNewCard(this.player, $playerMonsterCard);

        } else if (this.player.monsterCard.atk === this.computer.monsterCard.atk) {

            // alert (`Both ${this.player.monsterCard.name} and ${this.computer.monsterCard.name} have been sent to the Graveyard!`);

            alert(`${this.computer.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.computer, $computerMonsterCard);

            alert(`${this.player.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player, $playerMonsterCard);
            
        }

        this.checkWinState();
    }
    checkWinState() {
        if (this.player.lifePoints > 0 && this.computer.lifePoints <= 0) {
            alert("You have won!");
            location.reload();
            this.state = false;
        } else if (this.player.lifePoints <= 0 && this.computer.lifePoints > 0) {
            alert("The computer has won!");
            location.reload();
            this.state = false;
        }
    }
}

/* =============================
Yu-Gi-Oh API Database
============================= */
// ====== Global GameState ====== //
const game1 = new GameState()

// ====== Asynchronous Fetch API ======= // 
let cardData
const yugioh = async () => {
    try {
        const data = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?type=normal%20monster')
        const json = await data.json();
        cardData = json.data;
        return json;
    } catch (e) {
        console.error(e);
    }
}

// ========== GAME STARTS HERE ============= //
yugioh().then(
    () => {
        console.log('Execute all JavaScript inside this .then() method');
        console.log('inside', cardData);
        cardData.forEach((currMonstCard) => {
            const monsterCardObj = {
                name: currMonstCard.name,
                // race: currMonstCard.race,
                // desc: currMonstCard.desc,
                atk: currMonstCard.atk,
                def: currMonstCard.def,
                cardImg: currMonstCard.card_images[0].image_url,
            }
            monsterList.push(monsterCardObj);
        })
        // renders initialTurn()
        game1.initialTurn();
        console.log(game1.player.monsterCard.atk);
        // game1.singleBattlePhase();

        // ====== Need to get DOM Node only after .initialTurn() changes .html to have atkBtn ====== //
        // ====== also get's BOTH attack buttons ====== // 
        const $atkBtn = $('.atkBtn')

        // ====== add's click to BOTH attack buttons ===== // 
        // this still doesn't work
        $atkBtn.click(game1.singleBattlePhase);
        // $atkBtn.on("click", game1.singleBattlePhase);
    }
);