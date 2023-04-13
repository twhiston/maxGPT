import maxGPT from './MaxGPT/MaxGPT';
import * as maxAPI from 'max-api-or-not';

let mgpt = new maxGPT();

maxAPI.addHandler('api-key', async (key: string) => {
    mgpt.API_KEY = key.toString();
});

maxAPI.addHandler('model', async (model: string) => {
    try {
        mgpt.MODEL = model.toString()
    } catch (error) {
        console.log(error)
    }
});


// When node.script gets the symbol "text", the remainder will be passed to this function.
// The "..." is the spread operator. All of the arguments to this function will go into args as an array.
maxAPI.addHandler('ask', async (args) => {
    console.log("maxGPT asking question...")
    mgpt.ask(args).then((result) => {
        for (const res of result.codeBlocks) {
            maxAPI.outlet("code", res)
        }
        maxAPI.outlet("text", result.text)
    })

});