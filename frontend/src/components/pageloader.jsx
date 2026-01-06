import React from 'react'
import {LoaderIcon} from "lucide-react";
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#fffaf0]">
      <LoaderIcon className="animate-spin size-20 text-[#8b7355]" />
    </div>
  )
}

export default PageLoader
