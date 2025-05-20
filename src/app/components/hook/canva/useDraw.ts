import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: any) => void,
  setSignatureRefContent: any,
  setSignatureError: any
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef: any = useRef<any>(null);
  const signatureRef: any = useRef<any>(null);
  const prevPoint = useRef<null | any>(null);
  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureRef.current.value = "";
    setSignatureRefContent("");
    setSignatureError("");
    /* if (canvasRef.current) {
      signatureRef.current.value = "";
    } */
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      if (canvasRef.current && mouseDown) {
        signatureRef.current.value = canvasRef.current.toDataURL();
        setSignatureRefContent(canvasRef.current.toDataURL());
        setSignatureError("");
      }
      setMouseDown(false);
      prevPoint.current = null;
    };

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [mouseDown, onDraw]);

  return { canvasRef, signatureRef, onMouseDown, clear };
};
