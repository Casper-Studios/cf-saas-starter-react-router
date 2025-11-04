import { uploadToR2 } from "@/repositories/bucket";
import type { Route } from "./+types/upload-file";

export async function action({ request, context }: Route.ActionArgs) {
  const bucket = context.cloudflare.env.BUCKET;

  if (!bucket) {
    throw new Response("R2 bucket not configured", { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    throw new Response("No file provided", { status: 400 });
  }

  try {
    const key = await uploadToR2(bucket, file);
    return { success: true, key };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Response(
      error instanceof Error ? error.message : "Upload failed",
      { status: 500 }
    );
  }
}
