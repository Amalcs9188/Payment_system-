import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type CommonAlertDialogProps = {
  setCancel?: (value: boolean) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  deleteData: () => void;
}
export function CommonAlertDialog({open,setOpen,deleteData}: CommonAlertDialogProps) {

  const handeleDelete=() =>{
    deleteData()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will be permanently deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {setOpen(false)}}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {handeleDelete()}}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
