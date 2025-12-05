import { getDocumentById } from "@/lib/getDocumentById"

interface DocumentViewPageProps {
  params: { id: string }
}

export default async function DocumentViewPage({ params }: DocumentViewPageProps) {
  const document = await getDocumentById(params.id)

  if (!document) {
    return <div>Document not found</div>
  }

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">{document.label}</h1>
        <p>Type: {document.type}</p>
        <p>Uploaded at: {new Date(document.uploadedAt).toLocaleString()}</p>
        {document.blockchainHash && <p>Blockchain hash: {document.blockchainHash}</p>}
        <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
        >
          Download
        </a>
      </div>
  )
}
