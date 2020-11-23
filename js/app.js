/* ======================
CACHED DOM NOTES
=========================*/
// ====== Show/Hide Instructions & Game Container ====== // 
const $displayPlayerTurn = $('#player-turn')
const $duelBtn = $('#duel-btn')
const $introModal = $('#instructions')
const $gameContainer = $('.game-container')
const $resetBtn = $("#reset")

// ====== Player 1 DOM Elements ===== //
const $player1LifePoints = $('#player1-life-points')
const $player1AttackingCard = $('#player1-attacking-card')
const $player1ReceivingCard = $('#player1-receiving-card')
const $player1BeginAtkBtn = $('#player1-begin-attack-btn')
const $player1ConfirmAtkBtn = $('#player1-confirm-attack-btn')

// ====== Player 2 DOM Elements ===== //
const $player2LifePoints = $('#player2-life-points')
const $player2AttackingCard = $('#player2-attacking-card')
const $player2ReceivingCard = $('#player2-receiving-card')
const $player2BeginAtkBtn = $('#player2-begin-attack-btn')
const $player2ConfirmAtkBtn = $('#player2-confirm-attack-btn')

/* ======================
GLOBAL VARS
=========================*/
// ====== Monster Card Array ====== // 
const monsterList = []
const mainTheme = new Audio("Duel Island Theme.mp3")

/* =============================
HELPER FUNCTION FOR EVENT
============================= */
/** 
 * The removeInstructionsShowGameContainer() method removes the instructions modal, toggles the "show" CSS styling on the game container, plays the main battle theme,
 * and then prompts Player 1 to begin their turn.  
 */
const removeInstructionsShowGameContainer = () => {
    $introModal.remove();
    $gameContainer.toggleClass("show")
    setTimeout(() => {
        mainTheme.loop = true
        mainTheme.volume = 0.5
        mainTheme.play()
    }, 500)
    $displayPlayerTurn.html(`Player 1 please begin your Attack Phase!`)
}

/* =============================
EVENT LISTENERS
============================= */
$duelBtn.click(removeInstructionsShowGameContainer)
$resetBtn.click(() => {
    location.reload()
});

/* =============================
GAMESTATE CLASS
============================= */
/**
 * The GameState class contains a player1 and player2 object property. Both player objects have a lifePoints property, monsterCards array, 
 * <img> elements array of the Monster Card images, a "current attacking" Monster Card, and "target" Monster Card property. 
 */
