interface Message {
    type?: 'error' | 'warning' | 'info' | 'success'
    message: string
}

export function error(message: string) {}
export function warning(message: string) {}
export function info(message: string) {}
export function success(message: string) {}

export default function message(params: Message | string) {
    if (typeof params != 'object') params = { message: params, type: 'info' }
    switch (params.type) {
        case 'error':
            error(params.message)
            break
        case 'warning':
            warning(params.message)
            break
        case 'success':
            success(params.message)
            break
        case 'info':
        default:
            info(params.message)
            break
    }
}
message.error = error
message.warning = warning
message.info = info
message.success = success
