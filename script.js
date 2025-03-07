// Importing useState from React
 //StAuth10244: I  Meet Sevani, 000924119 certify that this material is my original work. 
 //No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
const { useState } = React;

// Suits & Values for a Standard 52-Card Deck
const suits = ["♠️", "♥️", "♦️", "♣️"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/**
 * Function to generate a full deck of 52 unique cards.
 * Each card consists of a suit and a value.
 */
const generateDeck = () => {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
};

/**
 * Card Component - Displays an individual playing card.
 * Props:
 * - card (object) → Contains suit & value of the card.
 * - isPicked (boolean) → Indicates if the card is currently selected.
 * - onPick (function) → Handles clicking on a card to select it.
 */
function Card({ card, isPicked, onPick }) {
    return (
        <span
            className={`card ${isPicked ? "picked" : ""}`}
            data-value={card.value}
            data-suit={card.suit}
            onClick={() => onPick(card)}
        >
            <span>{card.suit}</span>
        </span>
    );
}

/**
 * Deck Component - Manages the game logic and user interactions.
 * This component maintains state for:
 * - The deck of cards (remaining cards).
 * - The drawn cards (cards displayed on the screen).
 * - The picked card (selected card for swapping or tossing).
 */
function Deck() {
    const [deck, setDeck] = useState(generateDeck()); // Stores full deck of 52 cards
    const [drawnCards, setDrawnCards] = useState([]); // Stores drawn cards
    const [pickedCard, setPickedCard] = useState(null); // Stores the currently selected card

    /**
     * Draws a single random card from the deck.
     * The drawn card is removed from the deck and added to the drawnCards list.
     */
    const drawCard = () => {
        if (deck.length === 0) return; 

        const randomIndex = Math.floor(Math.random() * deck.length);
        const drawnCard = deck[randomIndex];

        setDrawnCards([...drawnCards, drawnCard]); 
        setDeck(deck.filter((_, index) => index !== randomIndex)); 
        setPickedCard(null); 
    };

    /**
     * Deals a specified number of random cards at once.
     * The drawn cards replace any existing ones.
     * @param {number} num - Number of cards to deal.
     */
    const dealCards = (num) => {
        if (deck.length < num) return; // Prevent dealing if not enough cards

        const shuffleDeck = [...deck].sort(() => Math.random() - 0.5);
        const newDrawnCards = shuffleDeck.slice(0, num);

        setDrawnCards(newDrawnCards);
        setDeck(deck.filter((card) => !newDrawnCards.includes(card)));
        setPickedCard(null);
    };
    /**
     * Handles selecting a card for swapping.
     * - If no card is picked, it selects the clicked card.
     * - If a card is already picked, clicking a second card swaps their positions.
     */
    const handleSwapCard = (card) => {
        if (!pickedCard) {
            // Select the first card
            setPickedCard(card);
        } else if (pickedCard === card) {
            // Unselect the picked card if clicked again
            setPickedCard(null);
        } else {
            // Swap the picked card with the new one
            const NewSwapedCards = drawnCards.map((tempCards) =>
                tempCards === pickedCard ? card : tempCards === card ? pickedCard : tempCards
            );

            setDrawnCards(NewSwapedCards);
            setPickedCard(null); // Reset selection after swap
        }
    };


    /**
     * Resets the game to its original state with a full deck.
     * Clears the drawn cards and resets the picked card.
     */
    const resetDeck = () => {
        setDeck(generateDeck()); 
        setDrawnCards([]); 
        setPickedCard(null); 
    };

    /**
     * Removes the currently selected card from the drawn cards list.
     * The removed card is permanently discarded and not returned to the deck.
     */
    const tossCard = () => {
        if (!pickedCard) return; 

        setDrawnCards(drawnCards.filter(card => card !== pickedCard)); 

        setPickedCard(null); 
    };

    /**
     * Generates a "Wildcard" card with a random suit and value.
     * This card is added to the drawnCards list but does not come from the deck.
     */
    const addWildcard = () => {
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const randomValue = values[Math.floor(Math.random() * values.length)];

        const wildcard = { suit: randomSuit, value: randomValue };

        setDrawnCards([...drawnCards, wildcard]); 
    };

    /**
     * Randomly shuffles the drawn cards (Regroup function).
     * This does not affect the deck, only reorders displayed cards.
     */
    const regroupCards = () => {
        let shuffled = [...drawnCards].sort(() => Math.random() - 0.5);
        setDrawnCards(shuffled);
    };

    return (
        <div className="deck-container">
            <h1>Deck of Cards</h1>

            {/* If deck is empty, display "No Cards Remaining" */}
            {deck.length > 0 ? (
                <div className="deck" onClick={drawCard}>
                    Click to Draw
                </div>
            ) : (
                <div className="deck empty">
                    No Cards Remaining
                </div>
            )}
            <p className="cards-left">Cards Left in Deck: {deck.length}</p>

            {/* Buttons for Dealing, Resetting, Tossing, Wildcard & Regroup */}
            <div className="buttons-container">
                <button onClick={() => dealCards(5)}>Deal 5</button>
                <button onClick={() => dealCards(7)}>Deal 7</button>
                <button onClick={resetDeck}>Reset</button>
                <button onClick={tossCard} disabled={!pickedCard}>Toss</button>
                <button onClick={addWildcard}>Wildcard</button>
                <button onClick={regroupCards} disabled={drawnCards.length === 0}>Regroup</button>
            </div>

            {/* Display Drawn Cards */}
            <div className="drawn-cards">
                {drawnCards.map((card, index) => (
                    <Card
                        key={index}
                        card={card}
                        isPicked={pickedCard === card}
                        onPick={handleSwapCard}
                    />
                ))}
            </div>
        </div>
    );
}

// Render Deck component into root div
ReactDOM.render(<Deck />, document.getElementById("root"));
