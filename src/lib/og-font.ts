export async function loadDisplayFont(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Black+Han+Sans&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Black Han Sans font url not found");
  return fetch(url).then((res) => res.arrayBuffer());
}

export const OG_SIZE = { width: 1200, height: 630 };
