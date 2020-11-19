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
const $player1MonsterCard = $('.player1MonsterCard')
const $player2MonsterCard = $('.player2MonsterCard')

// ======= Life Points <div> ======= // 
const $player1LifePoints = $('.player1LifePoints')
const $player2LifePoints = $('.player2LifePoints')

// Player 1 and Player 2 Attack Buttons // 
const $atkBtn1 = $('.atkBtn1')
const $atkBtn2 = $('.atkBtn2')

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
GAMESTATE CLASS
============================= */

/**
 * The GameState class contains a player1 object property, player2 object property,
 * and two methods that are bound to object instances of the class to allow the click event-listeners to work.
 */
class GameState {
    constructor() {
        this.player1 = {
            lifePoints: 2000,
            monsterCard: null,
        }
        this.player2 = {
            lifePoints: 2000,
            monsterCard: null,
        }
        this.singleBattlePhase = this.singleBattlePhase.bind(this);
        this.initialTurn = this.initialTurn.bind(this);
    }
    // ================= Appending monsterCard to the page =========================== // 
    displayMonsterCard(card, node) {
        const tempImg = node.attr("src");
        node.attr("src", `${card.cardImg}`);
        if (tempImg !== card.cardImg) {
            node.toggleClass('animate__animated animate__jello');
            setTimeout(() => {
                node.toggleClass('animate__animated animate__jello');
            }, 500);
        }
    }
    // ======= Get Random Monster Card ======= // 
    getRandMonstCard(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    // ======= Updates HTML to Display Life Points ============= //
    updateLifePoints(player, node) {
        node.html(`${player.lifePoints}`);

    }
    initialTurn() {
        this.player1.monsterCard = this.getRandMonstCard(monsterList);
        this.player2.monsterCard = this.getRandMonstCard(monsterList);
        this.displayMonsterCard(this.player1.monsterCard, $player1MonsterCard);
        this.displayMonsterCard(this.player2.monsterCard, $player2MonsterCard);
        this.updateLifePoints(this.player1, $player1LifePoints);
        this.updateLifePoints(this.player2, $player2LifePoints);
    }
    sentToGraveyardDrawNewCard(player, node) {
        player.monsterCard = this.getRandMonstCard(monsterList);
        this.displayMonsterCard(player.monsterCard, node)
    }
    singleBattlePhase() {
        if (this.player1.monsterCard.atk > this.player2.monsterCard.atk) {
            alert(`After initiating the Attack Phase, Player 1's Monster Card's Attack Points are greater than Player 2's Monster Card's Attack Points!`)
            this.player2.lifePoints -= (this.player1.monsterCard.atk - this.player2.monsterCard.atk)
            alert(`The attack did ${(this.player1.monsterCard.atk - this.player2.monsterCard.atk)} damage to Player 2's Life Points!`);
            this.updateLifePoints(this.player2, $player2LifePoints);
            alert(`${this.player2.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player2, $player2MonsterCard)
        } else if (this.player1.monsterCard.atk < this.player2.monsterCard.atk) {
            alert(`After initiating the Attack Phase, Player 2's Monster Card's Attack Points are greater than Player 1's Monster Card's Attack Points!`)
            this.player1.lifePoints -= (this.player2.monsterCard.atk - this.player1.monsterCard.atk)
            alert(`The attack did ${(this.player2.monsterCard.atk - this.player1.monsterCard.atk)} damage to Player 1's Life Points!`);
            this.updateLifePoints(this.player1, $player1LifePoints);
            alert(`${this.player1.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player1, $player1MonsterCard);
        } else if (this.player1.monsterCard.atk === this.player2.monsterCard.atk) {
            alert(`No damage was done to either players' Life Points, but both players' Monster Cards are sent to the Graveyard!`);
            alert(`${this.player2.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player2, $player2MonsterCard);
            alert(`${this.player.monsterCard.name} has been sent to the Graveyard!`);
            this.sentToGraveyardDrawNewCard(this.player1, $playerMonsterCard);
        }
        this.checkWinState();
    }
    checkWinState() {
        if (this.player1.lifePoints > 0 && this.player2.lifePoints <= 0) {
            alert("Player 1 has won! Thank you for playing!");
            location.reload();
        } else if (this.player1.lifePoints <= 0 && this.player2.lifePoints > 0) {
            alert("Player 2 has won! Thank you for playing!");
            location.reload();
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
        cardData.forEach((currMonstCard) => {
            const monsterCardObj = {
                name: currMonstCard.name,
                atk: currMonstCard.atk,
                def: currMonstCard.def,
                cardImg: currMonstCard.card_images[0].image_url,
            }
            monsterList.push(monsterCardObj);
        })
        game1.initialTurn(monsterList);
        $atkBtn1.click(game1.singleBattlePhase)
        $atkBtn2.click(game1.singleBattlePhase)
    }
);