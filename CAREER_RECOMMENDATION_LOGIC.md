# Career Recommendation Logic

This document explains how the Software Career Quiz determines which careers to recommend to the user based on their answers.

The core logic resides in the `src/quizRunner.js` file, specifically within the `displayResults` function and its helpers. Here's a step-by-step breakdown:

1.  **Collect User Choices:**
    *   As the user progresses through the quiz, each choice they select is recorded. Each choice is associated with a specific question and, importantly, with a potential `answerId` (which represents a career outcome) and a `questionTypeId` (which categorizes the question).

2.  **Group Choices by Question Type (`groupChoicesByQuestionTypes`):**
    *   After the user completes all questions, their chosen choices are first grouped together based on the `questionTypeId` of the question they belonged to.
    *   This allows the quiz to potentially make different recommendations or assess suitability for careers based on different sets of questions (e.g., one set of questions might explore technical preferences, another might explore work-style preferences).

3.  **Group Choices by Answers within each Question Type (`groupChoicesByAnswers`):**
    *   For each group of choices belonging to the same `questionTypeId`, the system then further groups these choices based on their `answerId`.
    *   Each `answerId` typically corresponds to a specific career path or role that the quiz can recommend.

4.  **Find the Most Suitable Answer (`findMostSuitableAnswer`):**
    *   Within each `questionTypeId`'s collection of answers, the system counts how many times each unique `answerId` appears.
    *   The `answerId` that has the highest count (i.e., was selected most frequently by the user for questions of that type) is considered the "most suitable" or winning answer for that particular `questionTypeId`.

5.  **Display Results:**
    *   The `answerText` (the descriptive name of the career/role) associated with the winning `answerId` is then retrieved.
    *   This `answerText` is displayed to the user as a recommended career or outcome related to that specific question type.

**In Summary:**

The quiz doesn't use a complex weighting system or AI. For each category of questions (defined by `questionTypeId`), it identifies which career (`answerId`) was effectively "voted for" the most by the user's choices. The career with the most choices in its favor, within that category, is then recommended. If there are multiple question types, the user might see a result stemming from each type.

This logic is primarily implemented in these functions in `src/quizRunner.js`:
*   `displayResults()`
*   `groupChoicesByQuestionTypes()`
*   `groupChoicesByAnswers()`
*   `findMostSuitableAnswer()`
*   `getElementFromListById()` (used to retrieve the final answer details)

The actual careers, questions, choices, and their associations (linking choices to answers and question types) are defined in the Google Spreadsheets that feed data into the quiz via `src/fetchedJsonData.js`.
