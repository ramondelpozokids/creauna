/**
 * Limpia fugas de stack/proveedores en mensajes visibles al cliente del Studio.
 */
export function sanitizeClientFacingMessage(message: string): string {
  if (!message) return message;
  return message
    .replace(/\s*Motor\s*:\s*[\w.-]+/gi, '')
    .replace(/\s*\((?:openai|gpt-4o(?:-mini)?|claude|gemini|groq|qwen|fal\.?ai|anthropic)[^)]*\)/gi, '')
    .replace(/\b(?:providers?Used|pipelineStage)\s*[:=]\s*[\w,.\s-]+/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
