import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import NodeCache = require('node-cache');

export default class MaxGPT {

    private _API_KEY: string;
    private config: Configuration
    private readonly systemPrompt: string = `Generate JavaScript code to create a Max MSP patch using this.patcher, following these guidelines:
    Use JavaScript 1.6 (ES3) syntax and functions, or provide polyfills when needed for compatibility.
    Remember that the apply method in this.patcher iterates through Max objects, applying a function to each object.
    Use the .set(value) method to set comment or message object data after creating them with newdefault.
    Place the generated content inside a subpatcher with a unique timestamp in its name.
    Call .subpatcher() on the created subpatcher object and use the returned value for creating new MaxObjs.
    Ensure the generated patches are clear, well-organized, and easy to read, with sufficient spacing between elements.
    Invoke the main function at the end of the JavaScript code to generate the Max MSP patch.
    Format the returned code using Markdown code blocks, specifying the language as JavaScript.
    Focus solely on providing JavaScript code for Max MSP and avoid explanations, small talk, or pleasantries.`
    private _MODEL: string = "gpt-4"
    private FOLDER_SUFFIX = ".maxGPT"
    private _filepath: string = "./"
    private msgCache = new NodeCache();

    public set filepath(p: string) {
        const prefix = "Macintosh HD:";
        if (p.startsWith(prefix)) {
            p = p.substring(prefix.length);
        }
        this._filepath = p
        // Load the environment variables and store the result in a variable
        const dotenvResult = require('dotenv').config({ path: path.join(p, ".env") });
        // Check if the dotenv configuration is successful
        if (dotenvResult.error) {
            console.error('Error loading .env file:', dotenvResult.error);
        } else {
            // Log the path to the .env file
            console.log('Path to .env file:', dotenvResult.parsed['DOTENV_CONFIG_PATH']);
        }
        this.API_KEY = process.env.OPEN_AI_KEY || this._API_KEY
    }

    public get filepath() {
        return this._filepath
    }

    constructor() {
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

    saveJS(content: string[], filePath: string): string[] {
        const fileNames: string[] = [];
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        let ts = Date.now();
        let blockId = 0;

        for (const block of content) {
            const fileName = `${ts}_${blockId++}.js`;
            const fullPath = path.join(filePath, fileName);

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
        const cachekeys = this.msgCache.keys();
        const messages = []
        messages.push({
            role: "system",
            content: this.systemPrompt
        })
        for (const key of cachekeys) {
            const msg = this.msgCache.get(key);
            messages.push(msg);
        }
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
            const cachekeys = this.msgCache.keys();
            if (cachekeys.length === 0) {
                this.msgCache.set(0, d.choices[0]?.message)
            } else {
                let lastKey = cachekeys[cachekeys.length - 1];
                this.msgCache.set(lastKey + 1, d.choices[0]?.message)
            }

            //get the js from the result so we can use it in a js patcher
            let results = this.separateJSfromText(d.choices[0]?.message?.content)
            //write the js to disk and output an array of filepaths, and any text which the
            const fullPath = path.join(this._filepath, this.FOLDER_SUFFIX);
            const outfiles = this.saveJS(results.codeBlocks, fullPath);
            const output: [Array<string>, string] = [outfiles, results.text]
            return output;
        })

    }
}