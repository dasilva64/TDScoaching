import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: any) => void,
  setSignatureRefContent: any,
  setSignatureError: any,
  setDateSignature: any,
  setValidSignature: any
) => {
  const [mouseDown, setMouseDown] = useState(false);
  //const [dateSignature, setDateSignature] = useState("")
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
    setDateSignature("")
     if (canvasRef.current) {
      signatureRef.current.value = "";
      setValidSignature(false)
    } 
  };

  useEffect(() => {
  const canvas = canvasRef.current; // Capture la ref une fois pour l'effet entier

  const handler = (e: MouseEvent) => {
    if (!mouseDown || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const currentPoint = { x, y };

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
    prevPoint.current = currentPoint;
  };

  const mouseUpHandler = () => {
    if (canvas && mouseDown) {
      const dataUrl = canvas.toDataURL();
      signatureRef.current.value = dataUrl;
      setSignatureRefContent(dataUrl);
      setSignatureError("");
      setDateSignature(new Date().toISOString());
      setValidSignature(true);
    }
    setMouseDown(false);
    prevPoint.current = null;
  };

  canvas?.addEventListener("mousemove", handler);
  window.addEventListener("mouseup", mouseUpHandler);

  return () => {
    canvas?.removeEventListener("mousemove", handler);
    window.removeEventListener("mouseup", mouseUpHandler);
  };
}, [mouseDown, onDraw, setDateSignature, setSignatureError, setSignatureRefContent, setValidSignature]);

  return { canvasRef, signatureRef, onMouseDown, clear };
};
