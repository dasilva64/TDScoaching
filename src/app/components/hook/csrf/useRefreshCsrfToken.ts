import { cs } from "@fullcalendar/core/internal-common";
import { useEffect, useState } from "react";

export function useRefreshCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCSRFToken = async () => {
      
      try {
        const response = await fetch("/api/refresh-csrf-token");
        if (!response.ok) {
          throw new Error("Erreur lors du rafraîchissement du CSRF token");
        }
        const data = await response.json();
        if (isMounted) {
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchCSRFToken, 60 * 1000 * 15);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
  return csrfToken;
}