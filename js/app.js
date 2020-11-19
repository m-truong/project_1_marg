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

// const mainTheme = new Audio("Yu-Gi-Oh - Sound Duel 1 - Passionate Duelist.mp3");
// setTimeout(() => {mainTheme.play()}, 500);

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

        // Gave Function to the button, so "this" refers to the button, NOT the class-object instance 
        // Always going to refer to "this" instance of object // only for refering to property of "this" object
        // if invoking with an "event-listener", then use bind() when inside async function
        this.singleBattlePhase = this.singleBattlePhase.bind(this);
        this.initialTurn = this.initialTurn.bind(this);
        // bind just in case 
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
    updateLifePoints(player, node, num) {
        node.html(`
        <div class="col card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${player.lifePoints}</h5>
                <a href="#" class="drawBtn${num} btn btn-secondary">Draw</a>
                <a href="#" class="atkBtn${num} btn btn-success">Attack</a>
            </div>
        </div>
        `);
        console.log(node);
    }
    initialTurn() {
        this.player.monsterCard = this.getRandMonstCard(monsterList); 
        this.computer.monsterCard = this.getRandMonstCard(monsterList);

        this.displayMonsterCard(this.player.monsterCard, $playerMonsterCard);
        this.displayMonsterCard(this.computer.monsterCard, $computerMonsterCard);
        this.updateLifePoints(this.player, $playerLifePoints, 1);
        this.updateLifePoints(this.computer, $computerLifePoints, 2);
    }
    sentToGraveyardDrawNewCard(player, node) {
        player.monsterCard = this.getRandMonstCard(monsterList);
        this.displayMonsterCard(player.monsterCard, node)
    }

    singleBattlePhase(evt) {
        evt.preventDefault();
        console.log("Single battle-phase has occurred!");

        if (this.player.monsterCard.atk > this.computer.monsterCard.atk) {

            alert(`After initiating the Attack Phase, Player 1's Monster Card's Attack Points are greater than Player 2's Monster Card's Attack Points!`)

            this.computer.lifePoints -= (this.player.monsterCard.atk - this.computer.monsterCard.atk)

            alert(`The attack did ${(this.player.monsterCard.atk - this.computer.monsterCard.atk)} damage to Player 2's Life Points!`);

            this.updateLifePoints(this.computer, $computerLifePoints);

            alert(`${this.computer.monsterCard.name} has been sent to the Graveyard!`);

            this.sentToGraveyardDrawNewCard(this.computer, $computerMonsterCard)

        } else if (this.player.monsterCard.atk < this.computer.monsterCard.atk) {
            alert(`After initiating the Attack Phase, Player 2's Monster Card's Attack Points are greater than Player 1's Monster Card's Attack Points!`)

            this.player.lifePoints -= (this.computer.monsterCard.atk - this.player.monsterCard.atk)

            alert(`The attack did ${(this.computer.monsterCard.atk - this.player.monsterCard.atk)} damage to Player 1's Life Points!`);

            this.updateLifePoints(this.player, $playerLifePoints);

            alert(`${this.player.monsterCard.name} has been sent to the Graveyard!`);

            this.sentToGraveyardDrawNewCard(this.player, $playerMonsterCard);

        } else if (this.player.monsterCard.atk === this.computer.monsterCard.atk) {
            alert(`No damage was done to either players' Life Points, but both players' Monster Cards are sent to the Graveyard!`);
            // alert (`Both ${this.player.monsterCard.name} and ${this.computer.monsterCard.name} have been sent to the Graveyard!`);

            alert(`${this.computer.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.computer, $computerMonsterCard);

            alert(`${this.player.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player, $playerMonsterCard);


        }

        this.checkWinState();
    }
    checkWinState() { // you do have negative numbers in YuGiOh
        if (this.player.lifePoints > 0 && this.computer.lifePoints <= 0) {
            alert("Player 1 has won! Thank you for playing!");
            location.reload();
            // this.state = false;
        } else if (this.player.lifePoints <= 0 && this.computer.lifePoints > 0) {
            alert("Player 2 has won! Thank you for playing!");
            location.reload();
            // this.state = false;
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

// ========== GAME ENTRYPOINT STARTS HERE ============= //
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
        game1.initialTurn(monsterList);

        // ====== Need to get DOM Node only after .initialTurn() changes .html to have atkBtn ====== //
        // ====== also get's BOTH attack buttons ====== // 
        const $atkBtn1 = $('.atkBtn1')
        console.log($atkBtn1);

        const $atkBtn2 = $('.atkBtn2')
        console.log($atkBtn2);
        // try .eq()method

        // ====== add's click to BOTH attack buttons ===== // 

        $atkBtn1.click(game1.singleBattlePhase)
        
        $atkBtn2.click(game1.singleBattlePhase)


        // Targeting Separate Cards! 
        // target properly the card itself 
        // add event listener, function going to use has a PARAMETER that accepts WHICH card pointing AT 
    }
);
