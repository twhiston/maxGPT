import maxGPT from './MaxGPT/MaxGPT';
import * as maxAPI from 'max-api-or-not';
import * as path from 'path';

let mgpt = new maxGPT();

maxAPI.addHandler('api-key', async (key: string) => {
    mgpt.API_KEY = key.toString();
    maxAPI.post("Set API Key")
});

maxAPI.addHandler('patch-path', async (key: string) => {
    mgpt.filepath = key.toString();
    maxAPI.post("Set filepath to", mgpt.filepath)
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
    maxAPI.outlet("text", "maxGPT asking question...")
    mgpt.ask(args).then((result) => {
        for (const res of result[0]) {
            maxAPI.outlet("code", res)
        }
        if (result[1] !== '')
            maxAPI.outlet("text", result[1])
    })
});