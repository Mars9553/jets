import { useState } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { NoticeItem } from '@/lib/api';

export type DownloadFormat = 'pdf' | 'image';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectUrlFormat(url: string): 'pdf' | 'image' | 'unknown' {
  const path = url.split('?')[0].toLowerCase();
  if (path.endsWith('.pdf')) return 'pdf';
  if (
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.webp')
  )
    return 'image';
  return 'unknown';
}

function toSafeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
}

function getFormatMeta(format: DownloadFormat) {
  if (format === 'pdf') {
    return { ext: 'pdf', mime: 'application/pdf', uti: 'com.adobe.pdf' };
  }
  return { ext: 'png', mime: 'image/png', uti: 'public.png' };
}

// ─── URL resolution ───────────────────────────────────────────────────────────

function resolveUrl(notice: NoticeItem, format: DownloadFormat): string | null {
  if (format === 'pdf' && notice.pdfUrl) return notice.pdfUrl;
  if (format === 'image' && notice.imageUrl) return notice.imageUrl;
  if (notice.fileUrl) return notice.fileUrl;
  return null;
}

// ─── Available formats ────────────────────────────────────────────────────────

export interface AvailableFormats {
  pdf: boolean;
  image: boolean;
  pdfRequiresConversion: boolean;
}

export function getAvailableFormats(notice: NoticeItem): AvailableFormats {
  if (notice.pdfUrl || notice.imageUrl) {
    return {
      pdf: !!notice.pdfUrl,
      image: !!notice.imageUrl,
      pdfRequiresConversion: false,
    };
  }

  if (notice.fileUrl) {
    const detected = detectUrlFormat(notice.fileUrl);
    if (detected === 'pdf') {
      return { pdf: true, image: false, pdfRequiresConversion: false };
    }
    if (detected === 'image') {
      return { pdf: true, image: true, pdfRequiresConversion: true };
    }
    // Unknown extension — treat as downloadable
    return { pdf: true, image: false, pdfRequiresConversion: false };
  }

  return { pdf: false, image: false, pdfRequiresConversion: false };
}

// ─── Image → PDF conversion (native only) ─────────────────────────────────────

async function convertImageFileToPdf(
  imageUri: string,
  notice: NoticeItem,
): Promise<string> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, Helvetica, Arial, sans-serif;
            padding: 32px 40px;
            color: #1e293b;
            background: #fff;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .badge {
            display: inline-block;
            padding: 3px 10px;
            background: #dbeafe;
            color: #1d4ed8;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .date { font-size: 12px; color: #94a3b8; }
          .title {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 8px;
            line-height: 1.35;
          }
          .description {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .image-wrapper { width: 100%; margin: 20px 0; text-align: center; }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">${notice.category}</span>
          <span class="date">${notice.date}</span>
        </div>
        <h1 class="title">${notice.title}</h1>
        <p class="description">${notice.description}</p>
        <div class="image-wrapper">
          <img src="${imageUri}" alt="Notice attachment" />
        </div>
        <div class="footer">Generated from notice attachment</div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
}

// ─── Web download ─────────────────────────────────────────────────────────────

/**
 * On web, expo-file-system is a stub. We use browser APIs instead.
 * For PDF: open in a new tab (browser handles viewing/saving).
 * For image: trigger a fetch → blob → <a download> flow.
 */
async function downloadOnWeb(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: just open the URL in a new tab
    window.open(url, '_blank');
  }
}

// ─── Native download ──────────────────────────────────────────────────────────

