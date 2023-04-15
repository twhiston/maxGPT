import { ChatCompletionResponseMessage } from 'openai';

//Generic interface for a chat msg cache so we could add something more
//elaborate in future if needed
export interface OpenAIChatCache {
    addMsgToCache(msg: ChatCompletionResponseMessage)
    getCache(): Array<ChatCompletionResponseMessage>
    writeToDisk(location: string)
    readFromDisk(location: string)
}