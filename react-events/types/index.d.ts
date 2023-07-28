declare const module: NodeModule & {
  hot?: {
    accept: (path?: string, callback?: () => void) => void;
  };
}
