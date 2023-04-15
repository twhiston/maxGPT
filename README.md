# maxGPT

bring gpt4 inside max msp to help you write patches.
You need an api account with openai to use this, as it consumes their paid API.
Uses a system prompt to try to tighten up the max code it returns and to give it in a
format which this code can parse.
If you experiment with changing the system prompt it is highly advisable to keep the
line about returning code inside markdown code blocks.

## API KEYS

This requires an openAI API key. It is recommended that you have access to gpt4
as well, although gpt-3 is selectable it's not tested or recommended. It might not
work well with the built in system prompt, so in the case of GPT-3 you may need to
manually prime it with the existing prompt.

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
To get a new context deleted the maxgpt object and make another.
You can save and reload the chat cache to/from disk if needed.

## TODO

* save and load context to/from json
* override the system prompt
* text reply gets overlayed on repl and faded out when new typing
