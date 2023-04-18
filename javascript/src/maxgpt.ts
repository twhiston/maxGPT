import maxGPT from './MaxGPTManager/MaxGPTManager';
import * as maxAPI from 'max-api-or-not';
import * as path from 'path';

let mgpt = new maxGPT();

maxAPI.addHandler('api-key', async (key: string) => {
    mgpt.API_KEY = key.toString();
    maxAPI.post("Set API Key")
});

maxAPI.addHandler('patch-path', async (key: string) => {
    mgpt.patchpath = key.toString();
    maxAPI.post("Set filepath to", mgpt.patchpath)
});

maxAPI.addHandler('save-cache', async (location: string) => {
    mgpt.msgCache.writeToDisk(location.toString());
    maxAPI.post("Saved cache to", location.toString())
});

maxAPI.addHandler('load-cache', async (location: string) => {
    mgpt.msgCache.readFromDisk(location.toString());
    maxAPI.post("Loaded cache from", location.toString())
});

maxAPI.addHandler('prompt', async (prompt: string) => {
    if (prompt === undefined || prompt === null)
        prompt = ""
    mgpt.systemprompt = prompt.toString();
    maxAPI.post("Prompt set to:", mgpt.systemprompt)
});

maxAPI.addHandler('temp', async (temp: number) => {
    mgpt.temperature = temp;
    maxAPI.post("Set temperature to ", mgpt.temperature)
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
    maxAPI.outlet("text", "status", "maxGPT asking question...")
    mgpt.ask(args).then((result) => {
        for (const res of result[0]) {
            maxAPI.outlet("code", res)
        }
        if (result[1] !== '')
            maxAPI.outlet("text", "response", result[1])
    })
});