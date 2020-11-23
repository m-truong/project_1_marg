# Yu-Gi-Oh! Card Battle Game 
inspired by Yu-Gi-Oh! TCG by Konami**  
___
![Mike's Card Battle Game](https://www.konami.com/kde_cms/eu_publish/uploads/EN-and-DE-Resized.png)
___

### Motivation:
I grew up playing Yu-Gi-Oh! the card game in grade school, and I was inspired to build a version of the game after seeing Evan's fantastic PokeBattle Card Game project. He had used an external API with data of all 150 pokemon, so I did some research and found an external API for a Yu-Gi-Oh! card database. 

### Game Summary:
Yu-Gi-Oh! Trading Card Game is a Japanese card battle game where two players draw cards from their respective decks and take turns playing cards on the field. There are Monster, Spell, and Trap type cards, but for my adaptation of the game, I only implemented Monster Cards as a playable feature. At the start of every turn, five monster cards are randomly drawn for each player. A player begins their turn by clicking on the "Begin Attack Phase" button. They then must choose a Monster Card on their side of the field to attack another Monster Card on the opponent's side of the field. After clicking the "Confirm Attack Phase" button, damage dealt to an opponent player's life points is calculated using the Monster Card's Attack Point values. 

**Link to site:** https://m-truong.github.io/project_1_marg/

### Win Condition/Lose Conditions/Best Strategy:
A player wins the duel once they get their opponent's life points down to 0. The best strategy to winning a duel is to essentially pick your strongest Monster Card with the highest Attack Point and choosing to target the weakest Monster Card on your opponent's side of the field. The greater the difference in the Attack Point values, the more damage is dealt to the opponent's life points. Another great strategy for winning the game, is to look at the Level of the card (indicated by star symbols). The more star symbols your card has, the stronger your card is. It is a very effective strategy to use a Monster Card with most star symbols to attack a Monster Card with the fewest star symbols on your opponent's side of the field.


### Features:
- I fetched the data and images for my Monster Cards using an external API database. I was able to render the Monster Card images dynamically using jQuery DOM manipulation methods and change the inner HTML of elements on the fly. 
- I used Bootstrap's CSS library for a lot of the features in my card battle game. Bootstrap's custom CSS classes and CSS grid layout helped me better arrange my monster cards on the browser. 
- A great feature that I have in my game are some cool CSS animations from Animate.style for when a player clicks a Monster Card and when a Monster Card is sent to the graveyard. 
- I created JavaScript Audio objects to play a battle theme and victory theme at the start and end of every duel. 

### Code Example:
For my card battle game, I fetched data from an external API in JavaScript by using an asynchronous function with the async and await keywords. I then stringified the response object into a JSON object. I passed a function into the Promise.prototype.then method that loops through the cardData array and created a new Monster Card object that I pushed into a Monster List array to store the data locally to use for my Yu-Gi-Oh! card battle game. 

```
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
    }
);
```

### API Reference: 
(https://db.ygoprodeck.com/api-guide/)

### Technologies used:
- External Yu-Gi-Oh API Database (https://db.ygoprodeck.com/api-guide/)
- jQuery API library (https://api.jquery.com/)
- Bootstrap CSS templating library (https://getbootstrap.com/)
- Animate.css custom library of CSS animations (https://animate.style/)
- Yu-Gi-Oh! Duel Links Soundtrack (https://downloads.khinsider.com/game-soundtracks/album/yu-gi-oh-duel-links-soundtrack) 
- JavaScript: string template literals, loops, event listeners, callback functions
- CSS styling
- HTML DOM-manipulation

___
## Lessons/Ongoing Issues:

### Planning the scope of projects effectively
- When I intially brainstormed my project, I only planned on rendering two Monster Cards on the screen.
- Since this was my first coding project, I wanted to have a realistic MVP for my project.
- It took me a few days just to figure out how to get two cards to display and be playable.
- But when I reached it, I realized my game was too simple, so I decided to implement my post MVP features.
- I was amazed at how quickly and effectively I was able to rework my gameplay logic to be playable by two players with multiple cards!
- I was very pleased with the finished product of my card battle game, but I learned an important lesson about planning the scope of my projects.
- This was a great learning experience for me because I realized I am capable of building really great and polished larger-scale coding projects. 
  
### Writing code that is reusable and changeable
- The scope of my original card battle game was very narrow and simple, so when I was coding, I only had that vision in mind.
- I built the game using code that was too rigid, and I quickly learned this was setting my project up for disaster because there was no room in my code to make changes and improve upon it.
- I ended up rebuilding my project from the bottom-up.
- But even after changing my code, I'm not completely satisfied with how my code looks.
- I have a lot of repeating code that I will go back and refactor so that it's much cleaner and more streamlined.
- But for now, I'm still very happy that my card battle game turned out very well.

## Future Game Improvements:
1. Refactor my code to be more object-oriented 
2. Use more JavaScript classes and separate game files
3. Separate my GameState class into a Player class and Monster Card class
4. Refactor my large beginAttackPhase() and confirmAttackPhase() class methods into several helper methods
5. Implement a duelist carousel so that players can choose different characters to play as 
6. Make the 'playable characters' appear on the game screen while dueling
7. Make the character images flash red when they take damage to their life points
8. Use an animated modal to display the winner instead of alerts
9. Implement defensive gameplay 
10. Allow the players to change the Monster Card to 'defense position' and use the Defense Points while dueling
11. Add a 'Draw New Cards' button that draws five new random monster cards, so that a player has the option to get stronger Monster Cards
12. Give the players an option to set the life points before a duel so that they can play longer matches

## Credits: 
- I want to thank Arthur for giving me a great explanation of how to fetch data from an external API. 
- I also want to thank Evan for showing me his awesome PokeBattle project!