import { ToolCall as CoreToolCall } from './duplicated/tool-call';
import { ToolResult as CoreToolResult } from './duplicated/tool-result';

export * from './use-assistant-types';

/**
 * @deprecated use AI SDK 3.1 CoreTool / ToolResult instead
 */
export interface FunctionCall {
  /**
   * The arguments to call the function with, as generated by the model in JSON
   * format. Note that the model does not always generate valid JSON, and may
   * hallucinate parameters not defined by your function schema. Validate the
   * arguments in your code before calling your function.
   */
  arguments?: string;

  /**
   * The name of the function to call.
   */
  name?: string;
}

/**
 * @deprecated use AI SDK 3.1 CoreTool / ToolResult instead
 *
 * The tool calls generated by the model, such as function calls.
 */
export interface ToolCall {
  /**
   * The ID of the tool call.
   */
  id: string;

  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: string;

  /**
   * The function that the model called.
   */
  function: {
    /**
     * The name of the function.
     */
    name: string;

    /**
     * The arguments to call the function with, as generated by the model in JSON
     */
    arguments: string;
  };
}

/**
 * @deprecated use AI SDK 3.1 CoreTool / ToolChoice instead
 *
 * Controls which (if any) function is called by the model.
 * - none means the model will not call a function and instead generates a message.
 * - auto means the model can pick between generating a message or calling a function.
 * - Specifying a particular function via {"type: "function", "function": {"name": "my_function"}} forces the model to call that function.
 * none is the default when no functions are present. auto is the default if functions are present.
 */
export type ToolChoice =
  | 'none'
  | 'auto'
  | { type: 'function'; function: { name: string } };

/**
 * @deprecated use AI SDK 3.1 CoreTool instead
 *
 * A list of tools the model may call. Currently, only functions are supported as a tool.
 * Use this to provide a list of functions the model may generate JSON inputs for.
 */
export interface Tool {
  type: 'function';
  function: Function;
}

/**
 * @deprecated use AI SDK 3.1 CoreTool instead
 */
export interface Function {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](/docs/guides/gpt/function-calling) for examples, and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * To describe a function that accepts no parameters, provide the value
   * `{"type": "object", "properties": {}}`.
   */
  parameters: Record<string, unknown>;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description?: string;
}

export type IdGenerator = () => string;

/**
Tool invocations are either tool calls or tool results. For each assistant tool call,
there is one tool invocation. While the call is in progress, the invocation is a tool call.
Once the call is complete, the invocation is a tool result.
 */
export type ToolInvocation =
  | CoreToolCall<string, any>
  | CoreToolResult<string, any, any>;

/**
 * AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.
 */
export interface Message {
  id: string;
  createdAt?: Date;

  content: string;

  /**
   * @deprecated Use AI SDK 3.1 `toolInvocations` instead.
   */
  tool_call_id?: string;

  /**
@deprecated Use AI SDK RSC instead: https://sdk.vercel.ai/docs/ai-sdk-rsc
 */
  ui?: string | JSX.Element | JSX.Element[] | null | undefined;

  /**
   * `function` and `tool` roles are deprecated.
   */
  role:
    | 'system'
    | 'user'
    | 'assistant'
    | 'function' // @deprecated
    | 'data'
    | 'tool'; // @deprecated

  /**
   *
   * If the message has a role of `function`, the `name` field is the name of the function.
   * Otherwise, the name field should not be set.
   */
  name?: string;

  /**
   * @deprecated Use AI SDK 3.1 `toolInvocations` instead.
   *
   * If the assistant role makes a function call, the `function_call` field
   * contains the function call name and arguments. Otherwise, the field should
   * not be set. (Deprecated and replaced by tool_calls.)
   */
  function_call?: string | FunctionCall;

  data?: JSONValue;

  /**
   * @deprecated Use AI SDK 3.1 `toolInvocations` instead.
   *
   * If the assistant role makes a tool call, the `tool_calls` field contains
   * the tool call name and arguments. Otherwise, the field should not be set.
   */
  tool_calls?: string | ToolCall[];

