export async function uploadReceipt(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64, fileName: file.name })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  if (!data.url || typeof data.url !== "string") {
    throw new Error("Invalid upload response");
  }

  return data.url as string;
}
