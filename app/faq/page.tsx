import React from 'react'
import Link from 'next/link'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Veelgestelde vragen</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">FAQ Inhoud</h2>
              <p className="dark:text-gray-300">Hier kunt u de veelgestelde vragen en antwoorden toevoegen.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                Terug naar home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}