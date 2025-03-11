
import { useState } from "react";

// This hook manages a state variable with a default value and ensures
// it's always initialized in the same way regardless of conditions
export function useAuthState<T>(defaultValue: T) {
  // Always initialize the state - no conditional hooks
  const [state, setState] = useState<T>(defaultValue);
  
  // Function to update the state
  const updateState = (newValue: T) => {
    setState(newValue);
  };
  
  return { state, updateState };
}
