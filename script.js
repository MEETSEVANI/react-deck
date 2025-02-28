const { useState } = React;
    
        // Suits & Values for a Standard Deck
        const suits = ["♠️", "♥️", "♦️", "♣️"];
        const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    
        // Generate a Full Deck of 52 Cards
        const generateDeck = () => {
            let deck = [];
            for (let suit of suits) {
                for (let value of values) {
                    deck.push({ suit, value });
                }
            }
            return deck;
        };
    
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
    
        function Deck() {
            const [deck, setDeck] = useState(generateDeck()); // Full deck of 52 cards
            const [drawnCards, setDrawnCards] = useState([]); // Stores drawn cards
            const [pickedCard, setPickedCard] = useState(null); // Stores selected card
    
            const drawCard = () => {
                if (deck.length === 0) return; // No more cards to draw
    
                const randomIndex = Math.floor(Math.random() * deck.length);
                const drawnCard = deck[randomIndex];
    
                setDrawnCards([...drawnCards, drawnCard]); // Add card to drawn list
                setDeck(deck.filter((_, index) => index !== randomIndex)); // Remove from deck
                setPickedCard(null); // Reset selection
            };
    
            const dealCards = (num) => {
                if (deck.length < num) return; // Prevent dealing if not enough cards
    
                const shuffleDeck = [...deck].sort(() => Math.random() - 0.5);
                const newDrawnCards = shuffleDeck.slice(0, num);
    
                setDrawnCards(newDrawnCards);
                setDeck(deck.filter((card) => !newDrawnCards.includes(card)));
                setPickedCard(null);
            };
    
            const resetDeck = () => {
                setDeck(generateDeck()); // Reset deck to full 52 cards
                setDrawnCards([]); 
                setPickedCard(null); // Reset picked card
            };
    
            const handlePickCard = (card) => {
                if (pickedCard && pickedCard.suit === card.suit && pickedCard.value === card.value) {
                    setPickedCard(null); // Unselect card if clicked again
                } else {
                    setPickedCard(card);
                }
            };
    
            const tossCard = () => {
                if (!pickedCard) return; // If no card is picked, do nothing
    
                setDrawnCards(drawnCards.filter(
                    (card) => !(card === pickedCard)
                )); // Remove tossed card from drawn cards
    
                setPickedCard(null); // Clear selection
            };
    
            const addWildcard = () => {
                const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                const randomValue = values[Math.floor(Math.random() * values.length)];
    
                const wildcard = { suit: randomSuit, value: randomValue };
    
                setDrawnCards([...drawnCards, wildcard]); // Add wildcard to drawn list
            };
            const regroupCards = () => {
            let shuffled = [...drawnCards].sort(() => Math.random() - 0.5);
            setDrawnCards(shuffled);
            };
    
            return (
                <div className="deck-container">
                    <h1>Deck of Cards</h1>
    
                    {deck.length > 0 ? (
                        <div className="deck" onClick={drawCard}>
                            Click to Draw
                        </div>
                    ) : (
                        <div className="deck empty">
                            No Cards Remaining
                        </div>
                    )}
    
                    {/* Buttons for Dealing, Resetting, Tossing & Wildcard */}
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
                                isPicked={pickedCard=== card}
                                onPick={handlePickCard}
                            />
                        ))}
                    </div>
    
                </div>
            );
        }
    
        ReactDOM.render(<Deck />, document.getElementById("root"));