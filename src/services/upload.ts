export async function uploadImageToS3(file: File): Promise<string> {
  const response = await fetch("/api/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la URL de subida");
  }

  const { presignedUrl, publicUrl } = await response.json();

  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("No se pudo subir la imagen a S3");
  }

  return publicUrl;
}