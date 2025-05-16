import chalk from "chalk";
import { select, input } from "@inquirer/prompts";
import {
	quizHistory,
	quizArrayIndianHistory,
	quizArrayMetallurgy,
} from "./quizState.js";

export async function showMainMenu() {
	const action = await select({
		message: "Main Menu",
		choices: [
			{ name: "Quiz Metallurgy:", value: "quiz1" },
			{ name: "Quiz Indian History:", value: "quiz2" },
			{ name: "See Previous Scores", value: "view" },
			{ name: "Quit", value: "quit" },
		],
	});

	switch (action) {
		case "quiz1":
			await quizTaker(quizArrayMetallurgy);
			break;
		case "quiz2":
			await quizTaker(quizArrayIndianHistory);
			break;
		case "view":
			console.log(chalk.blue("Here are your stats"));
			console.log(chalk.blue(quizHistory));
			showMainMenu();
			break;
		case "quit":
			console.log("Goodbye!");
			process.exit(0);
	}
}

export async function quizTaker(quiz) {
	console.log(
		"welsome to the quiz!",
		"You will have 20 seconds to answer each question. When you answer, the next question will begin immediatly."
	);
	let score = 0; //a running total of correct answers
	for (let index = 0; index < quiz.length; index++) {
		const result = await quizQuestion(quiz[index]); // gets a true of false result and adds it to the score
		if (result === true) {
			score += 1;
			console.log(chalk.blue("Correct, Score so far: ", score));
		} else if (result === false) {
			console.log(chalk.red("Incorrect, Score so far: ", score));
		} else {
			console.log(
				chalk.bgGreenBright(
					"ERROR: Passed result should be true or false"
				)
			);
		}
	}
	quizHistory.push(` ${score}/ ${quiz.length}`);
	console.log(chalk.blue(` ${score}/ ${quiz.length}`));
	showMainMenu();
} // function to  move through the quiz array as questions are passed or failed, uses quizQuestion for the question/timer itself

export async function quizQuestion(questionObject) {
	console.log(questionObject.question);
	let timeLeft = 20000; //gives 20 seconds to answer
	const interval = 2000; //sets the interval to 2

	//  Race the prompt against a timeout, whatever happens first is the result. Function must come before the setInterval to prevent inaccurate time warnings.
	const answerRace = input({ message: "Please enter your answer: " });
	const timeoutRace = new Promise((_, reject) =>
		setTimeout(() => reject(new Error("timeout")), timeLeft)
	);

	//log a timeleft every 2 seconds
	const timerID = setInterval(() => {
		timeLeft -= interval;
		console.log(timeLeft / 1000, " seconds left!");
	}, interval);

	try {
		const answer = await Promise.race([answerRace, timeoutRace]); //returns race result
		clearInterval(timerID);
		return answer.trim().toLowerCase() === questionObject.answer; //returns true of false based on result of question
	} catch {
		clearInterval(timerID); //end timer here instead of in interval because the timeout stops the interval
		console.log(chalk.red("Time's up!"));
		return false;
	}
} //funxtion to handle asking a question, starting a timer and getting a response
