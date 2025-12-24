import React from 'react'
import {LoaderIcon} from "lucide-react";
function PageLoader() {
  return (
    <div className = "flex items-centre justify-center h-screen">
      <LoaderIcon className ="animate-spin size-10" />
    </div>
  )
}

export default PageLoader
