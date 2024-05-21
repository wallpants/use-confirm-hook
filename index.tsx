import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ConfirmContext = {
  isAsking: boolean;
  setIsAsking: Dispatch<SetStateAction<boolean>>;
  message?: ReactNode;
  setMessage: Dispatch<SetStateAction<ConfirmContext["message"]>>;
  resolve?: ((value: boolean) => void) | undefined;
  setResolve: Dispatch<SetStateAction<ConfirmContext["resolve"]>>;
};

const confirmContext = createContext<ConfirmContext | null>(null);

export function useConfirm() {
  const context = useContext(confirmContext);
  if (!context) throw Error("'useConfirm' use outside of Provider detected");
  const { message, setMessage, resolve, setResolve, setIsAsking, isAsking } =
    context;

  const ask = async (msg: ReactNode): Promise<boolean> => {
    return new Promise((resolve) => {
      setMessage(msg);
      setIsAsking(true);
      setResolve(() => (value: boolean) => resolve(value));
    });
  };

  const confirm = () => {
    resolve?.(true);
    setIsAsking(false);
  };
  const deny = () => {
    resolve?.(false);
    setIsAsking(false);
  };

  useEffect(() => {
    if (!isAsking) {
      // timeout to prevent the message from disappearing whilst modal is still up
      setTimeout(() => setMessage(undefined), 200);
    }
  }, [isAsking]);

  return { message, isAsking, ask, confirm, deny };
}

export const UseConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [isAsking, setIsAsking] = useState<ConfirmContext["isAsking"]>(false);
  const [message, setMessage] = useState<ConfirmContext["message"]>();
  const [resolve, setResolve] = useState<ConfirmContext["resolve"]>();

  return (
    <confirmContext.Provider
      value={{
        isAsking,
        setIsAsking,
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
