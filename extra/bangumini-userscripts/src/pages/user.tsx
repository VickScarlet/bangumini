import React from "react"
import {createRoot} from 'react-dom/client'
import ProgressActivity from '@/components/ProgressActivity'

export function progressActivity(user: string) {
    const element = document.createElement('div')
    document.querySelector('#user_home .user_box')!.prepend(element)
    createRoot(element).render(<React.StrictMode><ProgressActivity user={user} /></React.StrictMode>)
}

export function formerName(user: string) {}

export default function (user: string) {
    progressActivity(user)
    formerName(user)
}
