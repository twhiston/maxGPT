import * as fs from 'fs';
import path = require('path');
import NodeCache = require('node-cache');
import { ChatCompletionResponseMessage } from 'openai';

import { maxPathHelper } from '../helpers/helpers';
import { OpenAIChatCache } from './OpenAIChatCache';

export class InMemoryCache implements OpenAIChatCache {

    private msgCache: NodeCache;

    constructor() {
        this.msgCache = new NodeCache();
    }

    clear() {
        this.msgCache.flushAll()
    }

    addMsgToCache(msg: ChatCompletionResponseMessage) {
        const cachekeys = this.msgCache.keys();
        if (cachekeys.length === 0) {
            this.msgCache.set(0, msg)
        } else {
            let lastKey = cachekeys[cachekeys.length - 1];
            this.msgCache.set(lastKey + 1, msg)
        }
    }

    getCache(): Array<ChatCompletionResponseMessage> {
        const messages = []
        const cachekeys = this.msgCache.keys()
        for (const key of cachekeys) {
            const msg = this.msgCache.get(key);
            messages.push(msg);
        }
        return messages;
    }

    writeToDisk(location: string) {
        location = maxPathHelper(location)
        const lpath = path.parse(location).dir
        if (!fs.existsSync(lpath)) {
            fs.mkdirSync(lpath, { recursive: true });
        }
        const cacheData = this.getCache();
        fs.writeFileSync(location, JSON.stringify(cacheData));
    }

    async readFromDisk(location: string) {
        location = maxPathHelper(location)
        const absolutePath = path.resolve(location);
        const fileContent = await fs.promises.readFile(absolutePath, 'utf-8');
        const parsedContent = JSON.parse(fileContent)
        const cacheData = []
        parsedContent.forEach((msg, i) => {
            cacheData.push({ key: i, val: msg })
        });
        this.msgCache.flushAll();
        const success = this.msgCache.mset(cacheData)
        if (!success) {
            throw new Error("failed to set cache data")
        }

    }

}