  /**
   * Additional message-specific information added on the server via StreamData
   */
  annotations?: JSONValue[] | undefined;

  /**
Tool invocations (that can be tool calls or tool results, depending on whether or not the invocation has finished)
that the assistant made as part of this message.
   */
  toolInvocations?: Array<ToolInvocation>;
}

export type CreateMessage = Omit<Message, 'id'> & {
  id?: Message['id'];
};

export type ChatRequest = {
  /**
An optional object of headers to be passed to the API endpoint.
 */
  headers?: Record<string, string> | Headers;

  /**
An optional object to be passed to the API endpoint.
*/
  body?: object;

  /**
The messages of the chat.
   */
  messages: Message[];

  /**
Additional data to be sent to the server.
   */
  data?: JSONValue;

  /**
The options to be passed to the fetch call.

@deprecated use `headers` and `body` directly
   */
  options?: RequestOptions;

  /**
   * @deprecated
   */
  functions?: Array<Function>;

  /**
   * @deprecated
   */
  function_call?: FunctionCall;

  /**
   * @deprecated
   */
  tools?: Array<Tool>;

  /**
   * @deprecated
   */
  tool_choice?: ToolChoice;
};

/**
 * @deprecated Use AI SDK 3.1 `streamText` and `onToolCall` instead.
 */
export type FunctionCallHandler = (
  chatMessages: Message[],
  functionCall: FunctionCall,
) => Promise<ChatRequest | void>;

/**
 * @deprecated Use AI SDK 3.1 `streamText` and `onToolCall` instead.
 */
export type ToolCallHandler = (
  chatMessages: Message[],
  toolCalls: ToolCall[],
) => Promise<ChatRequest | void>;

export type RequestOptions = {
  /**
An optional object of headers to be passed to the API endpoint.
 */
  headers?: Record<string, string> | Headers;

  /**
An optional object to be passed to the API endpoint.
   */
  body?: object;
};

export type ChatRequestOptions = {
  /**
Additional headers that should be to be passed to the API endpoint.
 */
  headers?: Record<string, string> | Headers;

  /**
Additional body JSON properties that should be sent to the API endpoint.
 */
  body?: object;

  /**
Additional data to be sent to the API endpoint.
   */
  data?: JSONValue;

  /**
The options to be passed to the fetch call.

@deprecated use `headers` and `body` directly
   */
  options?: RequestOptions;

  /**
@deprecated
*/
  functions?: Array<Function>;

  /**
@deprecated
*/
  function_call?: FunctionCall;

  /**
@deprecated
*/
  tools?: Array<Tool>;

  /**
@deprecated
*/
  tool_choice?: ToolChoice;
};

