import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    const sizeMap = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
