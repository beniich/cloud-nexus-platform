import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, Phone, Video, MoreVertical, Search, ArrowLeft, Check, CheckCheck, FileText, Download, Users, Settings, Bell, X, MessageCircle } from 'lucide-react';

const ProfessionalChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'Admin Support',
            role: 'admin',
            text: 'Bonjour! Comment puis-je vous assister aujourd\'hui?',
            timestamp: new Date(Date.now() - 3600000),
            status: 'read',
            type: 'text'
        },
        {
            id: 2,
            sender: 'Moi',
            role: 'client',
            text: 'J\'ai besoin d\'informations sur ma commande',
            timestamp: new Date(Date.now() - 3500000),
            status: 'read',
            type: 'text',
            isMine: true
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedContact, setSelectedContact] = useState({
        name: 'Équipe Support',
        role: 'admin',
        online: true,
        lastSeen: 'En ligne'
    });
    const [contacts] = useState([
        { id: 1, name: 'Équipe Support', role: 'admin', online: true, unread: 2, lastMsg: 'Comment puis-je vous assister?', time: '14:30' },
        { id: 2, name: 'Service Commercial', role: 'vendeur', online: true, unread: 0, lastMsg: 'Votre commande est prête', time: '13:15' },
        { id: 3, name: 'Assistance Client', role: 'admin', online: false, unread: 0, lastMsg: 'Merci pour votre retour', time: 'Hier' }
    ]);
    const [showContacts, setShowContacts] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emojis = ['😊', '👍', '✅', '❤️', '🎉', '💼', '📊', '🚀', '💡', '⭐'];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputMessage.trim() && !isRecording) return;

        const newMessage = {
            id: Date.now(),
            sender: 'Moi',
            role: 'client',
            text: isRecording ? '🎤 Message vocal' : inputMessage,
            timestamp: new Date(),
            status: 'sent',
            type: isRecording ? 'audio' : 'text',
            isMine: true
        };

        // @ts-expect-error - newMessage has additional properties not in base type
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsRecording(false);

        setTimeout(() => {
            // @ts-expect-error - status property update
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
            ));
        }, 1000);

        setTimeout(() => {
            // @ts-expect-error - status property update
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
            ));
        }, 2000);

        setTimeout(() => {
            setIsTyping(true);
        }, 2500);

        setTimeout(() => {
            setIsTyping(false);
            // @ts-expect-error - admin message has different shape
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'Admin Support',
                role: 'admin',
                text: 'Je traite votre demande immédiatement.',
                timestamp: new Date(),
                status: 'read',
                type: 'text'
            }]);
        }, 4000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileType = file.type.startsWith('image/') ? 'image' : 'file';
        const newMessage = {
            id: Date.now(),
            sender: 'Moi',
            role: 'client',
            text: file.name,
            timestamp: new Date(),
            status: 'sent',
            type: fileType,
            isMine: true,
            fileUrl: URL.createObjectURL(file)
        };

        // @ts-expect-error - file message has additional properties
        setMessages(prev => [...prev, newMessage]);
    };

    const addEmoji = (emoji: string) => {
        setInputMessage(prev => prev + emoji);
        setShowEmoji(false);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return <Check className="w-3.5 h-3.5 text-gray-400" />;
            case 'delivered':
                return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
            case 'read':
                return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
            default:
                return null;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return { label: 'Admin', color: 'from-red-500 to-red-600' };
            case 'vendeur': return { label: 'Commercial', color: 'from-blue-500 to-blue-600' };
            case 'client': return { label: 'Client', color: 'from-gray-500 to-gray-600' };
            default: return { label: role, color: 'from-gray-500 to-gray-600' };
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
            >
                <MessageCircle className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold items-center justify-center">2</span>
                </span>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat Support
                </div>
            </button>
        );
    }

    // Widget Container Style
    const widgetStyle = "fixed bottom-24 right-6 w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-700 animate-in slide-in-from-bottom-10 fade-in duration-300";

    if (showContacts) {
        return (
            <div className={widgetStyle}>
                {/* Header Contacts */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">Messages</h1>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-300" />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Liste des contacts */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => {
                        const badge = getRoleBadge(contact.role);
                        return (
                            <div
                                key={contact.id}
                                onClick={() => {
                                    setSelectedContact({
                                        name: contact.name,
                                        role: contact.role,
                                        online: contact.online,
                                        lastSeen: contact.online ? 'En ligne' : 'Hors ligne'
                                    });
                                    setShowContacts(false);
                                }}
                                className="flex items-center gap-3 p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-all group"
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform`}>
                                        {contact.name[0]}
                                    </div>
                                    {contact.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-white truncate text-sm">{contact.name}</h3>
                                        <span className="text-xs text-gray-400 ml-2">{contact.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400 truncate">{contact.lastMsg}</p>
                                        {contact.unread > 0 && (
                                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 ml-2 font-medium shadow-lg min-w-[1.25rem] text-center">
                                                {contact.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const selectedBadge = getRoleBadge(selectedContact.role);

    return (
        <div className={widgetStyle}>
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-3 shadow-xl flex-shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowContacts(true)}
                        className="hover:bg-gray-700 rounded-lg p-2 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                    <div className="relative">
                        <div className={`w-10 h-10 bg-gradient-to-br ${selectedBadge.color} rounded-xl flex items-center justify-center font-bold text-white shadow-lg`}>
                            {selectedContact.name[0]}
                        </div>
                        {selectedContact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate text-sm">{selectedContact.name}</h3>
                        <p className="text-xs text-gray-400">{selectedContact.lastSeen}</p>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => setIsOpen(false)} className="hover:bg-red-500/20 hover:text-red-400 rounded-lg p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/95">
                {messages.map((msg) => {
                    const isMine = msg.isMine;
                    const senderBadge = getRoleBadge(msg.role);

                    return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl shadow-lg text-sm ${isMine
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                                : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700'
                                }`}>
                                {msg.type === 'image' && (
                                    <div className="p-1">
                                        {/* @ts-expect-error - fileUrl may not exist on all message types */}
                                        <img src={msg.fileUrl} alt={msg.text} className="rounded-xl max-w-full" />
                                    </div>
                                )}
                                {msg.type === 'file' && (
                                    <div className="p-3 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isMine ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{msg.text}</p>
                                            <p className="text-xs opacity-70">Document</p>
                                        </div>
                                        <Download className="w-4 h-4 opacity-70" />
                                    </div>
                                )}
                                {(msg.type === 'text' || msg.type === 'audio') && (
                                    <div className="px-3 py-2">
                                        {!isMine && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r ${senderBadge.color}`}>
                                                    {senderBadge.label}
                                                </span>
                                                <span className="text-[10px] opacity-70">{msg.sender}</span>
                                            </div>
                                        )}
                                        <p className="leading-relaxed">{msg.text}</p>
                                    </div>
                                )}
                                <div className={`px-3 pb-1.5 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                    <span>{formatTime(msg.timestamp)}</span>
                                    {isMine && getStatusIcon(msg.status)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmoji && (
                <div className="bg-gray-800 border-t border-gray-700 p-3 shadow-2xl z-20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-300">Émojis</span>
                        <button onClick={() => setShowEmoji(false)} className="text-gray-400 hover:text-white">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {emojis.map((emoji, idx) => (
                            <button
                                key={idx}
                                onClick={() => addEmoji(emoji)}
                                className="text-xl hover:bg-gray-700 rounded p-1 transition-all hover:scale-110"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 p-3 shadow-2xl flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                    >
                        <Smile className="w-5 h-5" />
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {!isRecording ? (
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(e);
                                }
                            }}
                            placeholder="Message..."
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    ) : (
                        <div className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-400 font-medium">Recording...</span>
                        </div>
                    )}

                    {inputMessage.trim() ? (
                        <button
                            onClick={sendMessage}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setIsRecording(!isRecording);
                                if (isRecording) sendMessage();
                            }}
                            className={`${isRecording
                                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/50'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/50'
                                } text-white p-2 rounded-lg transition-all shadow-lg hover:scale-105`}
                        >
                            {isRecording ? <Check className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalChat;
