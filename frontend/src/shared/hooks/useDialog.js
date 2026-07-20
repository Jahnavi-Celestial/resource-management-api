import { useCallback, useState } from "react"


export const useDialog = (initialState = false) =>{
    const [isOpen, setIsOpen] = useState(initialState)
    const [dialogData, setDialogData] = useState(null)

    const openDialog = useCallback((data = null) => {
        if(data){
            setDialogData(data)
        }
        setIsOpen(true)
    }, [])

    const closeDialog = useCallback(() => {
        setIsOpen(false)
        setDialogData(null)
    }, [])

  return { isOpen, dialogData, openDialog, closeDialog }
}