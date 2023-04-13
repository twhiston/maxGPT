import { Configuration, OpenAIApi } from 'openai';

export default class MaxGPT {

    private _API_KEY: string = ""
    private config: Configuration
    private readonly systemPrompt: string = "You are an expert at creating max map patches with javascript, you know the max javascript api inside and out. You know that it uses javascript 1.6 and is es3 compatible so you only use old functions or provide pollyfills when needed to write the best quality code. You understand that the apply method in this.patcher applies a function to each max object in the patch with the object passed in. You are scrupulous about the patches you generate from javascript being clear and easy to read, with ample spacing between the objects your code creates. Whenever you are asked about max you prefer to write javascript which creates a patch demonstrating the answer than talking. Do not provide explanation about the code you are asked to write unless you are specifically asked to explain, but do make concise and useful comments in the code you generate."
    private _MODEL: string = "gpt-4"

    constructor() { }

    public set API_KEY(v: string) {
        this._API_KEY = v;
        this.config = new Configuration({
            apiKey: v,
        })
    }

    public set MODEL(v: string) {
        if (v !== "gpt-4" && v !== "gpt-3.5-turbo")
            throw new Error("Model must be gpt-4 or gpt-3.5-turbo")
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


    async ask(q: string) {
        if (this._API_KEY === "") {
            throw new Error("No OpenAI api-key set")
        }
        //TODO: do we really need to do this each time?
        const openai = new OpenAIApi(this.config);
        const completion = openai.createChatCompletion({
            model: "gpt-4",
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
            return results;
        })

    }
}