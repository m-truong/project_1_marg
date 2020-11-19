// ============================================================= // 
/* ======================
CACHED DOM NOTES
=========================*/

// Game Container
const $gameContainer = $('.gameContainer')

// <div> Monster Card Img
const $playerMonsterCard = $('.playerMonsterCard')
const $computerMonsterCard = $('.computerMonsterCard')

// <div> Life Points
const $playerLifePoints = $('.playerLifePoints')
const $computerLifePoints = $('.computerLifePoints')

const $introModal = $(".intro")
const $duelBtn = $(".duelBtn")
const $duelistCarousel = $(".duelistCarousel")
const $selectDuelist = $(".selectDuelist")

const $atkBtn = $('.atkBtn')

/* ======================
GLOBAL VARS
=========================*/

// const mainTheme = new Audio("Yu-Gi-Oh - Sound Duel 1 - Passionate Duelist.mp3");
// setTimeout(() => {mainTheme.play()}, 500);

// Array of Monster Card Objects 
const monsterList = []

/* =============================
MAIN FUNCTIONS FOR then() 
============================= */

const randMonsCard = (array) => {
    const randIndex = Math.floor(Math.random() * array.length);
    return array[randIndex];
}

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

// ================= Appending monsterCard to the page =========================== // 

const displayMonsterCard = (card, domElement) => {
    domElement.html(`
    <img src="${card.cardImg}" alt="card image">
    `);
}

/* =============================
CLASSES
============================= */
class GameState {
    constructor(life) {
        this.state = true;
        this.iterable = 0;
        this.player = new Player(life);
        this.computer = new Player(life);
    }
    displayMonsterCard {
        
    }
    initialTurn() {

        const card1 = randMonsCard(monsterList);
        this.player.monsterCard = card1;

        const card2 = randMonsCard(monsterList);
        this.computer.monsterCard = card2;

        displayMonsterCard(card1, $playerMonsterCard);
        displayMonsterCard(card2, $computerMonsterCard);

        this.updateLifePoints($playerLifePoints, this.player);
        this.updateLifePoints($computerLifePoints, this.computer);
    }

    drawCard(player, node) {
        // calls global randMonsCard() 
        const newCard = randMonsCard(monsterList);
        // reassigns .monsterCard property on the player-class! 
        player.monsterCard = newCard;
        // redisplays monster card on the playerNode! 
        displayMonsterCard(newCard, node)
        // console-log
        console.log(player.MonsterCard);
    }
    sendToGraveyard() {

    }
    updateLifePoints(node, currPlayer) {
        node.html(`
        <div class="col card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${currPlayer.lifePoints}</h5>
                <a href="#" class="drawBtn btn btn-secondary">Draw</a>
                <a href="#" class="atkBtn btn btn-success">Attack</a>
            </div>
        </div>
        `);
    }

    checkWinState() {
        if (this.player.lifePoints > 0 && this.computer.lifePoints <= 0) {
            alert("You have won!");
            this.state = false;
        } else if (this.player.lifePoints <= 0 && this.computer.lifePoints > 0) {
            alert("The computer has won!");
            this.state = false;
        }
    }

    singleBattlePhase() {
        console.log("Is this printing?");

        if (this.player.monsterCard.atk > this.computer.monsterCard.atk) {
            const computerLPLost = (this.player.monsterCard.atk - this.computer.monsterCard.atk)
            this.computer.lifePoints -= computerLPLost;

            // deappend the monstercard 
            // this.sendToGraveyard();

            this.updateLifePoints($playerLifePoints, this.computer);
            //  draw new card 
            this.drawCard(this.computer, $computerMonsterCard)

        } else if (this.player.monsterCard.atk < this.computer.monsterCard.atk) {

            const playerLPLost = (this.computer.monsterCard.atk - this.player.monsterCard.atk)
            this.player.lifePoints -= playerLPLost;
            // deappend the monstercard
            // this.sendToGraveyard(); 
            this.updateLifePoints($computerLifePoints, this.player);
            //  draw new card 
            this.drawCard(this.player, $playerMonsterCard);

        } else if (this.player.monsterCard.atk === this.computer.monsterCard.atk) {
            console.log("both cards need to be sent to graveyard");
            // deappend both cards
            // this.sendToGraveyard();
            // this.sendToGraveyard(); 
            // draw two new cards
        }
        this.checkWinState();
    }

}
class Player {
    constructor(lifepoints = 2000) {
        this.lifePoints = lifepoints;
        this.monsterCard = null;
    }
}
// class Card {}



/* =============================
Yu-Gi-Oh API Database
============================= */
// Global scope
const game1 = new GameState(2000)

let cardData
const yugioh = async () => {
    try {
        const data = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?type=normal%20monster')
        const json = await data.json();
        cardData = json.data;
        return json;
    } catch (err) {
        console.error(err);
    }
}
// Call starts here // 
yugioh().then(
    () => {
        console.log('Execute all JavaScript inside this .then() method');
        console.log('inside', cardData);
        cardData.forEach((currMonstCard) => {
            const monsterCardObj = {
                name: currMonstCard.name, // string
                race: currMonstCard.race, // string
                desc: currMonstCard.desc, // string
                atk: currMonstCard.atk, // int
                def: currMonstCard.def, // int
                cardImg: currMonstCard.card_images[0].image_url, // string of image URL
            }
            monsterList.push(monsterCardObj);
        })
        // renders first initial cards
        game1.initialTurn();
        // this still doesn't work
        $atkBtn.on("click", game1.singleBattlePhase);
    }
);