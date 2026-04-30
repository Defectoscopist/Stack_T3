import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  redirect(`/category/men/${slug}`);
}
