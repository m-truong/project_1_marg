/* ======================
CACHED DOM NOTES
=========================*/

/**
 * Change this text to display Player 1's turn or Player 2's turn
 */
const $displayPlayerTurn = $('.player-turn')
$displayPlayerTurn.html = ``;

// * Reset Button * //
const $resetBtn = $("#reset")
$resetBtn.click(() => {
    location.reload()
});

// ====== Show/Hide Modal & Carousel ====== // 
const $introModal = $(".instructions")
const $duelBtn = $(".duel-btn")
const $duelistCarousel = $(".duelist-carousel")
const $selectDuelist = $(".select-duelist-btn")

// ====== Game Container ====== // 
const $gameContainer = $('.game-container')

// ======= Monster Card Img <div> ======= //
const $player1MonsterCard = $('.player1-monster-card')
const $player2MonsterCard = $('.player2-monster-card')

// ======= Life Points <div> ======= // 
const $player1LifePoints = $('.player1-life-points')
const $player2LifePoints = $('.player2-life-points')

// ===== Cached Player 1's Attack and Draw Buttons ==== //
const $player1BeginAtkBtn = $('.player1-begin-attack-btn')
const $player1ConfirmAtkBtn = $('.player1-confirm-attack-btn')

// ===== Cached Player 2's Attack and Draw Buttons ==== //
const $player2BeginAtkBtn = $('.player2-begin-attack-btn')
const $player2ConfirmAtkBtn = $('.player2-confirm-attack-btn')

/* ======================
GLOBAL VARS
=========================*/
const mainTheme = new Audio("2-18 - Duel Island Theme.mp3");

// ======= Array of Monster Card Objects ======= // 
const monsterList = []

/* =============================
MAIN FUNCTIONS FOR then() 
============================= */

