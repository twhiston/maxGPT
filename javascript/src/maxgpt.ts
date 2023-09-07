import maxGPT, { SupportedModels } from './MaxGPTManager/MaxGPTManager';
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

maxAPI.addHandler('clear-cache', async (location: string) => {
    mgpt.msgCache.clear();
    maxAPI.post("Cleared cache")
});

maxAPI.addHandler('prompt', async (prompt: string) => {
    if (prompt === undefined || prompt === null)
        prompt = ""
    mgpt.systemprompt = prompt.toString();
    maxAPI.post("Prompt set to:", mgpt.systemprompt)
});

maxAPI.addHandler('push-prompt', async () => {
    if (mgpt.MODEL == 'gpt-3.5-turbo') {
        mgpt.msgCache.clear();
        askHandler(mgpt.systemprompt)
        maxAPI.post("cleared cache, pushing prompt to model as priming message")
    } else {
        maxAPI.post("Model is not gpt-3.5-turbo, no need to push prompt")
    }
});

maxAPI.addHandler('temp', async (temp: number) => {
    mgpt.temperature = temp;
    maxAPI.post("Set temperature to ", mgpt.temperature)
});


maxAPI.addHandler('model', async (model: string) => {
    try {
        mgpt.MODEL = <SupportedModels>model.toString()
    } catch (error) {
        console.error(error.toString())
    }
});

maxAPI.addHandler('log-model', async (model: string) => {
    console.log(mgpt.MODEL)
});


// When node.script gets the symbol "text", the remainder will be passed to this function.
// The "..." is the spread operator. All of the arguments to this function will go into args as an array.
maxAPI.addHandler('ask', async (args) => {
    askHandler(args);
});

function askHandler(args) {
    maxAPI.outlet("text", "status", "maxGPT asking question...")
    mgpt.ask(args).then((result) => {
        for (const res of result[0]) {
            maxAPI.outlet("code", res)
        }
        for (const res of result[1]) {
            maxAPI.outlet("json", res)
        }
        maxAPI.outlet("text", "response", result[2])
    })
}
askHandler.local = 1