export type UseChatOptions = {
  /**
Keeps the last message when an error happens. This will be the default behavior
starting with the next major release.
The flag was introduced for backwards compatibility and currently defaults to `false`.
Please enable it and update your error handling/resubmit behavior.
   */
  keepLastMessageOnError?: boolean;

  /**
   * The API endpoint that accepts a `{ messages: Message[] }` object and returns
   * a stream of tokens of the AI chat response. Defaults to `/api/chat`.
   */
  api?: string;

  /**
   * A unique identifier for the chat. If not provided, a random one will be
   * generated. When provided, the `useChat` hook with the same `id` will
   * have shared states across components.
   */
  id?: string;

  /**
   * Initial messages of the chat. Useful to load an existing chat history.
   */
  initialMessages?: Message[];

  /**
   * Initial input of the chat.
   */
  initialInput?: string;

  /**
   * @deprecated Use AI SDK 3.1 `streamText` and `onToolCall` instead.
   *
   * Callback function to be called when a function call is received.
   * If the function returns a `ChatRequest` object, the request will be sent
   * automatically to the API and will be used to update the chat.
   */
  experimental_onFunctionCall?: FunctionCallHandler;

  /**
   * @deprecated Use AI SDK 3.1 `streamText` and `onToolCall` instead.
   *
   * Callback function to be called when a tool call is received.
   * If the function returns a `ChatRequest` object, the request will be sent
   * automatically to the API and will be used to update the chat.
   */
  experimental_onToolCall?: ToolCallHandler;

  /**
Optional callback function that is invoked when a tool call is received.
Intended for automatic client-side tool execution.

You can optionally return a result for the tool call,
either synchronously or asynchronously.
   */
  onToolCall?: ({
    toolCall,
  }: {
    toolCall: CoreToolCall<string, unknown>;
  }) => void | Promise<unknown> | unknown;

  /**
   * Callback function to be called when the API response is received.
   */
  onResponse?: (response: Response) => void | Promise<void>;

  /**
   * Callback function to be called when the chat is finished streaming.
   */
  onFinish?: (message: Message) => void;

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: (error: Error) => void;

  /**
   * A way to provide a function that is going to be used for ids for messages.
   * If not provided nanoid is used by default.
   */
  generateId?: IdGenerator;

  /**
   * The credentials mode to be used for the fetch request.
   * Possible values are: 'omit', 'same-origin', 'include'.
   * Defaults to 'same-origin'.
   */
  credentials?: RequestCredentials;

  /**
   * HTTP headers to be sent with the API request.
   */
  headers?: Record<string, string> | Headers;

  /**
   * Extra body object to be sent with the API request.
   * @example
   * Send a `sessionId` to the API along with the messages.
   * ```js
   * useChat({
   *   body: {
   *     sessionId: '123',
   *   }
   * })
   * ```
   */
  body?: object;

  /**
   * Whether to send extra message fields such as `message.id` and `message.createdAt` to the API.
   * Defaults to `false`. When set to `true`, the API endpoint might need to
   * handle the extra fields before forwarding the request to the AI service.
   */
  sendExtraMessageFields?: boolean;

  /** Stream mode (default to "stream-data") */
  streamMode?: 'stream-data' | 'text';

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: FetchFunction;
};

export type UseCompletionOptions = {
  /**
   * The API endpoint that accepts a `{ prompt: string }` object and returns
   * a stream of tokens of the AI completion response. Defaults to `/api/completion`.
   */
  api?: string;
  /**
   * An unique identifier for the chat. If not provided, a random one will be
   * generated. When provided, the `useChat` hook with the same `id` will
   * have shared states across components.
   */
  id?: string;

  /**
   * Initial prompt input of the completion.
   */
  initialInput?: string;

  /**
   * Initial completion result. Useful to load an existing history.
   */
  initialCompletion?: string;

  /**
   * Callback function to be called when the API response is received.
   */
  onResponse?: (response: Response) => void | Promise<void>;

  /**
   * Callback function to be called when the completion is finished streaming.
   */
  onFinish?: (prompt: string, completion: string) => void;

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: (error: Error) => void;

  /**
   * The credentials mode to be used for the fetch request.
   * Possible values are: 'omit', 'same-origin', 'include'.
   * Defaults to 'same-origin'.
   */
  credentials?: RequestCredentials;

  /**
   * HTTP headers to be sent with the API request.
   */
  headers?: Record<string, string> | Headers;

  /**
   * Extra body object to be sent with the API request.
   * @example
   * Send a `sessionId` to the API along with the prompt.
   * ```js
   * useChat({
   *   body: {
   *     sessionId: '123',
   *   }
   * })
   * ```
   */
  body?: object;

  /** Stream mode (default to "stream-data") */
  streamMode?: 'stream-data' | 'text';

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: FetchFunction;
};

/**
A JSON value can be a string, number, boolean, object, array, or null. 
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
export type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [value: string]: JSONValue }
  | Array<JSONValue>;

export type AssistantMessage = {
  id: string;
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: {
      value: string;
    };
  }>;
};

/*
 * A data message is an application-specific message from the assistant
 * that should be shown in order with the other messages.
 *
 * It can trigger other operations on the frontend, such as annotating
 * a map.
 */
export type DataMessage = {
  id?: string; // optional id, implement if needed (e.g. for persistance)
  role: 'data';
  data: JSONValue; // application-specific data
};

/**
 * Fetch function type (standardizes the version of fetch used).
 */
export type FetchFunction = typeof fetch;