/* =============================
HELPER FUNCTIONS FOR DOM-MANIPULATION
============================= */
const removeIntroShowCarousel = () => {
    $introModal.remove();
    $duelistCarousel.toggleClass("show");
    setTimeout(() => {
        mainTheme.loop = true;
        mainTheme.play()
    }, 500);
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
    constructor(lifePoints = 2000) {
        this.player1 = {
            lifePoints: lifePoints,
            monsterCards: [],
            cardImgs: [],
            imgNodes: [],
            currAttkMonst: null,
            targetMonst: null,
            // add player image
            player1Duelist: null,
        }
        this.player2 = {
            lifePoints: lifePoints,
            monsterCards: [],
            cardImgs: [],
            imgNodes: [],
            currAttkMonst: null,
            targetMonst: null,
            // add player image 
            player2Duelist: null,
        }
        this.getRandMonstCard = this.getRandMonstCard.bind(this);
    }
    // ======= Get Random Monster Card ======= // 
    getRandMonstCard(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    getMonsterCardsImages() {
        for (let k = 0; k < 5; k++) {
            const currCard1 = this.getRandMonstCard(monsterList);
            this.player1.monsterCards.push(currCard1);
            this.player1.cardImgs.push(currCard1.cardImg);
            const imgNode1 = $(`<img id="${k}" class="player1-monster-card${k}" src=${currCard1.cardImg} alt="${currCard1.name}">`)
            this.player1.imgNodes.push(imgNode1);
            const currCard2 = this.getRandMonstCard(monsterList);
            this.player2.monsterCards.push(currCard2);
            this.player2.cardImgs.push(currCard2.cardImg);
            const imgNode2 = $(`<img id="${k}" class="player2-monster-card${k}" src="${currCard2.cardImg}" alt="${currCard2.name}">`)
            this.player2.imgNodes.push(imgNode2);
        }
    }
    displayAllCards() {
        const player1ImgNodes = $(".player1-monster-cards")
        for (let k = 0; k < 5; k++) {
            const node = player1ImgNodes.eq(k);
            const imgNode = this.player1.imgNodes[k]
            node.append(imgNode)
        }
        const player2ImgNodes = $('.player2-monster-cards')
        for (let k = 0; k < 5; k++) {
            const node = player2ImgNodes.eq(k);
            const imgNode = this.player2.imgNodes[k]
            node.append(imgNode)
        }
        this.updateLifePoints(this.player1, $player1LifePoints);
        this.updateLifePoints(this.player2, $player2LifePoints);
    }
    beginAttackPhase() {
        $player1BeginAtkBtn.click((evt) => {
            alert("Player 1 has begun his attack phase!")
            this.player1.imgNodes.forEach((currNode) => {
                currNode.click((evt) => {
                    const getMonsterID = evt.target.id
                    this.player1.currAttkMonst = this.player1.monsterCards[getMonsterID]
                    alert(`Player 1 has chosen ${this.player1.currAttkMonst.name} to attack with!`)
                    currNode.toggleClass('animate__animated animate__flash');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__flash');
                    }, 500);
                });
            });
            this.player2.imgNodes.forEach((currNode) => {
                currNode.dblclick((evt) => {
                    const getMonsterID = evt.target.id
                    this.player1.targetMonst = this.player2.monsterCards[getMonsterID]
                    alert(`Player 1 has chosen Player 2's ${this.player1.targetMonst.name} to attack against!`)
                    currNode.toggleClass('animate__animated animate__rubberBand');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__rubberBand');
                    }, 500);
                });
            });
        });

        $player2BeginAtkBtn.click((evt) => {
            alert("Player 2 has begun his attack phase!")
            this.player2.imgNodes.forEach((currNode) => {
                currNode.click((evt) => {
                    const getMonsterID = evt.target.id
                    this.player2.currAttkMonst = this.player2.monsterCards[getMonsterID]
                    alert(`Player 2 has chosen ${this.player2.currAttkMonst.name} to attack with!`)
                    currNode.toggleClass('animate__animated animate__flash');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__flash');
                    }, 500);
                })
            });
            this.player1.imgNodes.forEach((currNode) => {
                currNode.dblclick((evt) => {
                    const getMonsterID = evt.target.id
                    this.player2.targetMonst = this.player1.monsterCards[getMonsterID]
                    alert(`Player 2 has chosen Player 1's ${this.player2.targetMonst.name} to attack against!`)
                    currNode.toggleClass('animate__animated animate__rubberBand');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__rubberBand');
                    }, 500);
                });
            });
        });
    }

    confirmAttackPhase() {
        $player1ConfirmAtkBtn.click((evt) => {
            if ((this.player1.currAttkMonst.atk - this.player1.targetMonst.atk) > 0) {
                alert(`After initiating the Attack Phase, Player 1's ${this.player1.currAttkMonst.name}'s Attack Points are greater than Player 2's ${this.player1.targetMonst.name}'s Attack Points!`)
                this.player2.lifePoints -= (this.player1.currAttkMonst.atk - this.player1.targetMonst.atk)
                this.updateLifePoints(this.player2, $player2LifePoints);
                alert(`The attack did ${(this.player1.currAttkMonst.atk - this.player1.targetMonst.atk)} damage to Player 2's Life Points!`);
                alert(`${this.player1.targetMonst.name} has been sent to the Graveyard!`);
                const getIndex = this.player2.monsterCards.indexOf(this.player1.targetMonst);
                const newCard = this.getRandMonstCard(monsterList)
                this.player2.monsterCards.splice(getIndex, 1, newCard);
                const newNode = $(`<img id="${getIndex}" class="player2-monster-card${getIndex}" src="${newCard.cardImg}" alt="${newCard.name}">`)
                this.player2.imgNodes.splice(getIndex, 1, newNode);
                const displayNode = this.player2.imgNodes[getIndex]
                $(".player2-monster-cards").eq(getIndex).empty();
                $(".player2-monster-cards").eq(getIndex).append(displayNode);
                displayNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);

            } else if ((this.player1.currAttkMonst.atk - this.player1.targetMonst.atk) < 0) {
                alert(`After initiating the Attack Phase, Player 1's ${this.player1.currAttkMonst.name}'s Attack Points were less than Player 2's ${this.player1.targetMonst.name}'s Attack Points!`)
                this.player1.lifePoints += (this.player1.currAttkMonst.atk - this.player1.targetMonst.atk)
                this.updateLifePoints(this.player1, $player1LifePoints);
                alert(`The attack did ${-(this.player1.currAttkMonst.atk - this.player1.targetMonst.atk)} damage back to Player 1's Life Points!`);
                alert(`${this.player1.currAttkMonst.name} has been sent to the Graveyard!`);
                const getIndex = this.player1.monsterCards.indexOf(this.player1.currAttkMonst);
                const newCard = this.getRandMonstCard(monsterList)
                this.player1.monsterCards.splice(getIndex, 1, newCard);
                const newNode = $(`<img id="${getIndex}" class="player1-monster-card${getIndex}" src="${newCard.cardImg}" alt="${newCard.name}">`)
                this.player1.imgNodes.splice(getIndex, 1, newNode);
                const displayNode = this.player1.imgNodes[getIndex]
                $(".player1-monster-cards").eq(getIndex).empty();
                $(".player1-monster-cards").eq(getIndex).append(displayNode);
                displayNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
            } else if (((this.player1.currAttkMonst.atk - this.player1.targetMonst.atk) === 0)) {
                alert(`After initiating the Attack Phase, Player 1's Monster Card's Attack Points were equal to Player 2's Monster Card's Attack Points!`)
                alert(`No damage was done to either players' Life Points, but both Monster Cards were sent to the Graveyard!`)
                const getIndexTargetCard = this.player2.monsterCards.indexOf(this.player1.targetMonst);
                const newEnemyCard = this.getRandMonstCard(monsterList)
                this.player2.monsterCards.splice(getIndexTargetCard, 1, newEnemyCard)
                const newEnemyNode = $(`<img id="${getIndexTargetCard}" class="player2-monster-card${getIndexTargetCard}" src="${newEnemyCard.cardImg}" alt="${newEnemyCard.name}">`)
                this.player2.imgNodes.splice(getIndexTargetCard, 1, newEnemyNode)
                const displayEnemyNode = this.player2.imgNodes[getIndexTargetCard]
                $(".player2-monster-cards").eq(getIndexTargetCard).empty()
                $(".player2-monster-cards").eq(getIndexTargetCard).append(displayEnemyNode)
                displayEnemyNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayEnemyNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
                const getIndexCurrAttkCard = this.player1.monsterCards.indexOf(this.player1.currAttkMonst);
                const newCurrCard = this.getRandMonstCard(monsterList)
                this.player1.monsterCards.splice(getIndexCurrAttkCard, 1, newCurrCard)
                const newCurrNode = $(`<img id="${getIndexCurrAttkCard}" class="player1-monster-card${getIndexCurrAttkCard}" src="${newCurrCard.cardImg}" alt="${newCurrCard.name}">`)
                this.player1.imgNodes.splice(getIndexCurrAttkCard, 1, newCurrNode)
                const displayCurrCard = this.player1.imgNodes[getIndexCurrAttkCard]
                $(".player1-monster-cards").eq(getIndexCurrAttkCard).empty()
                $(".player1-monster-cards").eq(getIndexCurrAttkCard).append(displayCurrCard)
                displayCurrCard.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayCurrCard.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
            }
            this.player1.imgNodes.forEach((currNode) => {
                currNode.off("click");
            })
            this.player2.imgNodes.forEach((currNode) => {
                currNode.off("dblclick");
            })
            this.player1.currAttkMonst = null;
            this.player1.targetMonst = null;
            this.checkWinState();
        })

        $player2ConfirmAtkBtn.click((evt) => {
            if ((this.player2.currAttkMonst.atk - this.player2.targetMonst.atk) > 0) {
                alert(`After initiating the Attack Phase, Player 2's ${this.player2.currAttkMonst.name}'s Attack Points are greater than Player 1's ${this.player2.targetMonst.name}'s Attack Points!`)
                this.player1.lifePoints -= (this.player2.currAttkMonst.atk - this.player2.targetMonst.atk)
                this.updateLifePoints(this.player1, $player1LifePoints);
                alert(`The attack did ${(this.player2.currAttkMonst.atk - this.player2.targetMonst.atk)} damage to Player 1's Life Points!`);
                alert(`${this.player2.targetMonst.name} has been sent to the Graveyard!`);
                const getIndex = this.player1.monsterCards.indexOf(this.player2.targetMonst);
                const newCard = this.getRandMonstCard(monsterList)
                this.player1.monsterCards.splice(getIndex, 1, newCard);
                const newNode = $(`<img id="${getIndex}" class="player1-monster-card${getIndex}" src="${newCard.cardImg}" alt="${newCard.name}">`)
                this.player1.imgNodes.splice(getIndex, 1, newNode);
                const displayNode = this.player1.imgNodes[getIndex]
                $(".player1-monster-cards").eq(getIndex).empty();
                $(".player1-monster-cards").eq(getIndex).append(displayNode);
                displayNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
            } else if ((this.player2.currAttkMonst.atk - this.player2.targetMonst.atk) < 0) {
                alert(`After initiating the Attack Phase, Player 2's ${this.player2.currAttkMonst.name}'s Attack Points were less than Player 1's ${this.player2.targetMonst.name}'s Attack Points!`)
                this.player2.lifePoints += (this.player2.currAttkMonst.atk - this.player2.targetMonst.atk)
                this.updateLifePoints(this.player2, $player2LifePoints);
                alert(`The attack did ${-(this.player2.currAttkMonst.atk - this.player2.targetMonst.atk)} damage back to Player 2's Life Points!`);
                alert(`${this.player2.currAttkMonst.name} has been sent to the Graveyard!`);
                const getIndex = this.player2.monsterCards.indexOf(this.player2.currAttkMonst);
                const newCard = this.getRandMonstCard(monsterList)
                this.player2.monsterCards.splice(getIndex, 1, newCard);
                const newNode = $(`<img id="${getIndex}" class="player2-monster-card${getIndex}" src="${newCard.cardImg}" alt="${newCard.name}">`)
                this.player2.imgNodes.splice(getIndex, 1, newNode);
                const displayNode = this.player2.imgNodes[getIndex]
                $(".player2-monster-cards").eq(getIndex).empty();
                $(".player2-monster-cards").eq(getIndex).append(displayNode);
                displayNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
            } else if (((this.player2.currAttkMonst.atk - this.player2.targetMonst.atk) === 0)) {
                alert(`After initiating the Attack Phase, Player 2's Monster Card's Attack Points were equal to Player 1's Monster Card's Attack Points!`)
                alert(`No damage was done to either players' Life Points, but both Monster Cards were sent to the Graveyard!`)
                const getIndexTargetCard = this.player1.monsterCards.indexOf(this.player2.targetMonst);
                const newEnemyCard = this.getRandMonstCard(monsterList)
                this.player1.monsterCards.splice(getIndexTargetCard, 1, newEnemyCard)
                const newEnemyNode = $(`<img id="${getIndexTargetCard}" class="player1-monster-card${getIndexTargetCard}" src="${newEnemyCard.cardImg}" alt="${newEnemyCard.name}">`)
                this.player1.imgNodes.splice(getIndexTargetCard, 1, newEnemyNode)
                const displayEnemyNode = this.player1.imgNodes[getIndexTargetCard]
                $(".player1-monster-cards").eq(getIndexTargetCard).empty()
                $(".player1-monster-cards").eq(getIndexTargetCard).append(displayEnemyNode)
                displayEnemyNode.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayEnemyNode.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
                const getIndexCurrAttkCard = this.player2.monsterCards.indexOf(this.player2.currAttkMonst);
                const newCurrCard = this.getRandMonstCard(monsterList)
                this.player2.monsterCards.splice(getIndexCurrAttkCard, 1, newCurrCard)
                const newCurrNode = $(`<img id="${getIndexCurrAttkCard}" class="player2-monster-card${getIndexCurrAttkCard}" src="${newCurrCard.cardImg}" alt="${newCurrCard.name}">`)
                this.player2.imgNodes.splice(getIndexCurrAttkCard, 1, newCurrNode)
                const displayCurrCard = this.player2.imgNodes[getIndexCurrAttkCard]
                $(".player2-monster-cards").eq(getIndexCurrAttkCard).empty()
                $(".player2-monster-cards").eq(getIndexCurrAttkCard).append(displayCurrCard)
                displayCurrCard.toggleClass('animate__animated animate__fadeOutDown');
                setTimeout(() => {
                    displayCurrCard.toggleClass('animate__animated animate__fadeOutDown');
                }, 500);
            }
            this.player2.imgNodes.forEach((currNode) => {
                currNode.off("click");
            })
            this.player1.imgNodes.forEach((currNode) => {
                currNode.off("dblclick");
            })
            this.player2.currAttkMonst = null;
            this.player2.targetMonst = null;
            this.checkWinState();
        })
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
    // ======= Display Life Points ============= //
    updateLifePoints(player, node) {
        node.html(`${player.lifePoints}`);
    }
}

/* =============================
Yu-Gi-Oh API Database
============================= */

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
                id: currMonstCard.id,
                desc: currMonstCard.desc,
                atk: currMonstCard.atk,
                def: currMonstCard.def,
                cardImg: currMonstCard.card_images[0].image_url_small,
            }
            monsterList.push(monsterCardObj);
        })
        // ====== Global GameState ====== //
        const game1 = new GameState(10000)
        game1.getMonsterCardsImages();
        game1.displayAllCards();
        game1.beginAttackPhase();
        game1.confirmAttackPhase();
    }
);