import { LOG_API_URL, SECRET } from './config'
import {LogStack,LogLevel,LogPackage} from './type'



export async function Log(stack: LogStack, level: LogLevel, pkg: LogPackage, message: string): Promise<void> {
    // 
    try {
        const res = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET}`
            },
            body: JSON.stringify({ stack, level, pkg, message }),
        })

        if (res.ok) {
            console.log('Message logged successfully');
        }
        else {
            const errorBody: string = await res.text()
            console.log(`Failed: ${errorBody}`)
        }
    }
    catch (error) {
        console.error('Error logging message:', error);
    }
}
