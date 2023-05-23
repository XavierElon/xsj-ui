'use client'
import { useContext, useEffect, useState } from 'react'
import { AuthStateContext } from '@/context/AuthContext'
import { ChatStateContext } from '@/context/ChatContext'
import { addMessageToConversation, createConversation } from '@/firebase/chat.firebase'
import { useAuthorization } from '@/hooks/useAuthorization'

const SendMessage = () => {
  const [value, setValue] = useState('')
  const [conversationSelected, setConversationSelected] = useState<boolean>(false)
  const { authState } = useContext(AuthStateContext)
  let { id } = authState
  const authorized = useAuthorization()
  const { secondUserID, currentConversationID, chatGPTConversation } = useContext(ChatStateContext)

  useEffect(() => {
    if (currentConversationID) {
      setConversationSelected(true)
    }
  }, [currentConversationID])

  const handleSendMessage = async (e: any) => {
    // id = sessionStorage.getItem('id')!
    e.preventDefault()
    if (!currentConversationID) {
      await createConversation(id, secondUserID, value)
    } else if (currentConversationID) {
      await addMessageToConversation(currentConversationID, id, value)
    }
    setValue('')
  }

  return (
    <div className="bg-gray-200 w-full py-6 shadow-lg">
      <form className="px-2 containerWrap flex">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input w-full focus:outline-none bg-gray-100 rounded-r-none"
          type="text"
        />
        <button
          type="submit"
          onClick={handleSendMessage}
          className={`w-auto btn text-white rounded-r-lg text-sm ${conversationSelected ? 'btn-primary' : 'bg-gray-500 cursor-not-allowed'}`}
          disabled={!conversationSelected}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default SendMessage
