'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/constants'

export default function WhatsAppCTA() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="glass rounded-2xl p-5 max-w-xs"
              >
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-3 right-3 text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
                <p className="text-white font-semibold text-sm mb-1">Fale conosco</p>
                <p className="text-white/50 text-xs mb-4">Atendimento personalizado para você encontrar o veículo perfeito.</p>
                <a
                  href={getWhatsAppLink('Olá! Gostaria de conhecer os veículos disponíveis.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors w-full justify-center"
                >
                  <MessageCircle size={14} />
                  Iniciar conversa
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-900/40 transition-colors"
          >
            <MessageCircle size={24} className="text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
