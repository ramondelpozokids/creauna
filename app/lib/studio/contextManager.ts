import { getProject } from '../projects';
import type { PreviewSection } from '../ai/studioEngine';
import type { StudioChatMessage, StudioLang } from './contextTypes';
import { buildSectionOutline, isFullScopeAction, selectSectionsForTask } from './sectionSelector';

const MAX_RECENT_MESSAGES = 8;

export interface HydratedStudioContext {
  previewSections: PreviewSection[];
  recentMessages: StudioChatMessage[];
  templateSlug: string | null;
  projectName: string;
  lang: StudioLang;
  fullScope: boolean;
  focusSectionId?: number;
  sectionOutline: string;
}

export interface HydrateInput {
  userId?: string;
  projectId?: string;
  clientSections?: PreviewSection[];
  action: string;
  sectionId?: number;
  messages?: StudioChatMessage[];
  lang: StudioLang;
}

function normalizeMessages(raw: unknown): StudioChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as { content?: unknown }).content === 'string' &&
        typeof (m as { role?: unknown }).role === 'string'
    )
    .map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('ai' as const),
      content: m.content.slice(0, 2000),
    }))
    .slice(-MAX_RECENT_MESSAGES);
}

function formatRecentChat(messages: StudioChatMessage[]): string {
  if (messages.length === 0) return '';
  return messages
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 300)}`)
    .join('\n');
}

export { formatRecentChat };

/** Hidrata contexto antes de generar: proyecto, chat reciente, alcance de secciones. */
export async function hydrateStudioContext(input: HydrateInput): Promise<HydratedStudioContext> {
  const { userId, projectId, clientSections, action, sectionId, messages, lang } = input;

  let previewSections: PreviewSection[] = Array.isArray(clientSections) ? clientSections : [];
  let templateSlug: string | null = null;
  let projectName = 'Mi proyecto';
  let storedMessages: StudioChatMessage[] = [];

  if (userId && projectId) {
    const project = await getProject(userId, projectId);
    if (project) {
      if (previewSections.length === 0) {
        previewSections = project.sections as PreviewSection[];
      }
      templateSlug = project.templateSlug;
      projectName = project.name;
      storedMessages = normalizeMessages(project.messages);
    }
  }

  const recentMessages = normalizeMessages(messages).length
    ? normalizeMessages(messages)
    : storedMessages;

  const { focusSectionId, fullScope } = selectSectionsForTask(previewSections, action, sectionId);
  const sectionOutline = buildSectionOutline(
    previewSections,
    fullScope ? undefined : focusSectionId
  );

  return {
    previewSections,
    recentMessages,
    templateSlug,
    projectName,
    lang,
    fullScope: fullScope || isFullScopeAction(action),
    focusSectionId,
    sectionOutline,
  };
}
