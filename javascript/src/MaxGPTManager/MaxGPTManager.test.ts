import test from 'ava';
import MaxGPT from './MaxGPTManager';
// No idea why these have errors, I imported the types. It runs though
// so outta sight, outta mind for now!
//@ts-ignore
import * as fs from 'fs';
//@ts-ignore
import * as path from 'path';


test('ask function failure on missing API key', async t => {
  const maxGPT = new MaxGPT();
  const question = 'What is the difference between global and local variables in JavaScript?';
  maxGPT.API_KEY = ""
  try {
    await maxGPT.ask(question);
    t.fail('ask function should throw an error when API key is not set');
  } catch (error) {
    t.is(error.message, 'No OpenAI api-key set', 'Error message should indicate missing API key');
  }
});

test('extractJavaScriptBlocksAndText', (t) => {

  const input = `
    Some text before the script
    \`\`\`javascript
    const x = 42;
    \`\`\`
    Another piece of text between scripts
    \`\`\`javascript
    console.log('Hello, World!');
    console.log("i'm a bigger block");
    \`\`\`
    Some more text at the end
  `;

  const expectedOutput = {
    codeBlocks: [
      `const x = 42;`,
      `console.log('Hello, World!');\n    console.log("i'm a bigger block");`,
    ],
    text: `Some text before the script
    
    Another piece of text between scripts
    
    Some more text at the end`
  };
  const maxGPT = new MaxGPT();
  const result = maxGPT.separateJSfromText(input);
  t.deepEqual(result, expectedOutput);
});

test('set API_KEY', t => {
  const maxGPT = new MaxGPT();
  const apiKey = 'example_api_key';
  t.notThrows(() => {
    maxGPT.API_KEY = apiKey;
  });
  t.is(maxGPT['_API_KEY'], apiKey);
});

test('set MODEL', t => {
  const maxGPT = new MaxGPT();
  t.notThrows(() => {
    maxGPT.MODEL = 'gpt-4';
    maxGPT.MODEL = 'gpt-3.5-turbo';
  });
  t.throws(() => {
    maxGPT.MODEL = 'invalid_model';
  }, { instanceOf: Error, message: 'Model must be gpt-4 or gpt-3.5-turbo' });
});

test.serial('saveJS saves JavaScript files', async (t) => {
  const content = ['console.log("Test Block 1");', 'console.log("Test Block 2");'];
  const filePath = './.test/save';

  const maxGPT = new MaxGPT();
  const fileNames = maxGPT.saveJS(content, filePath);

  for (const fileName of fileNames) {
    t.true(fs.existsSync(fileName), `File ${fileName} should exist`);

    const fileContent = fs.readFileSync(fileName, 'utf-8');
    t.true(content.includes(fileContent), 'File content should match original content');
  }

  // Clean up the created files & folder
  for (const fileName of fileNames) {
    fs.unlinkSync(fileName);
  }
  fs.rmdirSync(filePath);

});

test('Setter for systemprompt sets new system prompt', (t) => {
  const maxGPTManager = new MaxGPT();
  const newPrompt = 'New system prompt';
  maxGPTManager.systemprompt = newPrompt;
  t.is(maxGPTManager.systemprompt, newPrompt);
});


test('Setter for systemprompt resets system prompt to default when empty string', (t) => {
  const maxGPTManager = new MaxGPT();
  const emptyString = "";
  const newPrompt = 'New system prompt';
  maxGPTManager.systemprompt = newPrompt;
  t.is(maxGPTManager.systemprompt, newPrompt);

  maxGPTManager.systemprompt = emptyString;
  t.is(maxGPTManager.systemprompt, maxGPTManager["defaultPrompt"]);
});

//Skipping this for now as it's long to run
test.skip('ask function response', async t => {
  //@ts-ignore
  const apiKey = process.env.OPEN_AI_KEY;

  const maxGPT = new MaxGPT();
  maxGPT.API_KEY = apiKey || "";
  maxGPT.patchpath = "./.test/ask"

  const question = 'how does closebang differ from freebang?';

  try {
    const response = await maxGPT.ask(question);
    t.truthy(response, 'Response should not be empty or undefined');
    t.is(response.length, 2)
    t.not(response[0].length, 0)
    t.is("string", typeof response[1])
    for (const fileName of response[0]) {
      fs.unlinkSync(path.join(maxGPT.patchpath, fileName));
    }
    fs.rmdirSync(maxGPT.patchpath);

  } catch (error) {
    t.fail(`Error occurred: ${error.message}`);
  }
});
