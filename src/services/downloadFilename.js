export function getDownloadFilename(headers, fallback) {
  const disposition = headers?.['content-disposition'] || '';
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}
