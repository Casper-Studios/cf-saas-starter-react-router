import { type ActionFunctionArgs } from "react-router";
import { uploadToR2 } from "@/repositories/bucket";

export async function action({ request, context }: ActionFunctionArgs) {
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
    return Response.json({ success: true, key });
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Response(
      error instanceof Error ? error.message : "Upload failed",
      { status: 500 }
    );
  }
}
