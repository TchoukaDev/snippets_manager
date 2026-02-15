import { useId } from 'react'

import { Input } from '@/components/ui/input'

interface InputFileDemoProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

}

const InputFileDemo = ({ onChange }: InputFileDemoProps) => {
    const id = useId()

    return (
        <div className='w-full max-w-xs space-y-2'>
            <Input
                id={id}
                onChange={onChange}
                type='file'
                className='text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic'
            />
        </div>
    )
}

export default InputFileDemo
