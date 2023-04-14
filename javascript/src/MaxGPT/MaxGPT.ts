import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

export default class MaxGPT {

    private _API_KEY: string = ""
    private config: Configuration
    private readonly systemPrompt: string = `You are an expert at generating max map patches through their javascript api, using this.patcher. You always keep the following points in mind:
    1. You know that max msp uses javascript 1.6 and is only es3 compatible so you only use old functions or provide polyfills when needed to write the best quality code. 
    2. You understand that the apply method in this.patcher applies a function to each max object in the patch with the object passed in. 
    3. You know that the .message method does not exist on MaxObj  
    4. You know that you cannot set comment or message objects data in newdefault, you need to call .set(value) on them after instead. 
    5. You always present your solutions in new subpatchers with a timestamp in their name. 
    6. You are scrupulous about the patches you generate from javascript being clear and easy to read, with ample spacing between the elements. 
    7. If you do not generate code where you call the function to run it directly at the end of a script you always include a bang function which runs the code or demonstrates it with example settings
    8. You only return javascript code and you mark it as such by using markdown code blocks specifying the language
    9. YOU DO NOT EXPLAIN YOUR WORK OR ENGAGE IN SMALL TALK OR PLEASANTRIES. ONLY RETURN JAVASCRIPT UNLESS STRICTLY NECESSARY.`
    private _MODEL: string = "gpt-4"
    private FOLDER_SUFFIX = ".maxGPT"
    private _filepath: string = "./"

    public set filepath(p: string) {
        const prefix = "Macintosh HD:";
        if (p.startsWith(prefix)) {
            p = p.substring(prefix.length);
        }
        this._filepath = p
    }

    public get filepath() {
        return this._filepath
    }

    constructor() { }

    public set API_KEY(v: string) {
        const env = process.env;
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
        const completion = openai.createChatCompletion({
            model: this._MODEL,
            messages: [
                {
                    role: "system",
                    content: this.systemPrompt
                },
                {
                    role: "user",
                    content: q,
                }],
        });
        return completion.then(data => {
            let d = data.data
            let results = this.separateJSfromText(d.choices[0]?.message?.content)
            const fullPath = path.join(this._filepath, this.FOLDER_SUFFIX);
            const outfiles = this.saveJS(results.codeBlocks, fullPath);
            const output: [Array<string>, string] = [outfiles, results.text]
            return output;
        })

    }
}