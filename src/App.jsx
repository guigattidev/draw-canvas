import React, { useRef, useEffect, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  useEffect(() => {
    if (context) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [context, backgroundColor]);

  const startDrawing = (event) => {
    if (context) {
      context.beginPath();
      context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const handleColorChange = (event) => {
    setCurrentColor(event.target.value);
    context.strokeStyle = event.target.value;
  };

  const draw = (event) => {
    if (!drawing) return;
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    if (context) {
      context.closePath();
      setDrawing(false);
    }
  };

  const handleBrushSizeChange = (event) => {
    setBrushSize(event.target.value);
    context.lineWidth = event.target.value;
  };

  const clearCanvas = () => {
    if (context) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    context.globalCompositeOperation = isErasing
      ? "source-over"
      : "destination-out";
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  return (
    <div class="w-full flex items-center justify-center">
      <div class="bg-white rounded shadow p-4 m-4 w-full max-w-sm">
        <div className="board">
          <canvas
            ref={canvasRef}
            className="canvas"
            style={{ backgroundColor: backgroundColor }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
          />
          <div class="mt-4">
            <p>Canvas color:</p>
            <input
              type="color"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className="background-color-picker"
            />
          </div>
          <div class="mt-2">
            <p>Color brush:</p>
            <input
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="color-picker"
            />
          </div>
          <div class="mt-2">
            <p>Brush size:</p>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={handleBrushSizeChange}
              className="rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 w-128"
            />
          </div>
          <div class="mt-2">
            <p>Brush or Eraser pick:</p>
            <button
              onClick={toggleEraser}
              class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {isErasing ? "Brush" : "Eraser"}
            </button>
          </div>
          <div class="mt-4">
            <button
              onClick={clearCanvas}
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear Canvas
            </button>
          </div>
          <div class="mt-2">
            <button
              onClick={saveDrawing}
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Drawing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