async function downloadOnNative(
  remoteUrl: string,
  filename: string,
  mime: string,
  uti: string,
): Promise<void> {
  // Lazy-import expo-file-system to avoid web bundling issues
  const { File, Paths } = await import('expo-file-system');
  const localFile = new File(Paths.cache, filename);
  // @ts-ignore — static method lives on FileSystemFile, inherited by File
  await (File as any).downloadFileAsync(remoteUrl, localFile);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(localFile.uri, {
      mimeType: mime,
      dialogTitle: `Save file`,
      UTI: uti,
    });
  } else {
    // Fallback: open via system browser/viewer
    await Linking.openURL(localFile.uri);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

import { useToast } from '@/context/ToastContext';

export interface UseNoticeDownloadReturn {
  downloading: boolean;
  downloadNotice: (notice: NoticeItem, format: DownloadFormat) => Promise<void>;
  promptDownload: (notice: NoticeItem) => void;
}

export function useNoticeDownload(): UseNoticeDownloadReturn {
  const [downloading, setDownloading] = useState(false);
  const { showToast } = useToast();

  const downloadNotice = async (
    notice: NoticeItem,
    format: DownloadFormat,
  ): Promise<void> => {
    if (downloading) return;
    setDownloading(true);

    try {
      const remoteUrl = resolveUrl(notice, format);
      console.log('[useNoticeDownload] remoteUrl:', remoteUrl, 'format:', format);

      if (!remoteUrl) {
        showToast(`This notice does not have a ${format === 'pdf' ? 'PDF' : 'image'} attachment.`, 'error');
        return;
      }

      const { ext, mime, uti } = getFormatMeta(format);
      const baseFilename = toSafeFilename(notice.title);
      const sourceFormat = detectUrlFormat(remoteUrl);

      // ── Web ────────────────────────────────────────────────────────────────
      if (Platform.OS === 'web') {
        const filename = `${baseFilename}.${ext}`;
        if (format === 'pdf' && sourceFormat === 'image') {
          // On web: open image directly (PDF conversion requires native renderer)
          Alert.alert(
            'Web limitation',
            'PDF conversion from images is only supported on the mobile app. The image will open instead.',
            [{ text: 'Open image', onPress: () => window.open(remoteUrl, '_blank') }, { text: 'Cancel', style: 'cancel' }],
          );
        } else {
          await downloadOnWeb(remoteUrl, filename);
          showToast('Download started', 'success');
        }
        return;
      }

      // ── Native: image → PDF conversion ────────────────────────────────────
      if (format === 'pdf' && sourceFormat === 'image') {
        const { File, Paths } = await import('expo-file-system');
        const imageFilename = `notice_${baseFilename}_src.${remoteUrl.split('?')[0].split('.').pop() ?? 'png'}`;
        const imageFile = new File(Paths.cache, imageFilename);
        // @ts-ignore
        await (File as any).downloadFileAsync(remoteUrl, imageFile);

        const pdfUri = await convertImageFileToPdf(imageFile.uri, notice);

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(pdfUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Save "${notice.title}" as PDF`,
            UTI: 'com.adobe.pdf',
          });
        } else {
          await Linking.openURL(pdfUri);
        }
        showToast('PDF file ready', 'success');
        return;
      }

      // ── Native: direct download ────────────────────────────────────────────
      const filename = `notice_${baseFilename}.${ext}`;
      await downloadOnNative(remoteUrl, filename, mime, uti);
      showToast('File ready for sharing', 'success');
    } catch (err: any) {
      console.error('[useNoticeDownload] error:', err);
      showToast(err?.message ?? 'Something went wrong. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const promptDownload = (notice: NoticeItem) => {
    console.log('[useNoticeDownload] notice fileUrl:', notice.fileUrl, 'pdfUrl:', notice.pdfUrl, 'imageUrl:', notice.imageUrl);

    const { pdf, image, pdfRequiresConversion } = getAvailableFormats(notice);

    if (!pdf && !image) {
      showToast('This notice has no downloadable file.', 'error');
      return;
    }

    if (pdf && image) {
      const pdfLabel = pdfRequiresConversion
        ? '📄 PDF (convert from image)'
        : '📄 PDF';

      Alert.alert(
        'Download as',
        pdfRequiresConversion
          ? 'The original file is an image. It can be downloaded as-is or converted to a PDF.'
          : 'Choose a format to download this notice.',
        [
          { text: pdfLabel, onPress: () => downloadNotice(notice, 'pdf') },
          { text: '🖼️ Image', onPress: () => downloadNotice(notice, 'image') },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else if (pdf) {
      downloadNotice(notice, 'pdf');
    } else {
      downloadNotice(notice, 'image');
    }
  };

  return { downloading, downloadNotice, promptDownload };
}

