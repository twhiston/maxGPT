import test from 'ava';
import { ChatCompletionResponseMessage } from 'openai';
import { OpenAIChatCache } from './OpenAIChatCache';
import { InMemoryCache } from './InMemoryCache';
import * as fs from 'fs';
import * as path from 'path';

test('addMsgToCache and getCache', t => {
    const cache = new InMemoryCache();
    const msg: ChatCompletionResponseMessage = { role: "user", content: "i'm a moron" };
    cache.addMsgToCache(msg);
    const fetchedMessages = cache.getCache();
    t.is(fetchedMessages.length, 1);
    t.deepEqual(fetchedMessages[0], msg);
});

test('writeToDisk and readFromDisk', async t => {
    const cache: OpenAIChatCache = new InMemoryCache();
    const msg: ChatCompletionResponseMessage = { role: "user", content: "hello" };
    cache.addMsgToCache(msg);
    const location = './.test/inmemorycache';
    fs.mkdirSync(location, { recursive: true });

    const filepath = path.join(location, 'cache_data.json')
    try {
        cache.writeToDisk(filepath);
    } catch (err) {
        t.fail(err.message);
    }

    t.true(fs.existsSync(filepath), `File ${filepath} should exist`);

    const fileContent = fs.readFileSync(filepath, 'utf-8');
    t.deepEqual(JSON.stringify([msg]), fileContent);

    const newCache: OpenAIChatCache = new InMemoryCache();
    const cachedata = await newCache.readFromDisk(filepath);
    const fetchedMessages = newCache.getCache();
    t.is(fetchedMessages.length, 1);
    t.deepEqual(fetchedMessages[0], msg);
    // Clean up the created files & folder
    fs.unlinkSync(filepath);
    fs.rmdirSync(location);
});