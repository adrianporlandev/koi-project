"use client"

import { useState, useEffect } from "react"
import { checkAPIStatus } from "../lib/api"

export default function APIStatus() {
  const [status, setStatus] = useState({ checking: true })

  useEffect(() => {
    async function checkStatus() {
      try {
        const apiStatus = await checkAPIStatus()
        setStatus({ ...apiStatus, checking: false })
      } catch (error) {
        setStatus({
          online: false,
          message: `Error al verificar estado: ${error.message}`,
          checking: false,
        })
      }
    }

    checkStatus()

    // Verificar cada 30 segundos
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status.checking) {
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Verificando API...
      </div>
    )
  }

  return (
    <div className={`flex items-center text-sm ${status.online ? "text-green-600" : "text-red-600"}`}>
      <div className={`h-2 w-2 rounded-full mr-2 ${status.online ? "bg-green-600" : "bg-red-600"}`}></div>
      {status.message}
    </div>
  )
}

