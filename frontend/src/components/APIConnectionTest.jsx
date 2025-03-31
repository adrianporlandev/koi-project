"use client"

import { useState, useEffect } from "react"
import { testAPIConnection } from "../lib/api"

export default function APIConnectionTest() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    // Obtener la URL de la API que se está utilizando
    const url = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api"
    setApiUrl(url)
  }, [])

  const runTest = async () => {
    setLoading(true)
    try {
      const result = await testAPIConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error al ejecutar la prueba",
        details: error.toString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnóstico de Conexión API</h2>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">URL de la API configurada:</p>
        <code className="bg-gray-100 px-2 py-1 rounded text-purple-700">{apiUrl}</code>
      </div>

      <button
        onClick={runTest}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Probando conexión..." : "Probar conexión con la API"}
      </button>

      {testResult && (
        <div className={`mt-6 p-4 rounded ${testResult.success ? "bg-green-100" : "bg-red-100"}`}>
          <h3 className={`font-bold ${testResult.success ? "text-green-800" : "text-red-800"}`}>
            {testResult.success ? "✅ Conexión exitosa" : "❌ Error de conexión"}
          </h3>
          <p className="mt-2">{testResult.message}</p>

          {testResult.details && (
            <div className="mt-4">
              <p className="font-semibold">Detalles:</p>
              <pre className="bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm">
                {typeof testResult.details === "object"
                  ? JSON.stringify(testResult.details, null, 2)
                  : testResult.details}
              </pre>
            </div>
          )}

          {testResult.data && (
            <div className="mt-4">
              <p className="font-semibold">Datos recibidos:</p>
              <pre className="bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold text-gray-800 mb-2">Soluciones comunes:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Verifica que la API esté ejecutándose en la URL correcta</li>
          <li>Asegúrate de que no haya problemas de CORS en el backend</li>
          <li>Comprueba que los endpoints de la API coincidan con los que espera el frontend</li>
          <li>Verifica que no haya firewalls o proxies bloqueando las conexiones</li>
          <li>
            <strong>Nombre de tabla correcto:</strong> La API está configurada para usar la tabla "stats"
          </li>
        </ul>
      </div>
    </div>
  )
}

