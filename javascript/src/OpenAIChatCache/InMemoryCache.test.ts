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

test('addMsgToCache adds multiple messages to cache', t => {
    const cache = new InMemoryCache();
    const msg1: ChatCompletionResponseMessage = { role: 'user', content: "and this is my wife" };
    const msg2: ChatCompletionResponseMessage = { role: 'system', content: "she's frosting a cake with a paper knife" };


    cache.addMsgToCache(msg1);
    cache.addMsgToCache(msg2);

    const messages = cache.getCache();
    t.is(messages.length, 2);
    t.deepEqual(messages[0], msg1);
    t.deepEqual(messages[1], msg2);

});

test('addMsgToCache orders messages based on insertion', t => {
    const cache = new InMemoryCache();
    const msg1: ChatCompletionResponseMessage = { role: 'system', content: "all that we've go here's American made" };
    const msg2: ChatCompletionResponseMessage = { role: 'user', content: "it's a little bit cheesy but it's nicely displayed" };


    cache.addMsgToCache(msg2);
    cache.addMsgToCache(msg1);

    const messages = cache.getCache();
    t.is(messages.length, 2);
    t.deepEqual(messages[0], msg2);
    t.deepEqual(messages[1], msg1);

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


test('readFromDisk throws an error if the file does not exist', async t => {
    const cache = new InMemoryCache();
    const nonExistentLocation = '/non_existent_file.json';

    await t.throwsAsync(async () => {
        await cache.readFromDisk(nonExistentLocation);
    }, { instanceOf: Error, message: 'ENOENT: no such file or directory, open \'/non_existent_file.json\'' });
});