class GameState {
    constructor(lifePoints = 2000) {
        this.player1 = {
            lifePoints: lifePoints,
            monsterCards: [],
            imgNodes: [],
            currAttkMonst: null,
            targetMonst: null,

        }
        this.player2 = {
            lifePoints: lifePoints,
            monsterCards: [],
            imgNodes: [],
            currAttkMonst: null,
            targetMonst: null,

        }
    }
    /** 
     * The updateLifePoints() method redisplays the player's life points after they have received damage. 
     */
    updateLifePoints(player, node) {
        node.html(`${player.lifePoints}`);
    }
    /** 
     * The getRandMonstCard() method returns a single random Monster Card object from the monster list array.
     */
    getRandMonstCard(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    /**
     * The getMonsterCardsImages() method is called at the start of the duel and randomly draws five monster cards from the monster list array.
     * The five monster cards are pushed into each players' monster cards array, and an <img> DOM element is created using jQuery for each monster card.
     * The DOM elements are pushed into the imgNodes array for each player in the order that they are generated.
     */
    getMonsterCardsImages() {
        for (let k = 0; k < 5; k++) {
            const currCard1 = this.getRandMonstCard(monsterList);
            this.player1.monsterCards.push(currCard1);
            const imgNode1 = $(`<img id="${k}" class="player1-monster-card${k}" src=${currCard1.cardImg} alt="${currCard1.name}">`)
            this.player1.imgNodes.push(imgNode1);
            const currCard2 = this.getRandMonstCard(monsterList);
            this.player2.monsterCards.push(currCard2);
            const imgNode2 = $(`<img id="${k}" class="player2-monster-card${k}" src="${currCard2.cardImg}" alt="${currCard2.name}">`)
            this.player2.imgNodes.push(imgNode2);
        }
    }
    /**
     * The displayAllCards() method queries for the <div> elements in the DOM that will display the monster card images, and then it appends every monster card image. 
     * This method also displays each players' life points at the start of the duel.
     */
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
    /**
     * The beginAttackPhase() assigns a click event to both players' "Begin Attack Phase" button. When the player clicks their button, the method assigns a "hover" event 
     * to each monster cards' image. It then assigns a click event to every monster card image which changes the "Player's Attacking Monster Card" to display the Monster Card's
     * name, attack points, and card description. It also assigns a double-click event to the opponent's monster card images which will change the "Player's Receiving Monster Card"
     * to display the opponent's monster card that has been targeted for the attack.
     */
    beginAttackPhase() {
        $player1BeginAtkBtn.click((evt) => {
            alert("Player 1 has begun their attack phase!")
            this.player1.imgNodes.forEach((currNode) => {
                currNode.hover(() => {
                    currNode.css('cursor', 'pointer')
                }, () => {
                    currNode.css('cursor', 'default')
                })
                currNode.click((evt) => {
                    const getMonsterID = evt.target.id
                    this.player1.currAttkMonst = this.player1.monsterCards[getMonsterID]
                    $player1AttackingCard.html(`
                        <p>${this.player1.currAttkMonst.name}</p>
                        <p>Attack Points: ${this.player1.currAttkMonst.atk}</p>
                        <p>${this.player1.currAttkMonst.desc}</p>
                    `)
                    alert(`Player 1 has chosen ${this.player1.currAttkMonst.name} to attack with!`)
                    currNode.toggleClass('animate__animated animate__flash animate__slow');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__flash animate__slow');
                    }, 3000);
                });
            });
            this.player2.imgNodes.forEach((currNode) => {
                currNode.hover(() => {
                    currNode.css('cursor', 'pointer')
                }, () => {
                    currNode.css('cursor', 'default')
                })
                currNode.dblclick((evt) => {
                    const getMonsterID = evt.target.id
                    this.player1.targetMonst = this.player2.monsterCards[getMonsterID]
                    $player1ReceivingCard.html(`
                        <p>${this.player1.targetMonst.name}</p>
                        <p>Attack Points: ${this.player1.targetMonst.atk}</p>
                        <p>${this.player1.targetMonst.desc}</p>
                    `)
                    alert(`Player 1 has chosen Player 2's ${this.player1.targetMonst.name} to attack against!`)
                    currNode.toggleClass('animate__animated animate__rubberBand animate__slow');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__rubberBand animate__slow');
                    }, 3000);
                });
            });
        });
        $player2BeginAtkBtn.click((evt) => {
            alert("Player 2 has begun their attack phase!")
            this.player2.imgNodes.forEach((currNode) => {
                currNode.hover(() => {
                    currNode.css('cursor', 'pointer')
                }, () => {
                    currNode.css('cursor', 'default')
                })
                currNode.click((evt) => {
                    const getMonsterID = evt.target.id
                    this.player2.currAttkMonst = this.player2.monsterCards[getMonsterID]
                    $player2AttackingCard.html(`
                        <p>${this.player2.currAttkMonst.name}</p>
                        <p>Attack Points: ${this.player2.currAttkMonst.atk}</p>
                        <p>${this.player2.currAttkMonst.desc}</p>
                    `)
                    alert(`Player 2 has chosen ${this.player2.currAttkMonst.name} to attack with!`)
                    currNode.toggleClass('animate__animated animate__flash animate__slow');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__flash animate__slow');
                    }, 3000);
                })
            });
            this.player1.imgNodes.forEach((currNode) => {
                currNode.hover(() => {
                    currNode.css('cursor', 'pointer')
                }, () => {
                    currNode.css('cursor', 'default')
                })
                currNode.dblclick((evt) => {
                    const getMonsterID = evt.target.id
                    this.player2.targetMonst = this.player1.monsterCards[getMonsterID]
                    $player2ReceivingCard.html(`
                        <p>${this.player2.targetMonst.name}</p>
                        <p>Attack Points: ${this.player2.targetMonst.atk}</p>
                        <p>${this.player2.targetMonst.desc}</p>
                    `)
                    alert(`Player 2 has chosen Player 1's ${this.player2.targetMonst.name} to attack against!`)
                    currNode.toggleClass('animate__animated animate__rubberBand animate__slow');
                    setTimeout(() => {
                        currNode.toggleClass('animate__animated animate__rubberBand animate__slow');
                    }, 3000);
                });
            });
        });
    }
    /**
     * The confirmAttackPhase() method assigns a click event to both players' "Confirm Attack Phase Button". When the player clicks their button, the method checks if the players' currently 
     * selected attacking monster card's attack points are greater than, less than, or equal to the opponent's monster card that they chose to attack. Damage is done to either the current player's 
     * or opponent player's life points, and the monster card that is sent to the graveyard is replaced with a new monster card. The method also checks for the game winning condition at the end 
     * of the call.
     */
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
                displayNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
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
                displayNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
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
                displayEnemyNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayEnemyNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
                const getIndexCurrAttkCard = this.player1.monsterCards.indexOf(this.player1.currAttkMonst);
                const newCurrCard = this.getRandMonstCard(monsterList)
                this.player1.monsterCards.splice(getIndexCurrAttkCard, 1, newCurrCard)
                const newCurrNode = $(`<img id="${getIndexCurrAttkCard}" class="player1-monster-card${getIndexCurrAttkCard}" src="${newCurrCard.cardImg}" alt="${newCurrCard.name}">`)
                this.player1.imgNodes.splice(getIndexCurrAttkCard, 1, newCurrNode)
                const displayCurrCard = this.player1.imgNodes[getIndexCurrAttkCard]
                $(".player1-monster-cards").eq(getIndexCurrAttkCard).empty()
                $(".player1-monster-cards").eq(getIndexCurrAttkCard).append(displayCurrCard)
                displayCurrCard.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayCurrCard.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
            }
            this.player1.imgNodes.forEach((currNode) => {
                currNode.off("click");
                currNode.off("mouseenter mouseleave");
            })
            this.player2.imgNodes.forEach((currNode) => {
                currNode.off("dblclick");
                currNode.off("mouseenter mouseleave");
            })
            this.player1.currAttkMonst = null;
            this.player1.targetMonst = null;
            $player1AttackingCard.html(``)
            $player1ReceivingCard.html(``)
            $displayPlayerTurn.html(`It is now Player 2's turn to begin their Attack Phase!`);
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
                displayNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
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
                displayNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
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
                displayEnemyNode.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayEnemyNode.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
                const getIndexCurrAttkCard = this.player2.monsterCards.indexOf(this.player2.currAttkMonst);
                const newCurrCard = this.getRandMonstCard(monsterList)
                this.player2.monsterCards.splice(getIndexCurrAttkCard, 1, newCurrCard)
                const newCurrNode = $(`<img id="${getIndexCurrAttkCard}" class="player2-monster-card${getIndexCurrAttkCard}" src="${newCurrCard.cardImg}" alt="${newCurrCard.name}">`)
                this.player2.imgNodes.splice(getIndexCurrAttkCard, 1, newCurrNode)
                const displayCurrCard = this.player2.imgNodes[getIndexCurrAttkCard]
                $(".player2-monster-cards").eq(getIndexCurrAttkCard).empty()
                $(".player2-monster-cards").eq(getIndexCurrAttkCard).append(displayCurrCard)
                displayCurrCard.toggleClass('animate__animated animate__swing animate__slow');
                setTimeout(() => {
                    displayCurrCard.toggleClass('animate__animated animate__swing animate__slow');
                }, 3000);
            }
            this.player2.imgNodes.forEach((currNode) => {
                currNode.off("click");
                currNode.off("mouseenter mouseleave")
            })
            this.player1.imgNodes.forEach((currNode) => {
                currNode.off("dblclick");
                currNode.off("mouseenter mouseleave")

            })
            this.player2.currAttkMonst = null;
            this.player2.targetMonst = null;
            $player2AttackingCard.html(``)
            $player2ReceivingCard.html(``)
            $displayPlayerTurn.html(`It is now Player 1's turn to begin their Attack Phase!`);
            this.checkWinState();
        })
    }
    /**
     * The checkWinState() method checks if either players' life points have reached zero, determines the winner, and plays the victory theme.
     */
    checkWinState() {
        if (this.player1.lifePoints > 0 && this.player2.lifePoints <= 0) {
            alert(`🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 Player 1 has won! Player 2 has been defeated! Congratulations! Thank you for playing! 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉`);
            mainTheme.pause();
            mainTheme.currentTime = 0;
            const victory = new Audio("Winning.mp3");
            victory.loop = true
            victory.volume = 0.5
            victory.play();
            $displayPlayerTurn.html(`🎉 🎉 🎉  Player 1 has won! Player 2 has been defeated! Congratulations! Thank you for playing! Please click Restart Game to play again! 🎉 🎉 🎉 `);
            setTimeout(() => {
                location.reload();
            }, 50000)
        } else if (this.player1.lifePoints <= 0 && this.player2.lifePoints > 0) {
            alert(`🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 Player 2 has won! Player 1 has been defeated! Congratulations! Thank you for playing! 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉 🎉`);
            mainTheme.pause();
            mainTheme.currentTime = 0;
            const victory = new Audio("Winning.mp3");
            victory.loop = true
            victory.volume = 0.5
            victory.play();
            $displayPlayerTurn.html(`🎉 🎉 🎉  Player 2 has won! Player 1 has been defeated! Congratulations! Thank you for playing! Please click Restart Game to play again! 🎉 🎉 🎉 `);
            setTimeout(() => {
                location.reload();
            }, 50000)
        }
    }
}

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
    } catch (e) {
        console.error(e);
    }
}
// ========== GAME STARTS HERE ============= //
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
        const game1 = new GameState(7000)
        game1.getMonsterCardsImages();
        game1.displayAllCards();
        game1.beginAttackPhase();
        game1.confirmAttackPhase();
    }
);