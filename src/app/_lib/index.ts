import {PictureFromS3} from "@/app/_types/base";

export function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text

  return text.slice(0, max).split(" ").slice(0, -1).join(" ") + "..."
}

export function isPictureFromS3(image: PictureFromS3 | File | undefined): image is PictureFromS3 {
  return !!image && 'thumb' in image;
}