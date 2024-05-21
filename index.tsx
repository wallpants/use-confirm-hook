import {
   createContext,
   useContext,
   useMemo,
   useState,
   type Dispatch,
   type ReactNode,
   type SetStateAction,
} from "react";

type ConfirmContext = {
   message?: ReactNode;
   setMessage: Dispatch<SetStateAction<ConfirmContext["message"]>>;
   resolve?: ((value: boolean) => void) | undefined;
   setResolve: Dispatch<SetStateAction<ConfirmContext["resolve"]>>;
};

const confirmContext = createContext<ConfirmContext | null>(null);

export function useConfirm() {
   const context = useContext(confirmContext);
   if (!context) throw Error("'useConfirm' use outside of Provider detected");
   const { message, setMessage, resolve, setResolve } = context;

   const isAsking = useMemo(() => message !== undefined, [message]);

   const ask = async (msg: ReactNode): Promise<boolean> => {
      return new Promise((resolve) => {
         setMessage(msg);
         setResolve(() => (value: boolean) => resolve(value));
      });
   };

   const confirm = () => {
      resolve?.(true);
      setMessage(undefined);
   };
   const deny = () => {
      resolve?.(false);
      setMessage(undefined);
   };

   return { message, isAsking, ask, confirm, deny };
}

export const UseConfirmProvider = ({ children }: { children: ReactNode }) => {
   const [message, setMessage] = useState<ConfirmContext["message"]>();
   const [resolve, setResolve] = useState<ConfirmContext["resolve"]>();

   return (
      <confirmContext.Provider
         value={{
            message,
            setMessage,
            resolve,
            setResolve,
         }}
      >
         {children}
      </confirmContext.Provider>
   );
};

