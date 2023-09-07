import {
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import * as fs from "fs";
import * as path from "path";
import { OpenAIChatCache } from "../OpenAIChatCache/OpenAIChatCache";
import { InMemoryCache } from "../OpenAIChatCache/InMemoryCache";
import { maxPathHelper } from "../helpers/helpers";

export type ProcessedText = {
  extracted: string[];
  text: string;
}

export type SupportedModels = "gpt-4" | "gpt-3.5-turbo";

export default class MaxGPTManager {
  private _API_KEY: string;
  private config: Configuration;
  private _temperature: number;
  public set temperature(temp: number) {
    if (temp < 0.0 || temp > 2.0)
      throw new Error("temperature must be between 0.0 and 2.0");
    this._temperature = temp;
  }
  public get temperature() {
    return this._temperature;
  }
  private _systemPrompt: string;
  private readonly defaultPrompt: string = `You are an expert at generating max map patches. You create these in json format as .maxpat files. You print your output as compactly as possible. You always surround the patch code with markdown code block indicators with the json language specified. You always use ezdac~ instead of dac~.Patches should be in the following format:

  {"patcher" : {"fileversion" : 1,"appversion" : {"major" : 8,"minor" : 5,"revision" : 4,"architecture" : "x64","modernui" : 1},"boxes" : [ {"box" : {"id" : "obj-4","maxclass" : "newobj","numinlets" : 1,"numoutlets" : 0,"patching_rect" : [ 146.0, 80.0, 47.0, 22.0 ],"text" : "midiout"}}, {"box" : 	{"id" : "obj-3","maxclass" : "newobj","numinlets" : 1,"numoutlets" : 1,"outlettype" : [ "int" ],"patching_rect" : [ 146.0, 21.0, 40.0, 22.0 ],"text" : "midiin"}}, 	{"box" : {"id" : "oscillator","maxclass" : "newobj","numinlets" : 2,"numoutlets" : 1,"outlettype" : [ "signal" ],"patching_rect" : [ 20.0, 20.0, 80.0, 22.0 ],"text" : "cycle~ 440"}}, {"box" : {"id" : "dac","maxclass" : "newobj","numinlets" : 2,"numoutlets" : 0,"patching_rect" : [ 20.0, 80.0, 50.0, 22.0 ],"text" : "dac~"}}],"lines" : [ {"patchline" : {"destination" : [ "obj-4", 0 ],"source" : [ "obj-3", 0 ]}}, {"patchline" : {"destination" : [ "dac", 0 ],"source" : [ "oscillator", 0 ]}}]}}
`;
  public set systemprompt(p: string) {
    this._systemPrompt = p === "" ? this.defaultPrompt : p;
  }
  public get systemprompt() {
    return this._systemPrompt;
  }
  private _MODEL: SupportedModels = "gpt-4";
  private FOLDER_SUFFIX = ".maxGPT";
  private _patchPath: string = "./";
  msgCache: OpenAIChatCache = new InMemoryCache();

  constructor() {
    //If this is running outside of max you might just have a key in your env anyway
    this.API_KEY = process.env.OPEN_AI_KEY || "";
    this.systemprompt = this.defaultPrompt;
    this.temperature = 0.2;
  }

  private removeLastElementIfPatchers(path: string): string {
    const elements = path.split("/");
    if (elements[elements.length - 1] === "patchers") {
      elements.pop();
    }
    return elements.join("/");
  }

  //Set the max msp patch path. This is called by the maxpat when the script starts.
  //It will reload the environment because setting this path is also an indication
  //that there might be a .env file added to the max patch folder
  //This is the recommended way to set your OPEN_AI_KEY
  public set patchpath(p: string) {
    //some handling for how max likes to deal with mac paths vs js
    p = maxPathHelper(p);
    p = this.removeLastElementIfPatchers(p);
    this._patchPath = p;
    this.loadEnvironment();
  }

  public loadEnvironment() {
    // Load the environment variables and store the result in a variable
    const dotenvResult = require("dotenv").config({
      path: path.join(this._patchPath, ".env"),
    });
    // Check if the dotenv configuration is successful
    if (dotenvResult.error) {
      console.error("Error loading .env file:", dotenvResult.error);
    } else {
      // Log the path to the .env file
      console.log(
        "Path to .env file:",
        this._patchPath
      );
    }
    //If the key is already set and there is not one in the env keep existing
    this.API_KEY = process.env.OPEN_AI_KEY || this._API_KEY;
  }

  public get patchpath() {
    return this._patchPath;
  }

  public set API_KEY(v: string) {
    this._API_KEY = v;
    this.config = new Configuration({
      apiKey: v,
    });
  }

  public set MODEL(v: SupportedModels) {
    if (v !== "gpt-4" && v !== "gpt-3.5-turbo")
      throw new Error("Model must be gpt-4 or gpt-3.5-turbo");
    this._MODEL = v;
    this.msgCache.clear();
  }
  public get MODEL(): SupportedModels {
    return this._MODEL;
  }

  separateJSfromText(input: string): ProcessedText {
    const regex = /```javascript([\s\S]*?)```/g;
    return this.separatefromText(input, regex);
  }

  separateJSONfromText(input: string): ProcessedText {
    const regex = /```json([\s\S]*?)```/g;
    return this.separatefromText(input, regex);
  }

  separatefromText(input: string, pattern: RegExp): ProcessedText {
    const codeBlocks: string[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let newText = "";

    while ((match = pattern.exec(input)) !== null) {
      codeBlocks.push(match[1].trim());
      newText += input.slice(lastIndex, match.index);
      lastIndex = pattern.lastIndex;
    }

    newText += input.slice(lastIndex);

    let processed: ProcessedText = {
      extracted: codeBlocks,
      text: newText.trim(),
    }

    return processed;
  }

  save(content: string[], patchPath: string, extension: string): string[] {
    const fileNames: string[] = [];
    if (!fs.existsSync(patchPath)) {
      fs.mkdirSync(patchPath, { recursive: true });
    }

    let ts = Date.now();
    let blockId = 0;

    for (const block of content) {
      const fileName = `${ts}_${blockId++}.${extension}`;
      const fullPath = path.join(patchPath, fileName);

      fs.writeFileSync(fullPath, block);

      fileNames.push(fullPath);
    }

    return fileNames;
  }

  async ask(q: string): Promise<[string[], string[], string]> {
    if (this._API_KEY === "") {
      throw new Error("No OpenAI api-key set");
    }
    //TODO: do we really need to do this each time?
    const openai = new OpenAIApi(this.config);

    let messages = [];
    messages.push({
      role: "system",
      content: this.systemprompt,
    });
    messages.push(...this.msgCache.getCache());
    const userInput: ChatCompletionResponseMessage = {
      role: "user",
      content: q,
    };
    messages.push(userInput);
    const completion = openai.createChatCompletion({
      model: this._MODEL,
      messages: messages,
      temperature: this.temperature,
    });
    return completion.then((data) => {
      let d = data.data;
      //once we have a response we cache both the user input and the output
      this.msgCache.addMsgToCache(userInput);
      this.msgCache.addMsgToCache(d.choices[0]?.message);
      //get the js from the result so we can use it in a js patcher
      let results = this.separateJSfromText(d.choices[0]?.message?.content);
      let jsonresult = this.separateJSONfromText(results.text);
      //write the js to disk and output an array of patchPaths, and any text which the
      const fullPath = path.join(this._patchPath, this.FOLDER_SUFFIX);
      const outfiles = this.save(results.extracted, fullPath, 'js');
      const outjsonfiles = this.save(jsonresult.extracted, fullPath, 'maxpat');
      const output: [Array<string>, Array<string>, string] = [outfiles, outjsonfiles, jsonresult.text];
      return output;
    });
  }
}
