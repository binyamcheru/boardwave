import type { Editor } from '@quickdrawjs/react';

export async function captureBoardThumbnail(editor: Editor): Promise<string | null> {
  try {
    const blob = await editor.exportImage({ background: true, scale: 1, margin: 32 });
    if (!blob) return null;

    const bitmap = await createImageBitmap(blob);
    const maxW = 320;
    const maxH = 180;
    const scale = Math.min(maxW / bitmap.width, maxH / bitmap.height, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return null;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    if (!dataUrl.startsWith('data:image/jpeg') || dataUrl.length > 350_000) return null;
    return dataUrl;
  } catch {
    return null;
  }
}
