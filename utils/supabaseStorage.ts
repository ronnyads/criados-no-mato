import { supabase } from '@/lib/supabase';

/**
 * Uploads a WebP blob to the Supabase store-assets bucket.
 * @param blob The Blob to upload.
 * @param fileName The desired filename (without extension usually, we append .webp).
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(blob: Blob, fileName: string): Promise<string> {
  const fileExt = 'webp';
  // Use a timestamp to prevent cache issues and collisions
  const uniqueName = `${fileName}-${Date.now()}.${fileExt}`;
  const filePath = `images/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from('store-assets')
    .upload(filePath, blob, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase Storage Upload Error:', error);
    throw new Error('Falha ao enviar imagem para a nuvem.');
  }

  // Obter URL pública
  const { data: publicUrlData } = supabase.storage
    .from('store-assets')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Deletes an image from the store-assets bucket given its public URL.
 * @param publicUrl The full public URL of the image to delete.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  if (!publicUrl.includes('/storage/v1/object/public/store-assets/')) return;
  
  try {
    const urlParts = publicUrl.split('/store-assets/');
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from('store-assets')
        .remove([filePath]);
        
      if (error) {
        console.warn('Falha ao deletar imagem do Supabase:', error);
      }
    }
  } catch (err) {
    console.error('Erro ao processar URL para deleção:', err);
  }
}
