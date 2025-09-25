import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ErrorMessage = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)


export default ErrorMessage;
