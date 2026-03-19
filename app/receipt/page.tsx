import { Suspense } from "react"
import ReceiptContent from "./receipt-content"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center italic">Loading...</div>}>
      <ReceiptContent />
    </Suspense>
  )
}