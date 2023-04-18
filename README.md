# maxGPT

bring gpt4 inside max msp to help you write patches. You need a paid OpenAI api
account to use this, as it consumes their paid API. By default it is using GPT4,
but you can switch it to gpt-3.5-turbo, however be aware that this uses a system
prompt to try to tighten up the max code it returns and to give it in a format
which this code can parse, 3.5 needs you to send this manually as the first
message. If you experiment with changing the system prompt it is highly
advisable to keep the line about returning code inside markdown code blocks.

## Requirements

* You must have `tw.gl.repl` installed
* OpenAI Api Key
* Preferably GPT4 Access

## How to use

add [maxGPT] to a patch, type a question in the window and hit option+return.
Go and make a cup of tea while you wait ages for chat-gpt to return a message.
When it returns a message a new patcher will open and perhaps a message will
be printed into the repl window.

## How does it work?

GPT4 cannot read or make compressed max patch format files, and max's
uncompressed JSON format is too verbose for it's reply length limits. However it
does have some grasp of using this.patcher in javascript to make max object.
It's not exactly amazing at it though, so don't set your expectations too high.
Perhaps a better prompt would help? You can give it a go!

## Commands

All of the following commands can be called from the [maxGPT] inlet. However in
normal operation, once you have created a .env file, you don't need to think
about these. If you need to advance in a more advanced way however there are a
few useful things you can do

### api-key

maxGPT requires an openAI API key. It is recommended that you have access to
gpt4.

The easiest way to pass your api-key to maxGPT is to send the
`api-key my-api-key-value` to the inlet. However it's cool to just be able to
make a maxGPT object and go, so the recommended method is creating a `.env` file
in the root of the maxgpt project folder (the folder which has this README and
maxgpt.maxpat in). inside your `.env` file add the following

```env
OPEN_AI_KEY=my-api-key-value
```

### patch-path

You should not normally need to call this! Set the max msp patch path. This is
called by the maxpat when the script starts. It will reload the environment
because setting this path is also an indication that there might be a .env file
added to the max patch folder. This is the recommended way to set your
OPEN_AI_KEY, see above

### save-cache

save the current message cache to disk as json, you can use this to pick up a
particular context again in future. If the object is deleted or the patch closed
the context is lost. It is not saved on patch save, so you must call this
function if you want to retain it. Either pass it a path to a file, or it will
open a savedialog.

Be aware context lengths are limited by OpenAI limits.

### load-cache

reload a chat history into maxGPT.

### clear-cache

deletes all the data in the hot cache. Next message will be the start of a new conversation

### prompt

Change the system prompt. See code for the current default. It's really important
that your prompt tells chatGPT to wrap the code it returns in markdown code blocks.

```Javascript
//some gpt4 generated javascript here
```

In the default system prompt this is expressed as "You only return javascript
code and you mark it as such by using markdown code blocks specifying the
language" this seems to be fairly foolproof so it's suggested to keep it
included

### temp

Set the temperature of the response. Higher numbers are more creative but
probably less correct. Defaults to 0.1. Must be between 0.0 and 2.0

### model

Can be `gpt-4` or `gpt-3.5-turbo`. Defaults to `gpt-4`.

Although gpt-3 is selectable it's not tested or recommended. GPT-3 does not use
sytem prompts so you will need to manaully prompt it before you start talking.
It might not work well with the built in system prompt, so in the case of GPT-3
you may need to manually prime it with the existing prompt.

### ask

This is what is called by the repl when you hit option+enter

## TODO

* Improve prompt
* auto prime chat-gpt when 3.5 is selected
