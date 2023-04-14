# maxGPT

Do things in max with chatGPT.

## API KEYS

This requires an openAI API key. It is recommended that you have access to gpt4
as well, although gpt-3 is selectable it's not tested or recommended.

The easiest way to pass your api-key to maxGPT is to send the
`api-key my-api-key-value` to the inlet. However it's cool to just be able to
make a maxGPT object and go, so the recommended method is creating a `.env` file
in the root of the maxgpt project folder (the folder which has this README and
maxgpt.maxpat in). inside your `.env` file add the following

```env
OPEN_AI_KEY=my-api-key-value
```

## chat memory

maxGPT caches messages in-memory for chat context, so when you destroy the
object or quit max the conversation history is gone.

## TODO

* gpt-3 change how system prompt works
* text reply gets overlayed on repl and faded out when new typing
