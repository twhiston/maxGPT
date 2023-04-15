import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAIChatCache } from '../OpenAIChatCache/OpenAIChatCache';
import { InMemoryCache } from '../OpenAIChatCache/InMemoryCache';
import { maxPathHelper } from '../helpers/helpers';

export default class MaxGPT {

    private _API_KEY: string;
    private config: Configuration
    private readonly systemPrompt: string = `You are an expert at generating max map patches through their javascript api, using this.patcher. You always keep the following rules in mind:
    1. You know that max msp uses javascript 1.6 and is only es3 compatible so you only use old functions or provide polyfills when needed to write the best quality code. 
    2. You understand that the apply method in this.patcher applies a function to each max object in the patch with the object passed in. 
    3. You know that the .message method does not exist on MaxObj  
    4. You know that you cannot set comment or message objects data in newdefault, you need to call .set(value) on them after instead. 
    5. You always present your solutions in new subpatchers with a timestamp in their name. 
    6. You know that when you create a subpatcher you need to call .subpatcher() and use the return value to create new MaxObjs
    6. You are scrupulous about the patches you generate from javascript being clear and easy to read, with ample spacing between the elements. 
    7. If you do not generate code where you call the function to run it directly at the end of a script you always include a bang function which runs the code or demonstrates it with example settings and you connect a [button] to the js object for the user to press.
    8. You only return javascript code and you mark it as such by using markdown code blocks specifying the language
    9. YOU DO NOT EXPLAIN YOUR WORK OR ENGAGE IN SMALL TALK OR PLEASANTRIES. If specifically asked you will explain something but otherwise you only return javascript.`
    private _MODEL: string = "gpt-4"
    private FOLDER_SUFFIX = ".maxGPT"
    private _patchPath: string = "./"
    msgCache: OpenAIChatCache = new InMemoryCache();

    //Set the max msp patch path. This is called by the maxpat when the script starts.
    //It will reload the environment because setting this path is also an indication
    //that there might be a .env file added to the max patch folder
    //This is the recommended way to set your OPEN_AI_KEY
    public set patchpath(p: string) {
        //some handling for how max likes to deal with mac paths vs js
        p = maxPathHelper(p)
        this._patchPath = p
        this.loadEnvironment()
    }

    public loadEnvironment() {
        // Load the environment variables and store the result in a variable
        const dotenvResult = require('dotenv').config({ path: path.join(this._patchPath, ".env") });
        // Check if the dotenv configuration is successful
        if (dotenvResult.error) {
            console.error('Error loading .env file:', dotenvResult.error);
        } else {
            // Log the path to the .env file
            console.log('Path to .env file:', dotenvResult.parsed['DOTENV_CONFIG_PATH']);
        }
        //If the key is already set and there is not one in the env keep existing
        this.API_KEY = process.env.OPEN_AI_KEY || this._API_KEY
    }

    public get patchpath() {
        return this._patchPath
    }

    constructor() {
        //If this is running outside of max you might just have a key in your env anyway
        this.API_KEY = process.env.OPEN_AI_KEY || ""
    }

    public set API_KEY(v: string) {
        this._API_KEY = v;
        this.config = new Configuration({
            apiKey: v,
        })
    }

    public set MODEL(v: string) {
        if (v !== "gpt-4" && v !== "gpt-3.5-turbo")
            throw new Error("Model must be gpt-4 or gpt-3.5-turbo")
        this._MODEL = v;
    }

    separateJSfromText(input: string): { codeBlocks: string[]; text: string } {
        const regex = /```javascript([\s\S]*?)```/g;
        const codeBlocks: string[] = [];
        let match: RegExpExecArray | null;
        let lastIndex = 0;
        let newText = '';

        while ((match = regex.exec(input)) !== null) {
            codeBlocks.push(match[1].trim());
            newText += input.slice(lastIndex, match.index);
            lastIndex = regex.lastIndex;
        }

        newText += input.slice(lastIndex);

        return { codeBlocks, text: newText.trim() };

    }

    saveJS(content: string[], patchPath: string): string[] {
        const fileNames: string[] = [];
        if (!fs.existsSync(patchPath)) {
            fs.mkdirSync(patchPath, { recursive: true });
        }

        let ts = Date.now();
        let blockId = 0;

        for (const block of content) {
            const fileName = `${ts}_${blockId++}.js`;
            const fullPath = path.join(patchPath, fileName);

            fs.writeFileSync(fullPath, block);

            fileNames.push(fullPath);
        }

        return fileNames;
    }


    async ask(q: string): Promise<[string[], string]> {
        if (this._API_KEY === "") {
            throw new Error("No OpenAI api-key set")
        }
        //TODO: do we really need to do this each time?
        const openai = new OpenAIApi(this.config);

        let messages = []
        messages.push({
            role: "system",
            content: this.systemPrompt
        })
        messages.push(...this.msgCache.getCache());
        messages.push({
            role: "user",
            content: q,
        })
        const completion = openai.createChatCompletion({
            model: this._MODEL,
            messages: messages,
        });
        return completion.then(data => {
            let d = data.data
            //add the message to the message history cache
            this.msgCache.addMsgToCache(d.choices[0]?.message)
            //get the js from the result so we can use it in a js patcher
            let results = this.separateJSfromText(d.choices[0]?.message?.content)
            //write the js to disk and output an array of patchPaths, and any text which the
            const fullPath = path.join(this._patchPath, this.FOLDER_SUFFIX);
            const outfiles = this.saveJS(results.codeBlocks, fullPath);
            const output: [Array<string>, string] = [outfiles, results.text]
            return output;
        })

    }
}