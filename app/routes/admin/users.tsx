import { FileUpload } from "@/components/file-upload";




export default function Users() {
  return (
    <div>
      <h1>Users</h1>
      <FileUpload onUploadSuccess={(key) => {
        console.log(key);
      }} />
    </div>
  );
}