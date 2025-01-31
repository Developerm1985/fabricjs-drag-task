export interface TextBoxData {
  id: string;
  type: 'logo' | 'title' | 'subtitle' | 'body' | 'cta';
  text: string;
  top: number;
  left: number;
  order:number;
}

export interface CanvasProps {
  width: number;
  height: number;
}