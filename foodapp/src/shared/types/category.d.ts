export type SingleCategoryProps = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  createdAt: string;
};


export type CategoryDeleteProps = {
  categoryId:number;
  image_public_id:string;
}