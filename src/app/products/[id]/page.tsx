import ProductForm from '@/components/ProductForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  return <ProductForm mode="edit" productId={productId} />;
}
