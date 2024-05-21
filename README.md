# use-confirm-hook

Customize the browser's `window.confirm` with a _React Component_ of your own.

This module is released as a TypeScript module, make sure your bundler supports them.

Tested with [vite](https://vitejs.dev/) and [bun](https://bun.sh/).

https://github.com/wallpants/use-confirm-hook/assets/47203170/203b7e0e-ce96-4550-9ced-ac0ee14cb6d0

## Install

```bash
bun add use-confirm-hook
```

## Usage

Create your custom confirm component:

```tsx
// confirm-dialog.tsx
import { useConfirm } from "use-confirm-hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export const ConfirmDialog = () => {
  const { isAsking, message, deny, confirm } = useConfirm();

  return (
    <AlertDialog open={isAsking} onOpenChange={deny}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={deny}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

At the very root of your React App add the _Provider_ and your _React Component_.

```tsx
import { UseConfirmProvider } from "use-confirm-hook";
import { ConfirmDialog } from "./confirm-dialog";
import { App } from "./app";

export default function Root() {
  return (
    <UseConfirmProvider>
      <App />
      <ConfirmDialog />
    </UseConfirmProvider>
  );
}
```

Ask the user to confirm an action:

```tsx
import { useConfirm } from "use-confirm-hook";

export default function Component() {
  const { ask } = useConfirm();

  function handleDelete() {
    const res = await ask("Are you sure?");
    if (res) {
      console.log("continue with deletion");
    } else {
      console.log("don't delete");
    }
  }

  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## Credits

This project is a simplified version of [https://github.com/tsivinsky/use-confirm](https://github.com/tsivinsky/use-confirm).
