'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

type Message = {
  id: number
  text: string
  sender: 'user' | 'assistant'
}

const API_URL = 'https://uwvchatbot-f850ea49bdeb.herokuapp.com'

export default function Component() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    if (!isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      startConversation()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const startConversation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/start-conversation`, {
        method: 'POST',
      })
      const data = await response.json()
      setMessages([{ id: Date.now(), text: data.message, sender: 'assistant' }])
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: 'user' }
      setMessages(prev => [...prev, newMessage])
      setInput('')
      
      try {
        const response = await fetch(`${API_URL}/api/send-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        })
        const data = await response.json()
        const assistantMessage: Message = { id: Date.now() + 1, text: data.response, sender: 'assistant' }
        setMessages(prev => [...prev, assistantMessage])
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearMemory = async () => {
    try {
      await fetch(`${API_URL}/api/clear-memory`, {
        method: 'POST',
      })
      setMessages([])
      startConversation()
    } catch (error) {
      console.error('Error clearing memory:', error)
    }
  }


  useEffect(() => {
    const messagesContainer = document.querySelector('.overflow-y-auto');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <header className="border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">Overheid Assistent</div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">Over ons</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={toggleDarkMode} aria-label="Schakel donkere modus">
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" className="md:hidden" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Welkom bij de Overheid Assistent</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Krijg direct antwoord op al uw vragen over overheidsdiensten. 
                Onze AI-assistent staat 24/7 voor u klaar.
              </p>
              <Button onClick={toggleChat} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full">
                Start een gesprek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
            >
              <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[80vh] rounded-lg shadow-lg flex flex-col">
                <div className="p-4 sm:p-6 border-b dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold dark:text-white">Chat met Overheid Assistent</h2>
                  <Button variant="ghost" onClick={toggleChat} className="p-2" aria-label="Sluit chat">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        <MarkdownRenderer markdown={message.text} />
                      </span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 sm:p-6 border-t dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Input 
                      ref={inputRef}
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Typ uw vraag hier..."
                      className="flex-grow dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-3 py-2"
                      aria-label="Chat input"
                    />
                    <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2" aria-label="Verstuur bericht">
                      Verstuur
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Waarom de Overheid Assistent gebruiken?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 inline-block mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Direct antwoord</h3>
                <p className="text-gray-600 dark:text-gray-300">Krijg meteen antwoord op al uw vragen over overheidsdiensten.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 inline-block mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">24/7 beschikbaar</h3>
                <p className="text-gray-600 dark:text-gray-300">Onze AI-assistent staat dag en nacht voor u klaar om u te helpen.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 inline-block mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Betrouwbare informatie</h3>
                <p className="text-gray-600 dark:text-gray-300">Ontvang accurate en up-to-date informatie over alle overheidsdiensten.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Over ons</h3>
              <p className="text-gray-400 dark:text-gray-300">
                De Overheid Assistent is een innovatief platform dat burgers helpt 
                bij het navigeren door overheidsdiensten en -informatie.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Snelle links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white">Over ons</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white">Veelgestelde vragen</a></li>
                <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 dark:text-gray-300">
                Email: info@overheidassistent.nl<br />
                Tel: 0800-1234567<br />
                Adres: Hoofdstraat 1, 1234 AB Amsterdam
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-700 text-center text-gray-400 dark:text-gray-300">
            <p>&copy; 2023 Overheid Assistent. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>
}