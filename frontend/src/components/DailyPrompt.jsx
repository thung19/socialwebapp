// Import React hooks to manage state and side-effects
import { useState, useEffect } from "react";

// Import the component-specific CSS styles
import "../styles/DailyPrompt.css";

// Define the DailyPrompt functional component
const DailyPrompt = () => {

    // State variable to hold today's chosen prompt text
    // Initially empty until useEffect runs
    const [todaysPrompt, setTodaysPrompt] = useState("");

    // Static array of daily prompt questions
    // The app will pick one based on the current date
    const prompts = [
        "What's one thing that made you smile today?",
        "What's your favorite food and why?",
        "If you could travel anywhere, where would you go?",
        "What's something you're grateful for?",
        "What's your favorite hobby?",
        "What's the best advice you've ever received?",
        "What's something new you learned recently?",
        "What's your favorite season and why?",
        "What's a goal you're working towards?",
        "What's something that always makes you happy?",
        "What is your favorite movie?"
    ];

    // useEffect runs after the first render (mount)
    // It calculates which prompt to display today
    useEffect(() => {
        // Get the numeric day of the month (1-31)
        const dayIndex = new Date().getDate() % prompts.length;
        // Use modulo to wrap around if days exceed prompt count
        // Then update the state with the selected prompt
        setTodaysPrompt(prompts[dayIndex]);
    }, []); // Empty dependency array → run only once on mount

    // If no prompt has been set yet, render nothing to avoid empty UI
    if (!todaysPrompt) return null;

    // Render the component's UI
    return (
        <div className="daily-prompt"> {/* Wrapper with custom CSS class */}
            <h3>🌟 Daily Prompt</h3>
            <p className="prompt-question">{todaysPrompt}</p> {/* Display today's prompt */}
            
            <div className="prompt-actions">
                {/* Simple instruction to guide the user */}
                <p>Create a post below to answer this prompt!</p>
            </div>
        </div>
    );
};

// Export the component so it can be used in other parts of the app
export default DailyPrompt;
