import { MessageFile } from '@ai-sdk/ui-utils';
import { ImagePart, TextPart } from './content-part';

type ContentPart = TextPart | ImagePart;

export function filesToParts(files: MessageFile[]): ContentPart[] {
  const parts: ContentPart[] = [];

  for (const file of files) {
    if (file.type === 'data-url') {
      if (file.dataUrl.includes('image/')) {
        parts.push({ type: 'image', image: file.dataUrl });
      }
    } else if (file.type === 'url') {
      if (file.contentType.startsWith('image/')) {
        parts.push({ type: 'image', image: file.url });
      }
    }
  }

  return parts;
}
