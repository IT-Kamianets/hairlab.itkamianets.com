export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
export async function validatePhoto(file) {
  if (!file) throw new Error('Choose a photo first.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPEG, PNG, or WebP photo.');
  if (file.size > MAX_PHOTO_SIZE) throw new Error('Choose a photo smaller than 5 MB.');
  const url = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => img.width && img.height ? resolve() : reject(new Error('This photo is empty.'));
      img.onerror = () => reject(new Error('This file could not be read as an image.'));
      img.src = url;
    });
  } finally { URL.revokeObjectURL(url); }
  return file;
}
// Original local vector illustrations, not photographs or generated try-on results.
export function portrait(look, color, className = '') {
  const hair = color?.hex || '#694535';
  const shapes = {
    bob: '<path d="M65 218Q40 120 78 68Q101 31 150 38Q215 32 235 100L238 224Q207 249 182 224L180 117L114 106L112 229Q82 244 65 218Z"/>',
    waves: '<path d="M56 271Q32 241 54 212Q31 181 57 154Q35 107 71 65Q102 25 151 34Q208 22 233 72Q257 105 240 148Q269 177 245 208Q269 249 238 280L186 278L185 103L111 103L112 281Z"/>',
    curly: '<path d="M53 228Q22 210 43 181Q15 154 45 131Q22 100 57 85Q40 48 80 46Q87 13 120 30Q149 5 172 29Q206 13 219 48Q257 45 251 81Q280 102 254 130Q283 159 256 181Q276 218 244 239L190 243L184 103L109 102L109 241Z"/>',
    coily: '<path d="M41 212Q5 184 27 158Q3 128 29 102Q14 66 52 57Q49 21 91 28Q108 0 139 17Q172 -1 194 25Q232 8 246 45Q284 49 274 82Q303 108 278 139Q302 173 271 197Q281 234 241 242L190 240L110 241Q65 252 41 212Z"/>',
    pixie: '<path d="M73 139Q46 98 76 64Q103 26 157 33Q210 19 231 64Q250 100 221 142L186 113L109 111Z"/>',
  };
  return `<svg class="portrait ${className}" viewBox="0 0 300 340" role="img" aria-label="Illustration of ${look.name}"><ellipse cx="150" cy="328" rx="111" ry="12" fill="#19171B" opacity=".06"/><path d="M42 340L53 289Q69 255 117 252L183 252Q232 255 248 289L260 340" fill="#F1E7DF"/><g fill="${hair}">${shapes[look.shape]}</g><path d="M126 214L124 259Q149 281 176 259L172 213" fill="#C98E72"/><ellipse cx="150" cy="153" rx="53" ry="77" fill="#E2AD8D"/><path d="M96 131Q81 91 112 64Q150 47 183 65Q212 84 204 127Q183 112 168 82Q146 119 96 131" fill="${hair}"/><path d="M116 151q10 -5 19 0m31 0q10 -5 19 0" fill="none" stroke="#604036" stroke-width="2.5" stroke-linecap="round"/><path d="M150 156l-4 23h9m-20 17q15 9 30 0" fill="none" stroke="#A36655" stroke-width="2.5" stroke-linecap="round"/><circle cx="99" cy="182" r="5" fill="#D6AD6A"/><circle cx="201" cy="182" r="5" fill="#D6AD6A"/><path d="M104 272L150 302L196 272" fill="none" stroke="#D6CBC4" stroke-width="2"/></svg>`;
}
