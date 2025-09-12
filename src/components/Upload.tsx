import axios from 'axios';
import { type ChangeEvent, type FormEvent, useState } from 'react';

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (file) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/media/presigned-url`, //?filename=${file.name}&mimetype=${file.type}`,
          {
            filename: file.name,
            contentType: file.type,
            fileSize: file.size,
            uploadType: 'general_image',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJmZjc2YTA5NDJkYjg0YWNiNTIwZjciLCJlbWFpbCI6ImZpbnp5cGhpbnp5QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3NjEzMzA1LCJleHAiOjE3NTc2MTQyMDUsImF1ZCI6InNhZmVndWFyZC1tZWRpYS11c2VycyIsImlzcyI6InNhZmVndWFyZC1tZWRpYSJ9.pXIwzdt4me5rgADuPovrylwRCxqvnZWapC_LTUTYqmU',
            },
          }
        );

        console.log('this is response', response.data);

        const { data } = response.data;

        console.log(data);

        const { uploadUrl } = data.upload;

        if (data.upload.uploadUrl) {
          const result = await axios.put(
            uploadUrl,
            { file },
            { headers: { 'Content-Type': encodeURI(file.type) } }
          );

          console.log('this is result', result);

          if (result.status === 200) {
            setUploadStatus('Upload successful!');
          } else {
            setUploadStatus('Upload failed.');
          }
        } else {
          setUploadStatus('Error during file upload');
        }
      } catch (error) {
        console.error(error);
        setUploadStatus('Error occured during upload.');
      }
    }
  };

  return (
    <>
      <h1 className="text-xl my-4">Please select file to upload</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/jpeg,image/png"
          name="file"
          className=""
          onChange={handleFileChange}
        />
        {file && (
          <button type="submit" className="bg-black text-white px-4 py-2">
            Upload
          </button>
        )}{' '}
        {uploadStatus && <p className="text-blue-800">{uploadStatus}</p>}
      </form>
    </>
  );
}
