export interface BaseModel {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type PictureFromS3 = {
  url: string;
  thumb: {
    url: string;
  };
}
