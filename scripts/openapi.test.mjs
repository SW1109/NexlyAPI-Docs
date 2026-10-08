import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { parse } from 'yaml'

const document = parse(readFileSync(new URL('../docs/public/openapi.yaml', import.meta.url), 'utf8'))
const schemas = document.components.schemas
const chat = document.paths['/v1/chat/completions'].post
const responses = document.paths['/v1/responses'].post
const embeddings = document.paths['/v1/embeddings'].post

const resolveRef = (ref) => {
  assert(ref.startsWith('#/'), `契约检查只允许站内引用：${ref}`)
  const value = ref.slice(2).split('/').reduce((node, key) => node?.[key.replaceAll('~1', '/').replaceAll('~0', '~')], document)
  assert.notEqual(value, undefined, `引用不存在：${ref}`)
  return value
}

const visit = (value, check) => {
  if (!value || typeof value !== 'object') return
  check(value)
  for (const child of Object.values(value)) visit(child, check)
}

const eventsFrom = (text) => text.trim().split(/\n\s*\n/).map((block) => {
  const lines = block.split('\n')
  return {
    event: lines.find((line) => line.startsWith('event:'))?.slice(6).trim(),
    data: lines.filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n')
  }
})

// 聚焦本站已声明的关键契约和示例；这些回归检查不替代完整 OpenAPI / JSON Schema 校验器。
test('OpenAPI 版本、鉴权、引用和 operationId 保持一致', () => {
  assert.equal(document.openapi, '3.1.0')
  assert.deepEqual(document.security, [{ BearerAuth: [] }])
  assert.equal(document.components.securitySchemes.BearerAuth.scheme, 'bearer')
  const operationIds = new Set()
  visit(document, (value) => {
    if (value.$ref) resolveRef(value.$ref)
    if (value.operationId) {
      assert(!operationIds.has(value.operationId), `operationId 重复：${value.operationId}`)
      operationIds.add(value.operationId)
      assert(value.responses?.['200'], `${value.operationId} 缺少成功响应`)
    }
  })
  assert.equal(operationIds.size, 7)
})

test('工具调用允许 assistant 的空 content，并关联对应工具结果', () => {
  assert.deepEqual(schemas.ChatMessage.required, ['role'])
  assert(schemas.ChatMessage.properties.content.oneOf.some((branch) => branch.type === 'null'))
  const assistantRule = schemas.ChatMessage.allOf.find((rule) => rule.if?.properties?.role?.const === 'assistant')
  assert.deepEqual(assistantRule.then.anyOf, [{ required: ['content'] }, { required: ['tool_calls'] }])
  assert.deepEqual(assistantRule.else.required, ['content'])
  const toolRule = schemas.ChatMessage.allOf.find((rule) => rule.if?.properties?.role?.const === 'tool')
  assert.deepEqual(toolRule.then.required, ['tool_call_id'])
  assert.equal(schemas.ChatMessage.properties.tool_calls.items.$ref, '#/components/schemas/ChatToolCall')

  const { messages, tools } = chat.requestBody.content['application/json'].examples.toolResult.value
  const assistant = messages.find((message) => message.role === 'assistant')
  const result = messages.find((message) => message.role === 'tool')
  assert.equal(assistant.content, null)
  const call = assistant.tool_calls[0]
  assert.equal(call.type, 'function')
  assert.equal(result.tool_call_id, call.id)
  assert.equal(tools[0].function.name, call.function.name)
  assert.equal(typeof JSON.parse(call.function.arguments).city, 'string')
  assert.equal(typeof JSON.parse(result.content).temperature, 'number')
})

test('向量响应描述及示例同时覆盖 float 与 base64', () => {
  assert.deepEqual(schemas.EmbeddingRequest.properties.encoding_format.enum, ['float', 'base64'])
  const variants = schemas.EmbeddingResponse.properties.data.items.properties.embedding.oneOf
  assert(variants.some((variant) => variant.type === 'array' && variant.items.type === 'number'))
  assert(variants.some((variant) => variant.type === 'string' && variant.contentEncoding === 'base64'))
  const examples = embeddings.responses['200'].content['application/json'].examples
  const floats = examples.float.value.data[0].embedding
  const encoded = examples.base64.value.data[0].embedding
  assert(floats.every((value) => typeof value === 'number'))
  const bytes = Buffer.from(encoded, 'base64')
  assert.equal(bytes.toString('base64'), encoded)
  assert.equal(bytes.length, floats.length * 4)
  floats.forEach((value, index) => assert(Math.abs(bytes.readFloatLE(index * 4) - value) < 1e-6))
})

test('Chat SSE 示例为增量消息，并以 DONE 结束', () => {
  const media = chat.responses['200'].content['text/event-stream']
  assert.equal(media.schema.type, 'string')
  assert.equal(media['x-event-schema'].$ref, '#/components/schemas/ChatCompletionChunk')
  const events = eventsFrom(media.example)
  assert.equal(events.at(-1).data, '[DONE]')
  for (const event of events.slice(0, -1)) {
    const chunk = JSON.parse(event.data)
    for (const key of schemas.ChatCompletionChunk.required) assert(key in chunk, `缺少 ${key}`)
    assert.equal(chunk.object, 'chat.completion.chunk')
    for (const choice of chunk.choices) {
      assert.equal(typeof choice.index, 'number')
      assert.equal(typeof choice.delta, 'object')
      assert(!('message' in choice), '增量响应不应伪装成完整 message')
    }
  }
})

test('Responses 的流式请求、媒体类型及事件名对应', () => {
  assert.equal(responses.requestBody.content['application/json'].examples.streaming.value.stream, true)
  const media = responses.responses['200'].content['text/event-stream']
  assert.equal(media.schema.type, 'string')
  assert.equal(media['x-event-schema'].$ref, '#/components/schemas/ResponseStreamEvent')
  const events = eventsFrom(media.example)
  for (const event of events) assert.equal(JSON.parse(event.data).type, event.event)
  const final = events.at(-1)
  assert.equal(final.event, 'response.completed')
  const response = JSON.parse(final.data).response
  for (const key of schemas.ResponseObject.required) assert(key in response, `缺少 ${key}`)
  assert.equal(response.status, 'completed')
  assert.equal(response.object, 'response')
})