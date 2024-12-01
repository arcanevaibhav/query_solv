const { Api, TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const intro = 'Telegram Query ID Bot';
const apiId = ;  // Your actual API ID
const apiHash = '';  // Your actual API Hash

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask a question using readline
function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

const accounts = new Map();

// Function to login using a phone number
async function loginWithPhoneNumber() {
    const phoneNumber = await askQuestion("Please enter your phone number (e.g., +1234567890): ");
    const stringSession = new StringSession('');
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

    await client.start({
        phoneNumber: async () => phoneNumber,
        phoneCode: async () => await askQuestion("Please enter the code you received: "),
        password: async () => await askQuestion("Please enter your password (if required): "),
        onError: (error) => console.error("Error:", error),
    });

    console.log('Logged in successfully');

    const sessionString = client.session.save();
    const sessionFolder = 'sessions';
    const sanitizedPhone = phoneNumber.replace(/\D/g, '');
    const sessionFile = path.join(sessionFolder, `${sanitizedPhone}.session`);

    if (!fs.existsSync(sessionFolder)) {
        fs.mkdirSync(sessionFolder);
    }
    fs.writeFileSync(sessionFile, sessionString);
    console.log(`Session saved to ${sessionFile}`);
}

// Function to handle WebView interaction
async function requestWebView() {
    const botPeer = await askQuestion("Please enter the bot peer (e.g., @YourBot): ");
    const webViewUrl = await askQuestion("Please enter the WebView URL: ");

    // Simulating extraction of query_id and user data
    // In real use, you would interact with the bot and parse its response
    const queryId = "query_id=AAEZrHpJAAAAABmsekkyTkHK"; // Example query_id
    const userData = "user=%7B%22id%22%3A1232776217%2C%22first_name%22%3A%22UnderSword%20%E2%96%AA%EF%B8%8F%22%7D"; // Example user data

    const formattedOutput = `Bot: ${botPeer} | WebAppData: ${queryId}&${userData}`;

    const outputFile = path.join(__dirname, 'query_output.txt');
    fs.writeFileSync(outputFile, formattedOutput);
    console.log(`Query ID and User Data saved to ${outputFile}`);
}

(async () => {
    console.log(intro);
    const loginChoice = await askQuestion("Choose login method (1: Phone Number, 2: Session String): ");
    if (loginChoice === '1') {
        await loginWithPhoneNumber();
    } else {
        console.log("Session String login not implemented in this example.");
    }

    const actionChoice = await askQuestion("Choose action (1: Request WebView): ");
    if (actionChoice === '1') {
        await requestWebView();
    }

    rl.close();
})();
