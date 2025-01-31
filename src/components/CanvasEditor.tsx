import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";
import { TextBoxData } from "@/types/canvas";

const DEFAULT_BOXES: TextBoxData[] = [
  { id: "1", order: 1, type: "logo", text: "Logo", top: 50, left: 50 },
  { id: "2", order: 2, type: "title", text: "Title", top: 120, left: 50 },
  { id: "3", order: 3, type: "subtitle", text: "Subtitle", top: 190, left: 50 },
  { id: "4", order: 4, type: "body", text: "Body", top: 260, left: 50 },
  { id: "5", order: 5, type: "cta", text: "CTA", top: 330, left: 50 },
];

export const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>(DEFAULT_BOXES);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 400,
      height: 500,
      backgroundColor: "#f3f3f3",
    });

    // Add text boxes
    textBoxes.forEach((box) => {
      const textBox = new IText(box.text, {
        left: box.left,
        top: box.top,
        fontSize: 24,
        fontFamily: "Inter",
        fill: "#2563EB",
        padding: 10,
        width: 300,
        lockScalingX: true,
        splitByGrapheme: true,
        borderColor: "#E5EFFF",
        editingBorderColor: "#2563EB",
        cursorColor: "#0066FF",
        borderDashArray: [5, 5],
        hasBorders: true,
        hasControls: false,
        selectable: true,
      });

      textBox.set({ id: box.id, order: box.order });
      canvas.add(textBox);
    });

    let draggedObject: IText | null = null;

    // Start moving
    canvas.on("object:moving", (e) => {
      draggedObject = e.target as IText;

      const obj = e.target as IText;
      // object stays within the canvas
      if (obj.left! < 0) obj.set("left", 0);
      if (obj.top! < 0) obj.set("top", 0);
      if (obj.left! + obj.width! > canvas.width!)
        obj.set("left", canvas.width! - obj.width!);
      if (obj.top! + obj.height! > canvas.height!)
        obj.set("top", canvas.height! - obj.height!);
    });

    // Start drawing
    canvas.on("object:modified", () => {
      if (draggedObject) {
        const objects = canvas.getObjects() as IText[];

        reOrder(draggedObject, canvas);

        const updatedBoxes = objects.map((obj) => ({
          id: obj.get("id") as string,
          order: obj.get("order") as number,
          type:
            textBoxes.find((b) => b.id === obj.get("id"))?.type ||
            ("" as TextBoxData["type"]),
          text: obj.text,
          left: obj.left,
          top: obj.top,
        }));

        setTextBoxes(updatedBoxes);
      }
    });

    // Reorder text boxes on drag
    const reOrder = (movedBox: IText, canvas: Canvas) => {
      const objects = canvas.getObjects() as IText[];

      const sortedObjects = [...objects].sort((a, b) => a.top! - b.top!);

      sortedObjects.forEach((obj, index) => {
        obj.set("top", 50 + index * 70);
      });

      canvas.renderAll();
    };

    return () => {
      canvas.dispose();
    };
  }, [textBoxes]);

  return (
    <div className="flex flex-col items-start gap-3 px-20 py-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Main Layouts</h1>
        <p className="text-gray-600 text-2xl tracking-wide">
          Apply template changes to all layouts by clicking on the "Apply to all
          banner sizes" arrow below.
        </p>
      </div>
      <h3 className="font-bold text-3xl text-blue-500">Fall Winter - EN</h3>
      <div className="border-2 border-canvas-border rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>

      <div className="flex gap-5 items-center">
        <div className="font-bold text-2xl text-blue-500 bg-slate-100 px-4 py-2 rounded-lg w-fit">
          Small Square - 200 x 200
        </div>
        <button className="font-bold text-2xl text-blue-500 w-fit bg-slate-100 px-4 py-1 rounded-lg flex items-center justify-center cursor-pointer">
          <label className="pb-2 text-black cursor-pointer">...</label>
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-md">
        <label className="flex items-center gap-4 text-blue-500 font-semibold text-2xl">
          <input
            type="checkbox"
            className="rounded h-6 w-6 border-gray-300 cursor-pointer"
          />
          Use GenAI to fill the space
        </label>
        <label className="flex items-center gap-4 text-blue-500 font-semibold text-2xl">
          <input
            type="checkbox"
            className="rounded h-6 w-6 border-gray-300 cursor-pointer"
          />
          Use GenAI to fit the subject
        </label>
      </div>
    </div>
  );
};