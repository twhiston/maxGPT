import test from 'ava';
import MaxGPT from './MaxGPT';


test('ask function failure on missing API key', async t => {
  const maxGPT = new MaxGPT();
  const question = 'What is the difference between global and local variables in JavaScript?';
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

test('ask function response', async t => {
  //@ts-ignore
  const apiKey = process.env.OPEN_API_KEY;
  if (apiKey == undefined || apiKey === null)
    t.pass()
  const maxGPT = new MaxGPT();
  maxGPT.API_KEY = apiKey;

  const question = 'how does closebang differ from freebang?';

  try {
    const response = await maxGPT.ask(question);
    t.truthy(response, 'Response should not be empty or undefined');
  } catch (error) {
    t.fail(`Error occurred: ${error.message}`);
  }
});
